<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $village_id
 * @property string $title
 * @property string $slug
 * @property string $content
 * @property string|null $cover_image
 * @property ContentStatus $status
 * @property int $views_count
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Blog extends Model
{
    use HasFactory, HasSlug, SoftDeletes;

    protected $fillable = [
        'user_id',
        'village_id',
        'title',
        'slug',
        'content',
        'cover_image',
        'status',
        'views_count',
        'published_at',
    ];

    /**
     * Slug di-generate dari kolom title.
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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'views_count' => 'integer',
            'deleted_at' => 'datetime',
            'status' => ContentStatus::class,
        ];
    }

    /**
     * Penulis blog ini.
     * Business rule: manager hanya bisa buat blog untuk desanya sendiri.
     * Enforce ini di controller/policy, bukan di sini.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Desa yang dikaitkan dengan blog ini (opsional). */
    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    /** Tambah hitungan view (atomic increment). */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /** Cek status published. */
    public function isPublished(): bool
    {
        return $this->status === ContentStatus::Published;
    }
}
