<?php

namespace App\Support;

use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\DB;
use PDO;

class Spatial
{
    /**
     * Get the database-appropriate expression for a POINT geometry.
     */
    public static function point(float|string $lat, float|string $lng): Expression
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            return DB::raw('NULL');
        }

        $isMariaDb = false;
        if ($driver === 'mariadb') {
            $isMariaDb = true;
        } elseif ($driver === 'mysql') {
            $version = DB::connection()->getPdo()->getAttribute(PDO::ATTR_SERVER_VERSION);
            $isMariaDb = str_contains(strtolower($version), 'mariadb');
        }

        if ($isMariaDb) {
            return DB::raw("POINT({$lng}, {$lat})");
        }

        return DB::raw("ST_SRID(POINT({$lng}, {$lat}), 4326)");
    }
}
