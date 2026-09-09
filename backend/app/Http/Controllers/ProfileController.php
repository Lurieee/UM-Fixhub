<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProfileController extends Controller
{
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
        ]);

        $file = $request->file('photo');
        $filename = 'user-' . $request->user()->id . '.' . $file->getClientOriginalExtension();

        Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.supabase.service_key'),
            'apikey' => config('services.supabase.service_key'),
            'Content-Type' => $file->getMimeType(),
            'x-upsert' => 'true',
        ])->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
          ->post(config('services.supabase.url') . "/storage/v1/object/avatars/{$filename}");

        $request->user()->update(['avatar_path' => $filename]);

        return response()->json($request->user()->fresh());
    }
}