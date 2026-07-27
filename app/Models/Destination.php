<?php

namespace App\Models;

use App\Enums\ContentStatus;
use App\Enums\DestinationCategory;
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
 * @property int|null $umkm_id
 * @property string $name
 * @property string $slug
 * @property DestinationCategory $category
 * @property string|null $description
 * @property float $ticket_price
 * @property string|null $ticket_info
 * @property string|null $open_time
 * @property string|null $close_time
 * @property string|null $operational_days
 * @property array|null $facilities
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $gmaps_link
 * @property string|null $qr_code_target
 * @property ContentStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Destination extends Model
{
    use HasFactory, HasSlug, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'ticket_price',
        'ticket_info',
        'open_time',
        'close_time',
        'operational_days',
        'facilities',
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

    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            'ticket_price' => 'decimal:2',
            'latitude' => 'float',
            'longitude' => 'float',
            'deleted_at' => 'datetime',
            'category' => DestinationCategory::class,
            'status' => ContentStatus::class,
        ];
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function primaryMedia(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable')->where('is_primary', true);
    }

    public function isFree(): bool
    {
        return $this->ticket_price == 0;
    }

    public function isPublished(): bool
    {
        return $this->status === ContentStatus::Published;
    }
}
