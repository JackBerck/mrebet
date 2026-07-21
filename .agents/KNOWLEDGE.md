# KNOWLEDGE — Wisata Mrebet
AI dev reference. All rules mandatory.

---

## 0. Stack

| Layer | Tool |
|---|---|
| Backend | Laravel v13 / PHP 8.4 |
| Frontend | React 19 + Inertia v3 SSR |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routes | Wayfinder (`@laravel/vite-plugin-wayfinder`) |
| **Package manager** | **Bun** — NOT npm/yarn/pnpm |
| Testing | Pest v4 |
| Format | Pint (PHP) + Prettier (JS) |

Bun commands: `bun install` / `bun run dev` / `bun run build` / `bun run build:ssr`

---

## 1. Wayfinder — ZERO hardcoded URLs

```ts
// ✅ Always
import { route } from '@/routes/events/show';
<Link href={route({ event: event.slug })} />

// Imports from @/actions/ (controller) or @/routes/ (named)
```

Regenerate: `php artisan wayfinder:generate`
`vite.config.ts` auto-runs on dev. Still regenerate after route changes.

---

## 2. Eager Loading — NO N+1

Every relation accessed in loop MUST be eager-loaded.

```php
// Index list
Event::with(['primaryMedia', 'village:id,name'])->paginate(15);

// Show detail
$event->load(['media', 'village:id,name,slug', 'destination:id,name,slug']);

// id MUST be included in column-selected relations
->with(['village:id,name']) // FK resolution requires id
```

| Model | Eager load for lists |
|---|---|
| Event | `primaryMedia`, `village:id,name` |
| Destination | `primaryMedia`, `village:id,name` |
| Village | `primaryMedia` |
| Blog | `cover_image` col or `primaryMedia`, `village:id,name` |

`primaryMedia()` → `MorphOne` where `is_primary=true` — lists/cards
`media()` → `MorphMany` — detail/gallery

---

## 3. Loading States — EVERY interaction

No action without visual feedback.

```tsx
// Inertia useForm
const { post, processing } = useForm({ ... });
<Button type="submit" disabled={processing}>
    {processing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
    {processing ? 'Menyimpan...' : 'Simpan'}
</Button>

// router.delete / router.visit
const [isLoading, setIsLoading] = useState(false);
router.delete(route(...), { onFinish: () => setIsLoading(false) });

// Filter/search — debounce 400ms
router.get(route(), { search: val }, { preserveState: true, replace: true });
```

Inertia progress bar auto-shows on page navigation (already configured).

---

## 4. Form Handling

Simple forms → Inertia `useForm`:
```tsx
const { data, setData, post, errors, processing, reset } = useForm({ title: '' });
post(route('admin.events.store'));
```

Complex forms → react-hook-form + Zod:
```tsx
const form = useForm({ resolver: zodResolver(schema) });
```

File uploads → always `forceFormData: true`:
```tsx
post(route(...), { forceFormData: true });
```

---

## 5. TypeScript Types

Location: `resources/js/types/models.ts` — update when columns change.

- `decimal:2` (ticket_price) → PHP sends `string` → type as `string` in TS
- Nullable relations → always optional `?`
- Use `PaginatedData<T>` for all paginated responses
- Parse decimal: `parseFloat(event.ticket_price)`

Public types: `types/public.ts` | Admin types: `types/models.ts`

---

## 6. Route Model Binding — always slug

Models use `slug` as route key. Routes: `/event/{event:slug}`. Frontend links pass `slug`, never `id`.

---

## 7. Authorization — Policies on every CUD

```php
$this->authorize('create', Event::class);
$this->authorize('update', $event);
$this->authorize('delete', $event);
```

RBAC: `admin` = all villages | `manager` = own `village_id` only.
Always scope: `->when(!$isAdmin, fn($q) => $q->where('village_id', $user->village_id))`

---

## 8. Enums — never raw strings in PHP logic

```php
use App\Enums\ContentStatus; // Published, Draft
use App\Enums\UserRole;      // Admin, Manager
use App\Enums\DestinationCategory; // Alam, Budaya, Buatan

$event->status === ContentStatus::Published // compare
Rule::enum(ContentStatus::class)            // validate
'status' => ContentStatus::class            // cast in model
```

TS: `status: 'draft' | 'published'`

---

## 9. Pagination

Always `->paginate(15)->withQueryString()` for admin list queries. Never `->get()` on list pages.

---

## 10. SoftDeletes

All main models use `SoftDeletes`. `->delete()` = soft delete. No hard deletes.

---

## 11. Media

Custom `Media` model (NOT spatie/medialibrary). Polymorphic.

```tsx
// Image URL
src={`/storage/${media.file_path}`}
```

```php
// Upload
$path = $file->store('events', 'public');
$event->media()->create(['file_path' => $path, 'alt_text' => $event->title, 'is_primary' => $isPrimary]);
```

Storage symlink: `php artisan storage:link`

---

## 12. Design Tokens

Colors (OKLCH, in `resources/css/app.css`):

| Token | Use |
|---|---|
| `--forest` | Brand, buttons |
| `--forest-deep` | Headings, dark |
| `--forest-mist` | Success bg, muted |
| `--cream-warm` | Page bg |
| `--cream-soft` | Card/form bg |
| `--gold` | Accent, stars |
| `--charcoal` | Body text |
| `--charcoal-soft` | Muted text |
| `--line` | Borders |

Fonts: `font-display` = Fraunces (serif) | `font-sans` = Inter
Animation: `--ease: cubic-bezier(0.19, 1, 0.22, 1)`

---

## 13. Tailwind v4 Syntax

```tsx
// ✅ v4
className="bg-(--forest) text-(--charcoal-soft) border-(--line)"

// ❌ v3 (broken)
className="bg-[--forest]"
```

Config in `resources/css/app.css` (no `tailwind.config.js`).

---

## 14. Inertia v3 Key Notes

- `Inertia::lazy()` removed → use `Inertia::optional()`
- `router.cancel()` removed → `router.cancelAll()`
- `future` config namespace removed
- Event renames: `invalid` → `httpException`, `exception` → `networkError`
- SSR auto in dev via `@inertiajs/vite`

```tsx
// Flash messages
import { useFlashToast } from '@/hooks/use-flash-toast';

// Internal navigation
import { Link, router } from '@inertiajs/react';
```

---

## 15. Component & File Locations

```
pages/[admin|public]/[resource]/[action].tsx
components/admin/         ← admin-specific
components/public/        ← public-specific
components/ui/            ← shadcn/radix primitives
layouts/public-layout.tsx ← public pages
layouts/app-layout.tsx    ← admin pages
hooks/use-motion-reveal.ts ← scroll reveal (data-reveal attr)
```

---

## 16. Admin CRUD Pattern

Method order: `index → create → store → edit → update → destroy → updateStatus`

After store: `redirect()->route('admin.resource.edit', $model)->with('success', '...')`
After update: `back()->with('success', '...')`
After destroy: `redirect()->route('admin.resource.index')->with('success', '...')`

---

## 17. Slug — spatie/laravel-sluggable

Auto-generates on create. Never set manually. Source field per model:
- Event: `title` | Destination: `name` | Village: `name` | Blog: `title`

---

## 18. Spatial Fields

`villages` + `destinations`: `latitude` DECIMAL(10,8), `longitude` DECIMAL(11,8), `point` POINT.
`point` in `$hidden` — never expose. Use lat/lng for Leaflet frontend.

---

## 19. Date Handling

- `start_date`/`end_date` → cast `date` → ISO string `YYYY-MM-DD` from PHP
- `start_time`/`end_time` → raw `HH:MM:SS` string → slice `[0,5]` for display

```tsx
import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';

format(parseISO(event.start_date), 'd MMMM yyyy', { locale: id });
// Never: new Date(dateString) — always parseISO()
```

---

## 20. Form Requests

ALL validation in `app/Http/Requests/Admin/`. Never inline in controllers.
Create: `php artisan make:request Admin/StoreEventRequest --no-interaction`

---

## 21. Accessibility

- Touch targets ≥ 44px
- Single-column form layout for admin
- Focus: `outline-2 outline-(--gold)`
- Status: icon + text, never color alone
- Labels above inputs, `font-medium`

---

## 22. PHP Style

Run after every PHP edit: `vendor/bin/pint --dirty --format agent`

- Constructor property promotion
- Explicit return types everywhere
- PHPDoc `@property` on models
- Curly braces on all control structures
- TitleCase enum keys: `ContentStatus::Published`

---

## 23. Tests

```bash
php artisan make:test --pest EventControllerTest --no-interaction
php artisan test --compact --filter=EventControllerTest
```

Use factories + `RefreshDatabase`. Check factory states before manual model setup.

---

## 24. Anti-Patterns Table

| ❌ Never | ✅ Always |
|---|---|
| Hardcode `'/event/slug'` | Wayfinder route functions |
| `->get()` on admin lists | `->paginate(15)->withQueryString()` |
| Access relations in loop | `with([...])` eager load |
| `npm` / `yarn` | `bun` |
| `new Date(str)` | `parseISO(str)` |
| Raw string status in PHP | Enum: `ContentStatus::Published` |
| Expose `point` column | Already in `$hidden` |
| Omit `id` in relation select | `village:id,name` |
| Submit without loading state | Spinner + `disabled={processing}` |
| Inline validation in controller | `FormRequest` class |
| Tailwind `bg-[--var]` | `bg-(--var)` (v4 syntax) |
| `Inertia::lazy()` | `Inertia::optional()` |

---

## 25. Key Files

| File | Purpose |
|---|---|
| `APP_SPEC_FINAL.md` | DB schema + feature spec |
| `APP_STYLE,md` | Design system |
| `routes/web.php` | All routes |
| `resources/js/types/models.ts` | TS model types |
| `resources/js/types/public.ts` | Public TS types |
| `resources/js/wayfinder/` | Auto-generated Wayfinder |
| `resources/css/app.css` | Design tokens + Tailwind v4 config |
| `app/Enums/` | PHP Enums |
| `app/Policies/` | Auth policies |
| `app/Http/Requests/Admin/` | Form validation |

## 26. SEO, Meta Tags & Semantic HTML

Mandatory rules for all **Public/Frontend** pages to optimize SSR, SEO, accessibility, and search engine indexing.

### A. Inertia `<Head>` Component & Metadata

Every public page **MUST** use the `@inertiajs/react` `<Head>` component. Include page title, meta description, canonical URL, Open Graph metadata, and Twitter Cards.

```tsx
import { Head } from '@inertiajs/react';

<Head title={`${destination.name} | Mrebet Wisata`}>
  <meta
    name="description"
    content={
      destination.excerpt ||
      destination.description.substring(0, 160)
    }
  />

  <link
    rel="canonical"
    href={route('destinations.show', {
      destination: destination.slug,
    })}
  />

  {/* Open Graph */}
  <meta property="og:type" content="article" />
  <meta property="og:title" content={destination.name} />
  <meta property="og:description" content={destination.excerpt} />
  <meta
    property="og:image"
    content={
      destination.primary_media?.file_path
        ? `/storage/${destination.primary_media.file_path}`
        : '/default-og.jpg'
    }
  />
  <meta
    property="og:url"
    content={route('destinations.show', {
      destination: destination.slug,
    })}
  />

  {/* Twitter */}
  <meta
    name="twitter:card"
    content="summary_large_image"
  />
  <meta
    name="twitter:title"
    content={destination.name}
  />
  <meta
    name="twitter:description"
    content={destination.excerpt}
  />
  <meta
    name="twitter:image"
    content={
      destination.primary_media?.file_path
        ? `/storage/${destination.primary_media.file_path}`
        : '/default-og.jpg'
    }
  />
</Head>
```

---

### B. Semantic HTML

Avoid unnecessary `<div>` nesting. Use semantic HTML elements to improve accessibility, maintainability, and crawler understanding.

#### Page Layout

- `<header>`
- `<nav>`
- `<main>`
- `<footer>`

#### Content Structure

- `<article>` → destination detail, blog article, event detail
- `<section>` → logical content grouping
- `<aside>` → sidebar, filters, related content

#### Lists

Use semantic lists for repeating content.

```tsx
<ul className="grid gap-6">
    {destinations.map(destination => (
        <li key={destination.id}>
            <DestinationCard destination={destination} />
        </li>
    ))}
</ul>
```

Do **NOT** wrap every repeated item using plain `<div>` when a list is appropriate.

#### Heading Hierarchy

Rules:

- Exactly **one `<h1>`** per page
- Follow logical order:
  - `<h1>`
  - `<h2>`
  - `<h3>`
- Never skip heading levels.

---

### C. Image SEO

Every image **MUST** include a descriptive `alt` attribute.

Never use:

- `"image"`
- `"photo"`
- `""`
- `"img"`

Preferred implementation:

```tsx
<img
    src={`/storage/${media.file_path}`}
    alt={media.alt_text || destination.name}
    loading="lazy"
    width={800}
    height={600}
/>
```

Provide explicit `width` and `height` whenever possible to reduce layout shift (CLS).

---

### D. JSON-LD Structured Data

For public detail pages (Destination, Event, Blog), include JSON-LD structured data inside `<Head>`.

```tsx
const schemaData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.excerpt,
    geo: {
        "@type": "GeoCoordinates",
        latitude: destination.latitude,
        longitude: destination.longitude,
    },
};

<Head>
    <script type="application/ld+json">
        {JSON.stringify(schemaData)}
    </script>
</Head>;
```

Structured data improves eligibility for Google Rich Results.

---

### E. Additional SEO Recommendations

Public pages should also:

- Use descriptive page titles (50–60 characters when possible)
- Keep meta descriptions around 150–160 characters
- Use readable URLs (`/destinations/baturaden`)
- Prefer server-side rendered content for SEO-critical pages
- Lazy-load below-the-fold images
- Avoid duplicate canonical URLs
- Ensure every page has meaningful internal links

---

## Anti-Patterns

| ❌ Avoid | ✅ Preferred |
|----------|-------------|
| Omit `<Head>` on public page | Add `<Head>` with title, meta description, canonical URL, Open Graph, and Twitter tags |
| Generic `<div>` for all elements | Use `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>` |
| Multiple `<h1>` tags per page | Exactly one `<h1>` followed by logical `<h2>` and `<h3>` hierarchy |
| Empty or generic `alt` attributes | Use descriptive `alt={media.alt_text || title}` |
| Missing canonical URL | Always specify `<link rel="canonical">` |
| Missing JSON-LD on detail pages | Output structured data using `application/ld+json` |
| Image without dimensions | Specify `width` and `height` whenever possible |
| Very long page titles | Keep titles concise and descriptive |
| Generic URL slugs (`/destination/123`) | Use human-readable slugs (`/destinations/baturaden`) |