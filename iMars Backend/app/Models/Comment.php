<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'body'
    ];

    public function likes()
    {
        return $this->belongsToMany(User::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
