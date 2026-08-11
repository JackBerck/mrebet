<?php

use App\Http\Controllers\Admin\AdminAiController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDestinationController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminUmkmController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\PublicBlogController;
use App\Http\Controllers\Public\PublicDestinationController;
use App\Http\Controllers\Public\PublicEventController;
use App\Http\Controllers\Public\PublicMapController;
use App\Http\Controllers\Public\PublicUmkmController;
use App\Http\Controllers\Public\SitemapController;
use Illuminate\Support\Facades\Route;
use Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController;
use Laravel\Passkeys\Http\Controllers\PasskeyRegistrationController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
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
Route::get('/umkm', [PublicUmkmController::class, 'index'])->name('umkms.index');
Route::get('/umkm/{umkm:slug}', [PublicUmkmController::class, 'show'])->name('umkms.show');
Route::get('/peta', [PublicMapController::class, 'index'])->name('map.index');

// Admin panel — requires auth + verified + is_active
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->group(function () {
        Route::redirect('/', '/admin/dashboard');

        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // UMKM
        Route::resource('umkms', AdminUmkmController::class)->except(['show']);
        Route::patch('umkms/{umkm}/status', [AdminUmkmController::class, 'updateStatus'])
            ->name('umkms.status')
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

        // AI Generator
        Route::post('/ai/generate-description', [AdminAiController::class, 'generateDescription'])
            ->name('ai.generate-description');

        // Users
        Route::resource('users', AdminUserController::class)->except(['show', 'destroy']);
        Route::patch('users/{user}/status', [AdminUserController::class, 'updateStatus'])
            ->name('users.status')
            ->middleware('admin');

        // Site Settings
        Route::get('/settings/site', [AdminSettingController::class, 'edit'])
            ->name('site-settings.edit')
            ->middleware('admin');
        Route::put('/settings/site', [AdminSettingController::class, 'update'])
            ->name('site-settings.update')
            ->middleware('admin');
    });

require __DIR__.'/settings.php';

// Stub routes for Wayfinder frontend type generation when Fortify features are disabled
Route::name('register')->get('/register', fn () => abort(404));
Route::name('register.store')->post('/register', fn () => abort(404));
Route::name('verification.notice')->get('/email/verify', fn () => abort(404));
Route::name('verification.send')->post('/email/verification-notification', fn () => abort(404));
Route::name('two-factor.login')->get('/two-factor-challenge', fn () => abort(404));
Route::name('two-factor.login.store')->post('/two-factor/login', fn () => abort(404));
Route::name('two-factor.enable')->post('/user/two-factor-authentication', fn () => abort(404));
Route::name('two-factor.disable')->delete('/user/two-factor-authentication', fn () => abort(404));
Route::name('two-factor.confirm')->post('/user/confirmed-two-factor-authentication', fn () => abort(404));
Route::name('two-factor.regenerate-recovery-codes')->post('/user/two-factor-recovery-codes', fn () => abort(404));
Route::name('two-factor.qr-code')->get('/user/two-factor-qr-code', fn () => abort(404));
Route::name('two-factor.secret-key')->get('/user/two-factor-secret-key', fn () => abort(404));
Route::name('two-factor.recovery-codes')->get('/user/two-factor-recovery-codes', fn () => abort(404));
Route::name('password.email')->post('/forgot-password', fn () => abort(404));
Route::name('password.update')->post('/reset-password', fn () => abort(404));

Route::get('/user/passkeys/confirm', [PasskeyConfirmationController::class, 'index']);
Route::post('/user/passkeys/confirm', [PasskeyConfirmationController::class, 'store']);
Route::get('/user/passkeys', [PasskeyRegistrationController::class, 'index']);
Route::post('/user/passkeys', [PasskeyRegistrationController::class, 'store']);
Route::delete('/user/passkeys/{passkey}', [PasskeyRegistrationController::class, 'destroy']);
