<?php

namespace App\Http\Requests\Admin;

use App\Enums\ContentStatus;
use App\Enums\DestinationCategory;
use App\Models\Destination;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Destination::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'village_id' => ['nullable', 'integer', 'exists:villages,id'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(DestinationCategory::class)],
            'description' => ['nullable', 'string'],
            'ticket_price' => ['required', 'numeric', 'min:0'],
            'ticket_info' => ['nullable', 'string', 'max:500'],
            'open_time' => ['nullable', 'date_format:H:i'],
            'close_time' => ['nullable', 'date_format:H:i'],
            'operational_days' => ['nullable', 'string', 'max:255'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'qr_code_target' => ['nullable', 'url', 'max:500'],
            'status' => ['required', Rule::enum(ContentStatus::class)],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama destinasi wajib diisi.',
            'category.required' => 'Kategori destinasi wajib dipilih.',
            'ticket_price.min' => 'Harga tiket tidak boleh negatif.',
            'open_time.date_format' => 'Format jam buka harus HH:MM.',
            'close_time.date_format' => 'Format jam tutup harus HH:MM.',
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
            'qr_code_target.url' => 'URL QR Code harus berupa URL yang valid.',
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.max' => 'Ukuran gambar maksimal 5 MB.',
        ];
    }
}
