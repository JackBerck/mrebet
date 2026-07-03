<?php

namespace App\Policies;

use App\Models\Destination;
use App\Models\User;

class DestinationPolicy
{
    /**
     * Admin bisa lihat semua destinasi. Manager hanya lihat destinasi di desanya.
     */
    public function view(User $user, Destination $destination): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $destination->village_id;
    }

    /**
     * Manager hanya bisa buat destinasi untuk desanya sendiri.
     */
    public function create(User $user): bool
    {
        return true; // Semua user bisa buat — village_id enforce di controller
    }

    /**
     * Admin edit semua. Manager hanya edit destinasi milik desanya.
     */
    public function update(User $user, Destination $destination): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $destination->village_id;
    }

    /**
     * Admin delete semua. Manager hanya delete destinasi milik desanya.
     */
    public function delete(User $user, Destination $destination): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $destination->village_id;
    }

    /**
     * Hanya Admin yang bisa restore.
     */
    public function restore(User $user, Destination $destination): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya Admin yang bisa force delete.
     */
    public function forceDelete(User $user, Destination $destination): bool
    {
        return $user->isAdmin();
    }
}
