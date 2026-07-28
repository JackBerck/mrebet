<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sentraGula = DB::table('umkms')->where('slug', 'like', '%sentra-gula%')->first();
        $warungMbokSri = DB::table('umkms')->where('slug', 'like', '%warung-makan%')->first();

        $users = [
            // SUPER ADMIN
            [
                'full_name' => 'Administrator Serayu Larangan',
                'email' => 'admin@serayularangan.desa.id',
                'phone_number' => '081100001111',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'admin',
                'umkm_id' => null,
                'is_active' => true,
            ],
            // ADMIN SERAYU LARANGAN
            [
                'full_name' => 'Fajar Prasetyo Utomo',
                'email' => 'manager.serayularangan@serayularangan.desa.id',
                'phone_number' => '081398480422',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'admin',
                'umkm_id' => $sentraGula?->id,
                'is_active' => true,
            ],
            // ADMIN WARUNG KULINER
            [
                'full_name' => 'Siti Srimulyati',
                'email' => 'manager.kuliner@serayularangan.desa.id',
                'phone_number' => '082227961243',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'admin',
                'umkm_id' => $warungMbokSri?->id,
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert([
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'phone_number' => $user['phone_number'],
                'password' => $user['password'],
                'email_verified_at' => Carbon::now(),
                'avatar' => $user['avatar'],
                'role' => $user['role'],
                'umkm_id' => $user['umkm_id'],
                'is_active' => $user['is_active'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
