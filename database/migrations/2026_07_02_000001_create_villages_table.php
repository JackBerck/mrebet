<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('villages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->string('head_name')->nullable();
            $table->string('contact_phone', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            // POINT column added via raw statement below (requires NOT NULL for SPATIAL INDEX)
            $table->string('qr_code_target')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('status');
        });

        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            Schema::table('villages', function (Blueprint $table) {
                $table->geometry('point')->nullable()->after('longitude');
            });
        } else {
            $isMariaDb = false;
            if ($driver === 'mariadb') {
                $isMariaDb = true;
            } elseif ($driver === 'mysql') {
                $version = DB::connection()->getPdo()->getAttribute(PDO::ATTR_SERVER_VERSION);
                $isMariaDb = str_contains(strtolower($version), 'mariadb');
            }

            if ($isMariaDb) {
                DB::statement('ALTER TABLE villages ADD COLUMN point POINT NOT NULL AFTER longitude');
            } else {
                DB::statement('ALTER TABLE villages ADD COLUMN point POINT NOT NULL SRID 4326 AFTER longitude');
            }
            DB::statement('ALTER TABLE villages ADD SPATIAL INDEX idx_villages_point (point)');
        }

        // Add village_id FK to users after villages table is ready
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('village_id')->nullable()->after('role')->constrained('villages')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('village_id');
        });

        Schema::dropIfExists('villages');
    }
};
