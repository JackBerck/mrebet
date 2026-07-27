<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\Umkm;
use App\Models\User;

class MediaPolicy
{
    /**
     * Admin & Manager bisa lihat media.
     */
    public function view(User $user, Media $media): bool
    {
        return $user->isAdmin() || $this->ownsMediaOwner($user, $media);
    }

    /**
     * Semua user terautentikasi bisa upload media.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Admin edit semua. Manager edit media miliknya.
     */
    public function update(User $user, Media $media): bool
    {
        return $user->isAdmin() || $this->ownsMediaOwner($user, $media);
    }

    /**
     * Admin delete semua. Manager delete media miliknya.
     */
    public function delete(User $user, Media $media): bool
    {
        return $user->isAdmin() || $this->ownsMediaOwner($user, $media);
    }

    /**
     * Cek apakah user memiliki akses ke parent entity media.
     */
    private function ownsMediaOwner(User $user, Media $media): bool
    {
        $owner = $media->mediable;

        if (! $owner) {
            return false;
        }

        if ($owner instanceof Umkm) {
            return $user->umkm_id === $owner->id;
        }

        return true;
    }
}
