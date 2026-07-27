<?php

namespace App\Http\Requests\Admin;

use App\Enums\ContentStatus;
use App\Enums\DestinationCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $destination = $this->route('destination');

        return $destination && $this->user()?->can('update', $destination);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(DestinationCategory::class)],
            'description' => ['nullable', 'string'],
            'ticket_price' => ['required', 'numeric', 'min:0'],
            'ticket_info' => ['nullable', 'string'],
            'open_time' => ['nullable', 'date_format:H:i,H:i:s'],
            'close_time' => ['nullable', 'date_format:H:i,H:i:s'],
            'operational_days' => ['nullable', 'string', 'max:255'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'gmaps_link' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::enum(ContentStatus::class)],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
            'deleted_media_ids' => ['nullable', 'array'],
            'deleted_media_ids.*' => ['integer', 'exists:media,id'],
            'primary_media_id' => ['nullable', 'integer', 'exists:media,id'],
        ];
    }
}
