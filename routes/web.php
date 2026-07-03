<?php

use App\Http\Controllers\Admin\AdminDashboardController;
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

        // Manager specific routes (must be before resource)
        Route::get('villages/edit', [AdminVillageController::class, 'editManager'])->name('villages.manager.edit');
        Route::put('villages/edit', [AdminVillageController::class, 'updateManager'])->name('villages.manager.update');

        // Village CRUD (policy enforced inside controller)
        Route::resource('villages', AdminVillageController::class);

        // Village status toggle — admin only
        Route::patch('villages/{village}/status', [AdminVillageController::class, 'updateStatus'])
            ->name('villages.status')
            ->middleware('admin');
    });

require __DIR__.'/settings.php';
