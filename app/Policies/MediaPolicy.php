<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\User;
use App\Models\Village;

class MediaPolicy
{
    /**
     * Admin lihat semua media.
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
     * Admin edit semua. Manager edit media milik entitas desanya.
     */
    public function update(User $user, Media $media): bool
    {
        return $user->isAdmin() || $this->ownsMediaOwner($user, $media);
    }

    /**
     * Admin delete semua. Manager delete media entitas desanya.
     */
    public function delete(User $user, Media $media): bool
    {
        return $user->isAdmin() || $this->ownsMediaOwner($user, $media);
    }

    /**
     * Cek apakah user memiliki akses ke parent entity media (Village / Destination).
     * Event diasumsikan selalu dikelola admin atau manager desa terkait.
     */
    private function ownsMediaOwner(User $user, Media $media): bool
    {
        $owner = $media->mediable;

        if (! $owner) {
            return false;
        }

        // Jika owner adalah Village
        if ($owner instanceof Village) {
            return $user->village_id === $owner->id;
        }

        // Jika owner adalah Destination atau Event (keduanya punya village_id)
        if (property_exists($owner, 'village_id')) {
            return $user->village_id === $owner->village_id;
        }

        return false;
    }
}
