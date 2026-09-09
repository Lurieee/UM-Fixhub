<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\ProfileController;


Route::post('/2fa/login', [TwoFactorController::class, 'verifyLogin']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{report}', [ReportController::class, 'show']);
    Route::patch('/reports/{report}', [ReportController::class, 'update']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/analytics', [ReportController::class, 'analytics']);
    Route::post('/2fa/generate', [TwoFactorController::class, 'generate']);
    Route::post('/2fa/confirm', [TwoFactorController::class, 'confirm']);
    Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);

    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);

    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
}); 
