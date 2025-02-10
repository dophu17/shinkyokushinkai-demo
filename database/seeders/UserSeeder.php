<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'phu1',
            'email' => 'phu1@gmail.com',
            'password' => Hash::make('123456'),
        ]);
        DB::table('users')->insert([
            'name' => 'phu2',
            'email' => 'phu2@gmail.com',
            'password' => Hash::make('123456'),
        ]);
    }
}
