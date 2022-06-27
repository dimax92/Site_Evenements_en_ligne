<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class evenements extends Model
{
    use HasFactory;
    protected $fillable = ["user_id", "titre", "description", "date", "lieu", "longitude", "lattitude"];
}
