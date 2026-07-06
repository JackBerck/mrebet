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
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('village_id')->constrained('villages')->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('category', ['alam', 'budaya', 'buatan']);
            $table->text('description')->nullable();
            $table->decimal('ticket_price', 10, 2)->default(0);
            $table->text('ticket_info')->nullable();
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->string('operational_days')->nullable();
            $table->json('facilities')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            // POINT added via raw statement below
            $table->string('qr_code_target')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('status');
        });

        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            Schema::table('destinations', function (Blueprint $table) {
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
                DB::statement('ALTER TABLE destinations ADD COLUMN point POINT NOT NULL AFTER longitude');
            } else {
                DB::statement('ALTER TABLE destinations ADD COLUMN point POINT NOT NULL SRID 4326 AFTER longitude');
            }
            DB::statement('ALTER TABLE destinations ADD SPATIAL INDEX idx_destinations_point (point)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
