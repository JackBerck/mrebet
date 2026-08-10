<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class AiGenerationService
{
    /**
     * Generate HTML description using OpenRouter API.
     *
     * @param  string  $type  ('umkm'|'destination'|'event'|'blog')
     * @param  string  $title  Name or title of the item
     * @param  array<string, mixed>  $context  Extra context (category, organizer, price, address, etc.)
     */
    public function generateDescription(string $type, string $title, array $context = []): string
    {
        $apiKey = config('services.openrouter.key');
        $primaryModel = config('services.openrouter.model', 'google/gemma-4-31b-it:free');

        $candidateModels = array_values(array_unique(array_filter([
            $primaryModel,
            'google/gemini-2.0-flash-exp:free',
            'meta-llama/llama-3.3-70b-instruct:free',
            'deepseek/deepseek-r1:free',
            'qwen/qwen-2.5-72b-instruct:free',
            'mistralai/mistral-7b-instruct:free',
        ])));

        $systemPrompt = <<<'PROMPT'
Anda adalah asisten kecerdasan buatan penulisan konten resmi untuk platform Desa Wisata Serayu Larangan, Kecamatan Mrebet, Kabupaten Purbalingga, Jawa Tengah.

Tugas Anda adalah membuat deskripsi atau konten artikel yang sangat menarik, hangat, informatif, dan profesional dalam Bahasa Indonesia.

ATURAN FORMAT OUTPUT:
1. Kembalikan HANYA format HTML bersih tanpa tag <html>, <body>, atau blok kode markdown ```html.
2. Gunakan tag HTML dasar yang didukung Tiptap editor: <p>, <h2>, <ul>, <ol>, <li>, <strong>, <em>. Apabila ada poin-poin/list penomoran, gunakan tag <ol> atau <ul>.
3. Buat 2 hingga 4 paragraf yang padat, menarik minat wisatawan/pengunjung, dan menyoroti kearifan lokal Desa Serayu Larangan.
PROMPT;

        $userPrompt = $this->buildUserPrompt($type, $title, $context);
        $lastException = null;

        foreach ($candidateModels as $currentModel) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer '.$apiKey,
                    'Content-Type' => 'application/json',
                    'HTTP-Referer' => config('app.url', 'http://localhost:8000'),
                    'X-Title' => 'Desa Wisata Serayu Larangan',
                ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => $currentModel,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userPrompt],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 1000,
                ]);

                if ($response->failed()) {
                    Log::warning("OpenRouter model {$currentModel} failed", [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    $lastException = new \RuntimeException("Model {$currentModel} rate limited / error (Status: {$response->status()}).");

                    continue; // Try next fallback model
                }

                $json = $response->json();
                $content = $json['choices'][0]['message']['content'] ?? '';

                if (! $content) {
                    continue;
                }

                return $this->cleanHtmlContent($content);
            } catch (Throwable $e) {
                Log::warning("OpenRouter exception on model {$currentModel}: ".$e->getMessage());
                $lastException = $e;
            }
        }

        Log::error('All OpenRouter AI fallback models failed.');
        throw new \RuntimeException(
            'Layanan AI gratis (OpenRouter) sedang rate-limited saat ini. Silakan coba beberapa saat lagi.',
            0,
            $lastException
        );
    }

    /**
     * Build specific prompt based on entity type and context.
     *
     * @param  array<string, mixed>  $context
     */
    private function buildUserPrompt(string $type, string $title, array $context): string
    {
        $contextStr = '';
        foreach ($context as $key => $val) {
            if ($val !== null && $val !== '' && ! is_array($val)) {
                $contextStr .= '- '.ucwords(str_replace('_', ' ', $key)).": {$val}\n";
            }
        }

        return match ($type) {
            'umkm' => <<<PROMPT
Buatkan deskripsi promosi produk/usaha UMKM Desa Serayu Larangan berikut:
- Nama Usaha: {$title}
{$contextStr}

Formatkan dengan paragraf pengenalan keunggulan usaha, daftar fasilitas/produk unggulan dalam tag <ul><li>, dan ajakan berkunjung/membeli di Desa Serayu Larangan.
PROMPT,

            'destination' => <<<PROMPT
Buatkan deskripsi daya tarik destinasi wisata Desa Serayu Larangan berikut:
- Nama Destinasi: {$title}
{$contextStr}

Formatkan dengan gambaran keindahan suasana alam/budaya lokal, daya tarik utama, fasilitas yang tersedia (jika ada), dan pengalaman berkesan bagi para wisatawan.
PROMPT,

            'event' => <<<PROMPT
Buatkan deskripsi kegiatan/acara Desa Serayu Larangan berikut:
- Nama Event/Acara: {$title}
{$contextStr}

Formatkan dengan penjelasan keseruan acara, siapa saja yang dapat berpartisipasi, daya tarik utama acara, dan imbauan/ajakan untuk hadir memeriahkan event ini.
PROMPT,

            'blog' => <<<PROMPT
Buatkan draf konten artikel blog seputar Desa Serayu Larangan dengan judul:
- Judul Artikel: {$title}
{$contextStr}

Formatkan dengan pembuka yang memikat, subjudul <h2> untuk pembahasan utama, beberapa paragraf isi informatif, dan penutup yang menggugah wawasan pembaca.
PROMPT,

            default => "Buatkan deskripsi informatif tentang '{$title}' di Desa Serayu Larangan.",
        };
    }

    /**
     * Clean markdown backticks or wrappers around HTML output.
     */
    private function cleanHtmlContent(string $content): string
    {
        $content = preg_replace('/^```(?:html)?\s*/i', '', trim($content));
        $content = preg_replace('/\s*```$/i', '', trim($content));

        return trim($content);
    }
}
