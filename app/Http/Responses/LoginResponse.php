<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Setelah login berhasil, redirect ke halaman home (bukan dashboard).
     * Pengunjung umum dan admin sama-sama diarahkan ke homepage,
     * lalu bisa navigasi ke /admin/dashboard secara manual.
     */
    public function toResponse($request)
    {
        return redirect()->intended(route('home'));
    }
}
