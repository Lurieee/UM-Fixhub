<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    private const MODEL = 'gemini-3.6-flash';

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
    try {
        $response = Http::timeout(15)
            ->connectTimeout(5)
            ->post(
                'https://generativelanguage.googleapis.com/v1beta/models/'.self::MODEL.':generateContent?key='.config('services.gemini.key'),
                [
                    'system_instruction' => ['parts' => [['text' => self::SYSTEM_PROMPT]]],
                    'contents' => $contents,
                    'tools' => $this->tools(),
                ]
            );

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
            $contents[] = ['role' => $turn['role'], 'parts' => [['text' => $turn['text']]]];
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $validated['message']]]];

        $data = $this->callGemini($contents);
        \Log::info('GEMINI RAW RESPONSE', $data);
        $parts = $data['candidates'][0]['content']['parts'] ?? [];

        $draft = null;

        foreach ($parts as $part) {
            if (isset($part['functionCall'])) {
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

                $functionCallPart = $part;
$functionCallPart['functionCall']['args'] = $this->asObjectIfEmpty($args);
$contents[] = ['role' => 'model', 'parts' => [$functionCallPart]];
                $contents[] = ['role' => 'user', 'parts' => [[
                    'functionResponse' => [
                        'name' => $name,
                        'response' => $this->asObjectIfEmpty($functionResult),
                    ],
                ]]];

                $data = $this->callGemini($contents);
                \Log::info('GEMINI RAW RESPONSE (after tool call)', $data);
                $parts = $data['candidates'][0]['content']['parts'] ?? [];
            }
        }

        $reply = collect($parts)->pluck('text')->filter()->implode(' ') ?: "I'm not sure how to respond to that.";

        return response()->json([
            'reply' => $reply,
            'draft' => $draft,
        ]);
    }
}