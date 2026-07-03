<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Village;

class VillagePolicy
{
    /**
     * Admin bisa lihat semua desa. Manager hanya bisa lihat desanya.
     */
    public function view(User $user, Village $village): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $village->id;
    }

    /**
     * Admin bisa buat desa baru. Manager tidak boleh.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Admin bisa edit semua desa. Manager hanya bisa edit desanya sendiri.
     */
    public function update(User $user, Village $village): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $village->id;
    }

    /**
     * Hanya Admin yang boleh hapus (soft delete) desa.
     */
    public function delete(User $user, Village $village): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya Admin yang boleh restore desa yang di-soft-delete.
     */
    public function restore(User $user, Village $village): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya Admin yang boleh force delete.
     */
    public function forceDelete(User $user, Village $village): bool
    {
        return $user->isAdmin();
    }
}
