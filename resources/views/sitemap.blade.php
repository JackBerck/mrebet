{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    {{-- Static Pages --}}
    @foreach ($staticPages as $page)
        <url>
            <loc>{{ rtrim($baseUrl, '/') . '/' . ltrim($page['url'], '/') }}</loc>
        </url>
    @endforeach

    {{-- Destinations --}}
    @foreach ($destinations as $dest)
        <url>
            <loc>{{ rtrim($baseUrl, '/') . '/destinasi/' . $dest->slug }}</loc>
            <lastmod>{{ $dest->updated_at->utc()->toAtomString() }}</lastmod>
        </url>
    @endforeach

    {{-- UMKM --}}
    @foreach ($umkms as $umkm)
        <url>
            <loc>{{ rtrim($baseUrl, '/') . '/umkm/' . $umkm->slug }}</loc>
            <lastmod>{{ $umkm->updated_at->utc()->toAtomString() }}</lastmod>
        </url>
    @endforeach

    {{-- Events --}}
    @foreach ($events as $event)
        <url>
            <loc>{{ rtrim($baseUrl, '/') . '/event/' . $event->slug }}</loc>
            <lastmod>{{ $event->updated_at->utc()->toAtomString() }}</lastmod>
        </url>
    @endforeach

    {{-- News / Blogs --}}
    @foreach ($blogs as $blog)
        @php
            $lastModified = $blog->updated_at ?? $blog->published_at;
        @endphp

        @if ($lastModified)
            <url>
                <loc>{{ rtrim($baseUrl, '/') . '/berita/' . $blog->slug }}</loc>
                <lastmod>{{ $lastModified->utc()->toAtomString() }}</lastmod>
            </url>
        @endif
    @endforeach

</urlset>