<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    private const MODEL = 'gemini-3.6-flash';

    private const MAX_TOOL_ROUNDS = 3;

    private const SYSTEM_PROMPT = <<<'EOT'
You are the UM FixHub campus assistant, a helpful guide for students and staff at the University of Mindanao facilities reporting app.

You can:
- Answer general questions about how the app works (reporting issues, checking status, categories available: Electrical, Plumbing, Furniture, Infrastructure, Cleanliness, Other).
- Look up the logged-in user's own submitted reports using the get_my_reports tool.
- Help a user draft a new report using the draft_report tool. Ask clarifying questions if needed (what building, what's wrong, how urgent) before drafting. Once you have enough detail, call draft_report — you are NOT submitting it, only preparing a draft for the user to review themselves in the app.

You never invent report data. You never claim to have submitted, updated, or deleted anything — the user always takes the final action themselves in the app.
Keep replies concise and friendly.
EOT;

    private function tools(): array
    {
        return [[
            'functionDeclarations' => [
                [
                    'name' => 'get_my_reports',
                    'description' => "Look up the logged-in user's own submitted maintenance reports and their statuses.",
                    'parameters' => [
                        'type' => 'object',
                        'properties' => new \stdClass(),
                    ],
                ],
                [
                    'name' => 'draft_report',
                    'description' => 'Prepare a draft maintenance report for the user to review. Does not submit anything.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string', 'description' => 'Short issue title'],
                            'category' => [
                                'type' => 'string',
                                'enum' => ['Electrical', 'Plumbing', 'Furniture', 'Infrastructure', 'Cleanliness', 'Other'],
                            ],
                            'building' => ['type' => 'string', 'description' => 'Building code, e.g. DPT, BE, GET, CTE, PS, FEA'],
                            'room' => ['type' => 'string'],
                            'description' => ['type' => 'string', 'description' => 'What is wrong, in detail'],
                            'urgency' => ['type' => 'string', 'enum' => ['Low', 'Medium', 'High']],
                        ],
                        'required' => ['title', 'category', 'building', 'description', 'urgency'],
                    ],
                ],
            ],
        ]];
    }

    private function callGemini(array $contents): array
    {
        $key = config('services.gemini.key');

        if (! $key) {
            \Log::error('GEMINI: API key is empty. Set GEMINI_API_KEY in .env, make sure config/services.php reads it, then run php artisan config:clear');

            return ['error' => ['message' => 'Missing Gemini API key']];
        }

        try {
            // Key goes in a header so it never ends up in URLs, logs or exception messages.
            $response = Http::withHeaders(['x-goog-api-key' => $key])
                ->timeout(45)
                ->connectTimeout(5)
                ->post(
                    'https://generativelanguage.googleapis.com/v1beta/models/'.self::MODEL.':generateContent',
                    [
                        'system_instruction' => ['parts' => [['text' => self::SYSTEM_PROMPT]]],
                        'contents' => $contents,
                        'tools' => $this->tools(),
                    ]
                );

            if ($response->failed()) {
                \Log::error('GEMINI HTTP ERROR', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body(),
                ]);

                return $response->json() ?? ['error' => ['message' => 'HTTP '.$response->status()]];
            }

            return $response->json() ?? [];
        } catch (\Throwable $e) {
            \Log::error('GEMINI CALL FAILED: '.$e->getMessage());

            return ['error' => ['message' => $e->getMessage()]];
        }
    }

    /**
     * PHP decodes Gemini's empty {} args as an empty array, which then re-encodes
     * as [] instead of {} — Gemini's API rejects that. Force it back to an object.
     */
    private function asObjectIfEmpty($value)
    {
        return empty($value) ? new \stdClass() : $value;
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string'],
            'history' => ['sometimes', 'array'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,model'],
            'history.*.text' => ['required_with:history', 'string'],
        ]);

        $contents = [];
        foreach ($validated['history'] ?? [] as $turn) {
            // Gemini requires the conversation to start with a user turn.
            if (empty($contents) && $turn['role'] !== 'user') {
                continue;
            }
            $contents[] = ['role' => $turn['role'], 'parts' => [['text' => $turn['text']]]];
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $validated['message']]]];

        $draft = null;

        $data = $this->callGemini($contents);
        \Log::info('GEMINI RAW RESPONSE', $data);

        // Let the model call tools for a few rounds (e.g. look up reports, then draft one).
        for ($round = 0; $round < self::MAX_TOOL_ROUNDS; $round++) {
            $parts = $data['candidates'][0]['content']['parts'] ?? [];
            $hasCall = collect($parts)->contains(fn ($part) => isset($part['functionCall']));

            if (! $hasCall) {
                break;
            }

            $modelParts = [];
            $responseParts = [];

            foreach ($parts as $part) {
                if (! isset($part['functionCall'])) {
                    $modelParts[] = $part;
                    continue;
                }

                $name = $part['functionCall']['name'];
                $args = $part['functionCall']['args'] ?? [];

                if ($name === 'get_my_reports') {
                    $reports = Report::where('user_id', $request->user()->id)
                        ->orderBy('created_at', 'desc')
                        ->get(['id', 'title', 'category', 'status', 'urgency', 'building', 'room', 'created_at']);

                    $functionResult = ['reports' => $reports];
                } elseif ($name === 'draft_report') {
                    $draft = $args;
                    $functionResult = ['status' => 'draft_prepared'];
                } else {
                    $functionResult = ['error' => 'Unknown tool'];
                }

                // Echo the call back exactly as received (keeps any thought signature),
                // only fixing empty args so they encode as {} instead of [].
                $part['functionCall']['args'] = $this->asObjectIfEmpty($args);
                $modelParts[] = $part;

                $responseParts[] = [
                    'functionResponse' => [
                        'name' => $name,
                        'response' => $this->asObjectIfEmpty($functionResult),
                    ],
                ];
            }

            $contents[] = ['role' => 'model', 'parts' => $modelParts];
            $contents[] = ['role' => 'user', 'parts' => $responseParts];

            $data = $this->callGemini($contents);
            \Log::info('GEMINI RAW RESPONSE (after tool call)', $data);
        }

        $parts = $data['candidates'][0]['content']['parts'] ?? [];

        $reply = collect($parts)
            ->reject(fn ($part) => $part['thought'] ?? false)
            ->pluck('text')
            ->filter()
            ->implode(' ');

        $finishReason = $data['candidates'][0]['finishReason'] ?? null;
        $errorMessage = $data['error']['message'] ?? null;

        if ($reply === '') {
            if ($errorMessage) {
                \Log::error('CHAT: no reply because of an AI service error', ['error' => $errorMessage]);
                $reply = "I couldn't reach the assistant service just now. Please try again in a moment.";
            } elseif ($draft) {
                $reply = "I've prepared a draft report for you. Review it and tap \"Use this draft\" to continue.";
            } else {
                \Log::warning('CHAT: empty model reply', [
                    'finishReason' => $finishReason,
                    'promptFeedback' => $data['promptFeedback'] ?? null,
                ]);
                $reply = "I'm not sure how to respond to that.";
            }
        }

        return response()->json([
            'reply' => $reply,
            'draft' => $draft,
            // Only visible while APP_DEBUG=true, so you can read the cause in the Network tab.
            'debug' => config('app.debug') ? ['error' => $errorMessage, 'finishReason' => $finishReason] : null,
        ]);
    }
}