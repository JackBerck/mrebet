<?php

use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDestinationController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminVillageController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\PublicBlogController;
use App\Http\Controllers\Public\PublicDestinationController;
use App\Http\Controllers\Public\PublicEventController;
use App\Http\Controllers\Public\PublicMapController;
use App\Http\Controllers\Public\PublicVillageController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', [PageController::class, 'about'])->name('about');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/privacy-policy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/panduan', [PageController::class, 'guidelines'])->name('guidelines');
Route::get('/kemitraan', [PageController::class, 'partnership'])->name('partnership');
Route::get('/event', [PublicEventController::class, 'index'])->name('events.index');
Route::get('/event/{event:slug}', [PublicEventController::class, 'show'])->name('events.show');
Route::get('/berita', [PublicBlogController::class, 'index'])->name('blogs.index');
Route::get('/berita/{blog:slug}', [PublicBlogController::class, 'show'])->name('blogs.show');
Route::get('/destinasi', [PublicDestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinasi/{destination:slug}', [PublicDestinationController::class, 'show'])->name('destinations.show');
Route::get('/desa', [PublicVillageController::class, 'index'])->name('villages.index');
Route::get('/desa/{village:slug}', [PublicVillageController::class, 'show'])->name('villages.show');
Route::get('/peta', [PublicMapController::class, 'index'])->name('map.index');

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
