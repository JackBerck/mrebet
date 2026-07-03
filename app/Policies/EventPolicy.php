<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Admin lihat semua event. Manager lihat event yang village_id-nya miliknya.
     */
    public function view(User $user, Event $event): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $event->village_id;
    }

    /**
     * Semua user terautentikasi bisa buat event. village_id di-scope di controller.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Admin edit semua. Manager edit event desanya.
     */
    public function update(User $user, Event $event): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $event->village_id;
    }

    /**
     * Admin delete semua. Manager delete event desanya.
     */
    public function delete(User $user, Event $event): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->village_id === $event->village_id;
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
