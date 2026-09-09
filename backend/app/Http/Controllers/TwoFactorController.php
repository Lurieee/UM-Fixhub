<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    public function generate(Request $request)
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $request->user()->update(['two_factor_secret' => $secret]);

        $otpauthUrl = $google2fa->getQRCodeUrl(
            'UM FixHub',
            $request->user()->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'otpauth_url' => $otpauthUrl,
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate(['code' => ['required', 'string']]);

        $user = $request->user();
        $google2fa = new Google2FA();

        if (! $user->two_factor_secret || ! $google2fa->verifyKey($user->two_factor_secret, $request->code)) {
            return response()->json(['message' => 'Invalid code.'], 422);
        }

        $user->update(['two_factor_enabled' => true]);

        return response()->json(['message' => 'Two-factor authentication enabled.']);
    }

    public function disable(Request $request)
    {
        $request->user()->update([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
        ]);

        return response()->json(['message' => 'Two-factor authentication disabled.']);
    }

    public function verifyLogin(Request $request)
    {
        $request->validate([
            'temp_token' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        $userId = Cache::get('2fa_pending_' . $request->temp_token);
        if (! $userId) {
            return response()->json(['message' => 'This login attempt has expired. Please log in again.'], 422);
        }

        $user = \App\Models\User::find($userId);
        $google2fa = new Google2FA();

        if (! $google2fa->verifyKey($user->two_factor_secret, $request->code)) {
            return response()->json(['message' => 'Invalid code.'], 422);
        }

        Cache::forget('2fa_pending_' . $request->temp_token);
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }
}