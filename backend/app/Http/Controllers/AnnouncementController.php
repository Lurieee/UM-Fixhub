<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        return response()->json(
            Announcement::orderBy('created_at', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string'],
        ]);

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $announcement->delete();

        return response()->json(['message' => 'Deleted']);
    }
}