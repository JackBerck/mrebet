<?php

namespace App\Http\Requests\Admin;

use App\Enums\ContentStatus;
use App\Enums\UmkmCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUmkmRequest extends FormRequest
{
    public function authorize(): bool
    {
        $umkm = $this->route('umkm');
        if (! $umkm) {
            return false;
        }

        return $this->user()?->can('update', $umkm) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(UmkmCategory::class)],
            'owner_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'price_range' => ['nullable', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'gmaps_link' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::enum(ContentStatus::class)],
            'primary_image' => ['nullable', 'image', 'max:5120'],
            'gallery_images' => ['nullable', 'array', 'max:10'],
            'gallery_images.*' => ['image', 'max:5120'],
            'remove_media_ids' => ['nullable', 'array'],
            'remove_media_ids.*' => ['integer', 'exists:media,id'],
        ];
    }
}
