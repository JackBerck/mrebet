<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $head_name
 * @property string|null $contact_phone
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $qr_code_target
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Village extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'head_name',
        'contact_phone',
        'latitude',
        'longitude',
        'qr_code_target',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'deleted_at' => 'datetime',
        ];
    }

    /** Semua destinasi wisata yang ada di desa ini. */
    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class);
    }

    /** Semua event yang diadakan di desa ini. */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /** Blog/artikel yang dikaitkan dengan desa ini. */
    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class);
    }

    /** Manager (admin desa) yang mengelola desa ini. */
    public function managers(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'manager');
    }

    /** Semua foto/media galeri desa ini. */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /** Foto cover/primary (singular). */
    public function primaryMedia(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable')->where('is_primary', true);
    }

    /** Cek status published. */
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }
}
