<?php

namespace App\Models;

use App\Concerns\HasGmapsCoordinates;
use App\Enums\ContentStatus;
use App\Enums\UmkmCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property UmkmCategory $category
 * @property string|null $owner_name
 * @property string|null $description
 * @property string|null $address
 * @property string|null $contact_phone
 * @property string|null $price_range
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $gmaps_link
 * @property string|null $qr_code_target
 * @property ContentStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Umkm extends Model
{
    use HasFactory, HasGmapsCoordinates, HasSlug, SoftDeletes;

    protected $table = 'umkms';

    protected $fillable = [
        'name',
        'slug',
        'category',
        'owner_name',
        'description',
        'address',
        'contact_phone',
        'price_range',
        'latitude',
        'longitude',
        'gmaps_link',
        'qr_code_target',
        'status',
    ];

    protected $hidden = [
        'point',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(160)
            ->usingSeparator('-');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => UmkmCategory::class,
            'latitude' => 'float',
            'longitude' => 'float',
            'deleted_at' => 'datetime',
            'status' => ContentStatus::class,
        ];
    }

    public function managers(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'manager');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function primaryMedia(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable')->where('is_primary', true);
    }

    public function isPublished(): bool
    {
        return $this->status === ContentStatus::Published;
    }
}
