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
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('category', ['kuliner', 'kerajinan', 'pertanian_olahan', 'jasa', 'warung', 'lainnya'])->default('kuliner');
            $table->string('owner_name')->nullable();
            $table->longText('description')->nullable();
            $table->text('address')->nullable();
            $table->string('contact_phone', 20)->nullable();
            $table->string('price_range')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('gmaps_link')->nullable();
            $table->string('qr_code_target')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('category');
            $table->index('status');
        });

        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            Schema::table('umkms', function (Blueprint $table) {
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
                DB::statement('ALTER TABLE umkms ADD COLUMN point POINT NOT NULL AFTER longitude');
            } else {
                DB::statement('ALTER TABLE umkms ADD COLUMN point POINT NOT NULL SRID 4326 AFTER longitude');
            }
            DB::statement('ALTER TABLE umkms ADD SPATIAL INDEX idx_umkms_point (point)');
        }

        // Add umkm_id FK to users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('umkm_id')->nullable()->after('role')->constrained('umkms')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('umkm_id');
        });

        Schema::dropIfExists('umkms');
    }
};
