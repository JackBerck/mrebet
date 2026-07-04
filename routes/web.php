<?php

use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDestinationController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminVillageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
