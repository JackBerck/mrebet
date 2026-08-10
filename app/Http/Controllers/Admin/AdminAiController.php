<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AiGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AdminAiController extends Controller
{
    public function generateDescription(Request $request, AiGenerationService $aiService): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:umkm,destination,event,blog'],
            'title' => ['required', 'string', 'max:255'],
            'context' => ['nullable', 'array'],
        ]);

        try {
            $description = $aiService->generateDescription(
                $validated['type'],
                $validated['title'],
                $validated['context'] ?? []
            );

            return response()->json([
                'success' => true,
                'description' => $description,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
