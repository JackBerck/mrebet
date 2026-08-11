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
