# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps (triggers `nuxt prepare` postinstall)
npm run dev          # dev server at http://localhost:3000
npm run build        # Node/SSR build into .output/
npm run generate     # static prerender into dist/ (what Netlify runs)
npm run preview      # preview the built output locally
```

No test runner, linter, or type-check script is configured. Type errors surface at dev / build time via Nuxt's `.nuxt/tsconfig.json`. If you add config to a Nuxt module type and the IDE doesn't recognise it, run `npx nuxt prepare` to regenerate `.nuxt/types`.

## Architecture

**Nuxt 3 + Vue 3 + TypeScript** static site, deployed to Netlify. [netlify.toml](netlify.toml) runs `npm run generate` and publishes `dist/`; the catch-all `/* → /index.html` redirect is a SPA fallback for prerendered routes.

### Modules
[nuxt.config.ts](nuxt.config.ts) wires up:
- **`@vueuse/motion/nuxt`** — `v-motion` directives for entrance animations; named directive `zoom-bg` registered in `runtimeConfig.public.motion.directives`.
- **`@nuxt/fonts`** — automatic font loading. Pinned at `^0.13` because `nuxt-og-image` requires that minimum for font extraction (older versions fall back to bundled Inter and log a warning).
- **`@nuxt/image`** — `<NuxtImg>` for srcset, lazy loading, and IPX-driven WebP conversion. Remote hosts (`images.unsplash.com`, `upload.wikimedia.org`) are whitelisted under `image.domains`. **Sizes attribute uses v2 syntax** — `sizes="sm:50vw md:33vw lg:25vw"`, NOT raw media queries. Bare `sizes="100vw"` collapses to a 1w/2w density srcset and breaks the image.
- **`@vueuse/nuxt`** — auto-imported VueUse composables (`useScroll`, `useEventListener`, etc.). The header auto-hide in [layouts/default.vue](layouts/default.vue) uses `useScroll`.
- **`@nuxtjs/leaflet`** — auto-imported `<LMap>`, `<LTileLayer>`, `<LCircleMarker>`, `<LPopup>`. Used inside `<ClientOnly>` because Leaflet requires DOM. Tiles come from CartoDB Dark Matter so they fit the spirit theme. Importing `leaflet/dist/leaflet.css` is mandatory anywhere Leaflet renders ([components/SpeciesMap.vue](components/SpeciesMap.vue) does it).
- **`nuxt-og-image`** — generates dynamic Open Graph share cards via Satori. **Component templates must be named with a `.satori.vue` suffix** (e.g. [components/OgImage/Species.satori.vue](components/OgImage/Species.satori.vue)) — without the suffix the module 500s with "Component not found." Renderer deps installed: `satori`, `sharp`, `@resvg/resvg-js`. Each page calls `defineOgImageComponent('<Name>', { ...props })` after `useSeoMeta`. The function-callback form does not pass props through — call it directly with a static object.

### Experimental / app config
- **View Transitions API** is enabled via `experimental.viewTransition: true`. Chromium browsers will morph between routes; other browsers fall back to the standard `pageTransition` (`page` blur+fade) and `layoutTransition` (`layout` fade) configured in `app.pageTransition` / `app.layoutTransition`.
- **Nitro prerender** uses `crawlLinks: true` seeded from `/`, `/about`, `/species`. Every `<NuxtLink>` from those pages is followed, so all 10 species detail pages get static HTML automatically. If a species ever becomes unreachable from those seeds, add its path explicitly.

### Styling stack — important subtlety
**Tailwind CSS v4 + DaisyUI v5**, configured entirely in CSS:
- [assets/css/tailwind.css](assets/css/tailwind.css) is the source of truth. `@import "tailwindcss"` plus a single `@plugin "daisyui/theme"` block defines the **`spirit`** theme (dark, neon accents). It is the only theme — there is no light mode and no toggle.
- There is no `tailwind.config.js` — v4 does not need one for this setup. If you need to extend tokens, do it in the CSS.
- DaisyUI class vocabulary is the primary UI kit: `card`, `btn`, `navbar`, `diff`, `collapse`, `menu`, `badge`, `stat`, `divider`. Plain Tailwind utilities handle the rest.

### Theme
[app.vue](app.vue) sets `data-theme="spirit"` on `<html>` via `useHead({ htmlAttrs })`. There is no runtime theme management, no localStorage, no composable, no switcher.

### Routes
- `/` ([pages/index.vue](pages/index.vue)) — homepage, four ocean-depth sections.
- `/about` ([pages/about.vue](pages/about.vue))
- `/species` ([pages/species/index.vue](pages/species/index.vue)) — grid of all species, grouped baleen vs toothed.
- `/species/[id]` ([pages/species/[id].vue](pages/species/[id].vue)) — detail page with sidebar nav and prev/next pagination. `definePageMeta.validate` rejects unknown ids server-side, triggering [error.vue](error.vue) with a 404.
- [error.vue](error.vue) — themed error page, customised for 404 vs 5xx.

Every page calls `useSeoMeta` for title, description, and OG/Twitter tags. Species detail pages set OG image to the species' primary photo.

### Homepage — ocean-depth gradient chain
[pages/index.vue](pages/index.vue) composes four sections that form one continuous surface→abyss gradient:
1. [HomeHero](components/HomeHero.vue) — video background with a light-surface overlay that blends into the gradient; CTAs to Species and `#classification`.
2. [WhaleTree](components/WhaleTree.vue) — `id="classification"` anchor target.
3. [SpeciesGrid](components/SpeciesGrid.vue) — featured subset linking to `/species/[id]`.
4. [ConservationSection](components/ConservationSection.vue) — deepest section.

The gradient is now a **single** `linear-gradient` on the `.ocean-page` wrapper in `index.vue` (sunlit surface at the top to black abyss at the bottom). The four sections are transparent and sit on top of it, so adding or reordering a section no longer means matching per-section gradient stops. [OceanParticles](components/OceanParticles.vue) draws a fixed bubble and marine-snow canvas behind the content, faded in by scroll so it only shows below the surface (honours `prefers-reduced-motion`). The wrapper uses a negative top margin so the hero sits under the floating glass nav in [layouts/default.vue](layouts/default.vue).

### Data layer
Static TypeScript modules under [data/](data/) — no CMS, no fetch:
- [data/species.ts](data/species.ts) — exports `species: WhaleSpecies[]` (all profiles) and a derived `featuredSpecies` (those with `featured: true`). The homepage grid uses the featured subset; the species pages use the full list. Each species can carry a `gallery`, an `audio` clip, and a `habitatRegions` array.
- [data/whaleTaxonomy.ts](data/whaleTaxonomy.ts) — `whaleGroups: WhaleGroup[]` drives the classification tree.
- [data/unsplash.ts](data/unsplash.ts) — hotlinked Unsplash URLs via a `U(id, w)` helper.
- [data/wikimedia.ts](data/wikimedia.ts) — `wm(path, w)` helper for Wikimedia Commons thumbnails. **Wikimedia rejects arbitrary widths** — only `120 | 250 | 500 | 960 | 1280` work; anything else returns 400. The `WmWidth` type encodes that.

### Species detail enhancements
[components/SpeciesDetail.vue](components/SpeciesDetail.vue) composes three optional sub-components driven by data presence:
- **[SpeciesAudio](components/SpeciesAudio.vue)** — HTML5 audio player for the species' whale call. Source URL is built via `https://commons.wikimedia.org/wiki/Special:FilePath/<filename>` which 302s to the canonical OGG. Browsers follow the redirect transparently. 7 of 10 species have audio (narwhal, gray whale, bowhead don't on Wikimedia and the player simply hides).
- **[SpeciesMap](components/SpeciesMap.vue)** — Leaflet map showing 3-5 habitat hotspots per species. Wrapped in `<ClientOnly>` with a fallback skeleton because Leaflet needs DOM.
- **[ImageLightbox](components/ImageLightbox.vue)** — Teleported overlay opened from the gallery thumbnails. Keyboard support: ESC closes, ←/→ navigate. Locks body scroll while open. Uses VueUse's auto-imported `useEventListener`.

Types live in [types/species.ts](types/species.ts). Prose strings use real Unicode punctuation (`—`, `–`) rather than HTML entities, because `{{ }}` interpolation renders them as literals.

`nuxt.config.ts` cannot import from `~/data/...` because it runs through jiti before Nuxt aliases exist. If you need data at config time, hardcode it in the config or wait for the runtime crawl.

### Iconography
[plugins/heroicons.ts](plugins/heroicons.ts) globally registers every export from `@heroicons/vue/24/outline` as a Vue component, so `<Bars3Icon />`, `<ArrowRightIcon />`, `<CheckCircleIcon />`, etc. work without imports. Only the outline set is wired; solid/mini would require additional registration. Some components also import icons explicitly — both styles work, and explicit imports play better with IDE autocomplete.

**No emoji in UI.** Use Heroicons or typography. This is a deliberate house style.

### Loading & navigation feedback
[layouts/default.vue](layouts/default.vue) mounts `<NuxtLoadingIndicator>` with a tri-colour neon gradient that fires on every route change. Combined with the View Transitions API and crawlLinks-driven prefetching, route navigation feels close to instant on the prerendered build.

## House style

- Use Unicode punctuation (em-dash `—`, en-dash `–`, curly quotes) in copy. Not `&mdash;` / `&ndash;` — those render as literal text inside `{{ }}`.
- Prefer `import.meta.client` over the deprecated `process.client`.
- Keep data additions consistent: every new `WhaleSpecies` needs adult + baby blocks, group/family tags, conservation status, gallery, and a stable kebab-case `id` used in `/species/[id]` URLs.
- Before adding new UI libraries, check whether DaisyUI, Heroicons, and the existing module set already cover the need.
