<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    // List reports — students see their own, admins see all
    public function index(Request $request)
    {
        $user = $request->user();

        $reports = $user->isAdmin()
            ? Report::with('user')->latest()->get()
            : $user->reports()->latest()->get();

        return response()->json($reports);
    }

    // Create a new report, with optional photo upload
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:80'],
            'category' => ['required', 'string', 'max:100'],
            'building' => ['required', 'string', 'max:150'],
            'room' => ['nullable', 'string', 'max:50'],
            'description' => ['required', 'string'],
            'urgency' => ['required', 'string', 'max:20'],
            'photo' => ['nullable', 'image', 'max:5120'], // 5MB max
        ]);

        $photoPath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $this->uploadPhoto($request->file('photo'));
        }

        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'building' => $validated['building'],
            'room' => $validated['room'] ?? null,
            'description' => $validated['description'],
            'urgency' => $validated['urgency'],
            'status' => 'Submitted',
            'photo_path' => $photoPath,
        ]);

        return response()->json($report, 201);
    }

    // View a single report
    public function show(Request $request, Report $report)
    {
        $user = $request->user();

        if (! $user->isAdmin() && $report->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($report);
    }

    public function update(Request $request, Report $report)
{
    if (! $request->user()->isAdmin()) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $validated = $request->validate([
        'status' => ['sometimes', 'string', 'max:30'],
        'assigned_to' => ['sometimes', 'nullable', 'string', 'max:255'],
    ]);

    if (isset($validated['status'])) {
        if ($validated['status'] === 'In Progress' && ! $report->in_progress_at) {
            $validated['in_progress_at'] = now();
        }
        if ($validated['status'] === 'Resolved' && ! $report->resolved_at) {
            $validated['resolved_at'] = now();
        }
    }

    $report->update($validated);

    return response()->json($report);
}

    private function uploadPhoto($file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $bucket = config('services.supabase.bucket');
        $url = config('services.supabase.url') . "/storage/v1/object/{$bucket}/{$filename}";

        Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.supabase.service_key'),
            'apikey' => config('services.supabase.service_key'),
            'Content-Type' => $file->getMimeType(),
        ])->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
          ->post($url);

        return $filename;
    }

    public function analytics(Request $request)
    {
    if (! $request->user()->isAdmin()) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    $total = Report::count();
    $resolved = Report::where('status', 'Resolved')->count();
    $inProgress = Report::where('status', 'In Progress')->count();
    $pending = Report::where('status', 'Submitted')->count();

    $byCategory = Report::selectRaw('category, count(*) as count')
        ->groupBy('category')
        ->get();

    $last30Days = Report::selectRaw('DATE(created_at) as date, count(*) as count')
        ->where('created_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    return response()->json([
        'total' => $total,
        'resolved' => $resolved,
        'in_progress' => $inProgress,
        'pending' => $pending,
        'resolution_rate' => $total ? round(($resolved / $total) * 100) : 0,
        'by_category' => $byCategory,
        'trend' => $last30Days,
    ]);
    }
}