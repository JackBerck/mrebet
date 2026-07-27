<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Admin & Manager lihat semua event.
     */
    public function view(User $user, Event $event): bool
    {
        return true;
    }

    /**
     * Semua user terautentikasi bisa buat event.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Admin & Manager bisa edit event.
     */
    public function update(User $user, Event $event): bool
    {
        return true;
    }

    /**
     * Admin & Manager bisa delete event.
     */
    public function delete(User $user, Event $event): bool
    {
        return true;
    }

    /**
     * Hanya Admin yang bisa restore.
     */
    public function restore(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya Admin yang bisa force delete.
     */
    public function forceDelete(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }
}
