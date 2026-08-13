<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('umkms', 'qr_code_target')) {
            Schema::table('umkms', function (Blueprint $table) {
                $table->dropColumn('qr_code_target');
            });
        }

        if (Schema::hasColumn('destinations', 'qr_code_target')) {
            Schema::table('destinations', function (Blueprint $table) {
                $table->dropColumn('qr_code_target');
            });
        }

        if (Schema::hasColumn('events', 'qr_code_target')) {
            Schema::table('events', function (Blueprint $table) {
                $table->dropColumn('qr_code_target');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('umkms', 'qr_code_target')) {
            Schema::table('umkms', function (Blueprint $table) {
                $table->string('qr_code_target')->nullable();
            });
        }

        if (! Schema::hasColumn('destinations', 'qr_code_target')) {
            Schema::table('destinations', function (Blueprint $table) {
                $table->string('qr_code_target')->nullable();
            });
        }

        if (! Schema::hasColumn('events', 'qr_code_target')) {
            Schema::table('events', function (Blueprint $table) {
                $table->string('qr_code_target')->nullable();
            });
        }
    }
};
