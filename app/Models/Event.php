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
 * @property int|null $village_id
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
        'village_id',
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
        'qr_code_target',
        'status',
    ];

    /**
     * Slug di-generate dari kolom title event.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(180)
            ->usingSeparator('-');
    }

    /**
     * Set rute default menggunakan slug (untuk URL yang SEO friendly).
     */
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
            'start_date' => 'date',
            'end_date' => 'date',
            'ticket_price' => 'decimal:2',
            'deleted_at' => 'datetime',
            'status' => ContentStatus::class,
        ];
    }

    /** Desa penyelenggara event (opsional). */
    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    /** Destinasi lokasi event (opsional). */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    /** Foto/media event. */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /** Foto cover/primary (singular). */
    public function primaryMedia(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable')->where('is_primary', true);
    }

    /** Cek apakah event masih akan berlangsung. */
    public function isUpcoming(): bool
    {
        return $this->start_date->isFuture();
    }

    /** Cek apakah event sudah selesai. */
    public function isFinished(): bool
    {
        $endDate = $this->end_date ?? $this->start_date;

        return $endDate->isPast();
    }

    /** Cek apakah event gratis. */
    public function isFree(): bool
    {
        return $this->ticket_price == 0;
    }
}
