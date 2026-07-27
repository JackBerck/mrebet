<?php

namespace App\Policies;

use App\Models\Umkm;
use App\Models\User;

class UmkmPolicy
{
    public function view(User $user, Umkm $umkm): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->umkm_id === $umkm->id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Umkm $umkm): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->umkm_id === $umkm->id;
    }

    public function delete(User $user, Umkm $umkm): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Umkm $umkm): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Umkm $umkm): bool
    {
        return $user->isAdmin();
    }
}
