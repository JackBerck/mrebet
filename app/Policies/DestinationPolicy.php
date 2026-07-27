<?php

namespace App\Policies;

use App\Models\Destination;
use App\Models\User;

class DestinationPolicy
{
    /**
     * Admin & Manager dapat melihat destinasi.
     */
    public function view(User $user, Destination $destination): bool
    {
        return true;
    }

    /**
     * Semua user terautentikasi (Admin / Manager) bisa membuat destinasi.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Admin & Manager bisa mengedit destinasi.
     */
    public function update(User $user, Destination $destination): bool
    {
        return true;
    }

    /**
     * Admin & Manager bisa menghapus destinasi.
     */
    public function delete(User $user, Destination $destination): bool
    {
        return true;
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
