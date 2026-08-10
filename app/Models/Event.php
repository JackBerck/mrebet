<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int|null $umkm_id
 * @property int|null $destination_id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property Carbon $start_date
 * @property Carbon|null $end_date
 * @property string|null $start_time
 * @property string|null $end_time
 * @property float $ticket_price
 * @property string|null $organizer
 * @property string|null $instagram
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $gmaps_link
 * @property string|null $latitude
 * @property string|null $longitude
 * @property string|null $qr_code_target
 * @property ContentStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Event extends Model
{
    use HasFactory, HasSlug, SoftDeletes;

    protected $fillable = [
        'destination_id',
        'title',
        'slug',
        'description',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'ticket_price',
        'organizer',
        'instagram',
        'contact_person',
        'gmaps_link',
        'qr_code_target',
        'status',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(180)
            ->usingSeparator('-');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'ticket_price' => 'decimal:2',
            'deleted_at' => 'datetime',
            'status' => ContentStatus::class,
        ];
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function primaryMedia(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable')->where('is_primary', true);
    }

    public function isUpcoming(): bool
    {
        return $this->start_date->isFuture();
    }

    public function isFinished(): bool
    {
        $endDate = $this->end_date ?? $this->start_date;

        return $endDate->isPast();
    }

    public function isFree(): bool
    {
        return $this->ticket_price == 0;
    }
}
