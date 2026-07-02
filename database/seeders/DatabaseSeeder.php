<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Urutan penting: VillageSeeder harus pertama karena seeder lain FK ke villages.
     * UserSeeder setelah VillageSeeder karena manager butuh village_id.
     * MediaSeeder paling akhir karena butuh ID dari villages dan destinations.
     */
    public function run(): void
    {
        $this->call([
            VillageSeeder::class,
            UserSeeder::class,
            DestinationSeeder::class,
            EventSeeder::class,
            BlogSeeder::class,
            MediaSeeder::class,
        ]);
    }
}
