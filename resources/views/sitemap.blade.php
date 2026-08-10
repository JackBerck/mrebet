{!! '<' . '?xml version="1.0" encoding="UTF-8"?' . '>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($staticPages as $page)
        <url>
            <loc>{{ rtrim($baseUrl, '/') }}{{ $page['url'] }}</loc>
            <changefreq>{{ $page['changefreq'] }}</changefreq>
            <priority>{{ $page['priority'] }}</priority>
        </url>
    @endforeach

    @foreach ($destinations as $dest)
        <url>
            <loc>{{ rtrim($baseUrl, '/') }}/destinasi/{{ $dest->slug }}</loc>
            <lastmod>{{ $dest->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    @endforeach

    @foreach ($umkms as $umkm)
        <url>
            <loc>{{ rtrim($baseUrl, '/') }}/umkm/{{ $umkm->slug }}</loc>
            <lastmod>{{ $umkm->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    @endforeach

    @foreach ($events as $event)
        <url>
            <loc>{{ rtrim($baseUrl, '/') }}/event/{{ $event->slug }}</loc>
            <lastmod>{{ $event->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>
    @endforeach

    @foreach ($blogs as $blog)
        <url>
            <loc>{{ rtrim($baseUrl, '/') }}/berita/{{ $blog->slug }}</loc>
            <lastmod>{{ ($blog->updated_at ?? $blog->published_at)->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    @endforeach
</urlset>
