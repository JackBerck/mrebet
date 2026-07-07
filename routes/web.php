<?php

use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDestinationController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminVillageController;
use App\Http\Controllers\Public\HomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Guard /register — only admin role can access; guests redirected to home
Route::get('/register', function () {
    if (! auth()->check()) {
        return redirect()->route('home');
    }

    if (auth()->user()->role?->value !== 'admin') {
        return redirect()->route('home');
    }

    // Let Fortify handle the view for authenticated admins
    return app()->call(RegisteredUserController::class.'@create');
})->middleware('web')->name('register');

// Admin panel — requires auth + verified + is_active
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->group(function () {
        Route::redirect('/', '/admin/dashboard');

        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Villages
        Route::get('villages/edit', [AdminVillageController::class, 'editManager'])->name('villages.manager.edit');
        Route::put('villages/edit', [AdminVillageController::class, 'updateManager'])->name('villages.manager.update');
        Route::resource('villages', AdminVillageController::class)->except(['show']);
        Route::patch('villages/{village}/status', [AdminVillageController::class, 'updateStatus'])
            ->name('villages.status')
            ->middleware('admin');

        // Destinations
        Route::resource('destinations', AdminDestinationController::class)->except(['show']);
        Route::patch('destinations/{destination}/status', [AdminDestinationController::class, 'updateStatus'])
            ->name('destinations.status')
            ->middleware('admin');

        // Events
        Route::resource('events', AdminEventController::class)->except(['show']);
        Route::patch('events/{event}/status', [AdminEventController::class, 'updateStatus'])
            ->name('events.status')
            ->middleware('admin');

        // Blogs
        Route::resource('blogs', AdminBlogController::class)->except(['show']);
        Route::patch('blogs/{blog}/status', [AdminBlogController::class, 'updateStatus'])
            ->name('blogs.status')
            ->middleware('admin');
    });

require __DIR__.'/settings.php';
