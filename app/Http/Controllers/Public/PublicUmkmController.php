<?php

namespace App\Http\Controllers\Public;

use App\Enums\ContentStatus;
use App\Enums\UmkmCategory;
use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicUmkmController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $umkms = Umkm::with(['primaryMedia'])
            ->where('status', ContentStatus::Published)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('owner_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $umkms->transform(function ($umkm) {
            $umkm->category_label = $umkm->category?->label();

            return $umkm;
        });

        return Inertia::render('public/umkms/index', [
            'umkms' => $umkms,
            'categories' => collect(UmkmCategory::cases())->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()]),
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function show(Umkm $umkm): Response
    {
        abort_if(! $umkm->isPublished(), 404);

        $umkm->load(['media']);
        $umkm->category_label = $umkm->category?->label();

        $relatedUmkms = Umkm::with(['primaryMedia'])
            ->where('status', ContentStatus::Published)
            ->where('id', '!=', $umkm->id)
            ->where('category', $umkm->category)
            ->inRandomOrder()
            ->limit(3)
            ->get();

        $relatedUmkms->transform(function ($u) {
            $u->category_label = $u->category?->label();

            return $u;
        });

        return Inertia::render('public/umkms/show', [
            'umkm' => $umkm,
            'relatedUmkms' => $relatedUmkms,
        ]);
    }
}
