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
        $villageOnje = DB::table('villages')->where('slug', 'onje')->first();
        $villageCipaku = DB::table('villages')->where('slug', 'cipaku')->first();
        $villageMrebet = DB::table('villages')->where('slug', 'mrebet')->first();
        $villageSerayuLarangan = DB::table('villages')->where('slug', 'serayu-larangan')->first();
        $villagePengadegan = DB::table('villages')->where('slug', 'pengadegan')->first();
        $villageTangkisan = DB::table('villages')->where('slug', 'tangkisan')->first();

        $users = [
            // SUPER ADMIN — mengelola seluruh kecamatan
            [
                'full_name' => 'Administrator Mrebet',
                'email' => 'admin@mrebet.id',
                'phone_number' => '081100001111',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'admin',
                'village_id' => null,
                'is_active' => true,
            ],
            // MANAGER ONJE
            [
                'full_name' => 'Mugi Ari Purwono',
                'email' => 'manager.onje@mrebet.id',
                'phone_number' => '082227961243',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'manager',
                'village_id' => $villageOnje?->id,
                'is_active' => true,
            ],
            // MANAGER CIPAKU
            [
                'full_name' => 'Sugiarto',
                'email' => 'manager.cipaku@mrebet.id',
                'phone_number' => '081345678901',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'manager',
                'village_id' => $villageCipaku?->id,
                'is_active' => true,
            ],
            // MANAGER MREBET
            [
                'full_name' => 'Mudrikah',
                'email' => 'manager.mrebet@mrebet.id',
                'phone_number' => '081456789012',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'manager',
                'village_id' => $villageMrebet?->id,
                'is_active' => true,
            ],
            // MANAGER SERAYU LARANGAN
            [
                'full_name' => 'Fajar Prasetyo Utomo',
                'email' => 'manager.serayularangan@mrebet.id',
                'phone_number' => '081567890123',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'manager',
                'village_id' => $villageSerayuLarangan?->id,
                'is_active' => true,
            ],
            // MANAGER PENGADEGAN
            [
                'full_name' => 'Suwanto',
                'email' => 'manager.pengadegan@mrebet.id',
                'phone_number' => '081678901234',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'manager',
                'village_id' => $villagePengadegan?->id,
                'is_active' => true,
            ],
            // MANAGER TANGKISAN (nonaktif - untuk testing is_active=false)
            [
                'full_name' => 'Sutrisno',
                'email' => 'manager.tangkisan@mrebet.id',
                'phone_number' => '081789012345',
                'password' => Hash::make('password'),
                'avatar' => null,
                'role' => 'manager',
                'village_id' => $villageTangkisan?->id,
                'is_active' => false,
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
                'village_id' => $user['village_id'],
                'is_active' => $user['is_active'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
