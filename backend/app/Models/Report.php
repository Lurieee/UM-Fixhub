<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'title', 'category', 'building', 'room', 'description', 'urgency', 'status', 'photo_path', 'assigned_to'])]
class Report extends Model
{
    use HasFactory;

    protected $appends = ['photo_url'];

    protected $casts = [
        'in_progress_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        if (! $this->photo_path) {
            return null;
        }

        $bucket = config('services.supabase.bucket');
        return config('services.supabase.url') . "/storage/v1/object/public/{$bucket}/{$this->photo_path}";
    }
}

