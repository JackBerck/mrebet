<?php

namespace App\Policies;

use App\Models\Blog;
use App\Models\User;

class BlogPolicy
{
    /**
     * Admin & Manager bisa lihat blog.
     */
    public function view(User $user, Blog $blog): bool
    {
        return true;
    }

    /**
     * Semua user terautentikasi bisa buat blog.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Admin edit semua. Manager hanya edit blog yang dia tulis sendiri.
     */
    public function update(User $user, Blog $blog): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $blog->user_id === $user->id;
    }

    /**
     * Admin delete semua. Manager hanya delete blog miliknya.
     */
    public function delete(User $user, Blog $blog): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $blog->user_id === $user->id;
    }

    /**
     * Hanya Admin yang bisa restore blog yang terhapus.
     */
    public function restore(User $user, Blog $blog): bool
    {
        return $user->isAdmin();
    }

    /**
     * Hanya Admin yang bisa force delete.
     */
    public function forceDelete(User $user, Blog $blog): bool
    {
        return $user->isAdmin();
    }
}
