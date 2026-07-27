<?php

namespace App\Http\Requests\Admin;

use App\Enums\ContentStatus;
use App\Models\Blog;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Blog::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::enum(ContentStatus::class)],
            'cover_image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
