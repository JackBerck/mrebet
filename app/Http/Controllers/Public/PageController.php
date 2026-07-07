<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('public/about');
    }

    public function faq()
    {
        return Inertia::render('public/faq');
    }

    public function privacy()
    {
        return Inertia::render('public/privacy');
    }

    public function terms()
    {
        return Inertia::render('public/terms');
    }

    public function guidelines()
    {
        return Inertia::render('public/guidelines');
    }

    public function partnership()
    {
        return Inertia::render('public/partnership');
    }
}
