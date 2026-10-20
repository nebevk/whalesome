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

**Nuxt 3 + Vue 3 + TypeScript** static site, deployed to Netlify. [netlify.toml](netlify.toml) runs `npm run generate` and publishes `dist/`; the catch-all `/* → /index.html` redirect is a SPA fallback for prerendered routes. Node 22 is pinned for the Netlify build.

### Modules
[nuxt.config.ts](nuxt.config.ts) wires up:
- **`@nuxt/fonts`** — loads Fredoka, Merriweather Sans, and Rouge Script from Google. Families are declared under `fonts.families`; CSS tokens in [assets/css/tailwind.css](assets/css/tailwind.css) (`font-sans`, `font-whale`, `font-brand`) consume them. Do not add a Google Fonts `@import` in CSS.
- **`@nuxt/image`** — `<NuxtImg>` for srcset and lazy loading, with a custom default provider, [providers/remote.ts](providers/remote.ts), not IPX. It resizes at the source CDNs: Unsplash via `w`/`q` query params, Wikimedia by snapping thumbnails to the allowed widths (never above the width in the data URL). Don't switch back to IPX: `nuxt generate` would download every variant from Wikimedia (429s fail the build), and the static Netlify deploy has no IPX server, so `/_ipx/` URLs would 404. **Sizes attribute uses v2 syntax** — `sizes="sm:50vw md:33vw lg:25vw"`, NOT raw media queries. Bare `sizes="100vw"` collapses to a 1w/2w density srcset and breaks the image.
- **`@vueuse/nuxt`** — auto-imported VueUse composables (`useEventListener`, `usePreferredReducedMotion`, `useState`, etc.).

There is no map library or tile server. [components/SpeciesMap.vue](components/SpeciesMap.vue) draws a static Equal Earth map: coastlines are pre-generated SVGs in [public/maps/](public/maps/) (Natural Earth 1:50m land via `world-atlas`, projected with d3-geo's `geoEqualEarth` at the scale and size the component hardcodes). There is an Atlantic-centred and a Pacific-centred file; the component picks whichever frames the hotspots tighter (by longitude span) and zooms the `viewBox` to fit them. Markers are HTML, numbered to match the text list under the map. If you regenerate the files, keep `W = 1000`, the scale, and `H = 486.7` in sync with the component. CARTO basemaps now require an API key, which is why the Leaflet + Dark Matter map was removed.

Share cards use each page's `useSeoMeta` tags. Species detail pages set `ogImage` / `twitterImage` to the species' primary photo. There is no `nuxt-og-image` pipeline.

### App config, prerender and hydration
- **Page / layout transitions** (`page` blur+fade, `layout` fade) are configured in `app.pageTransition` / `app.layoutTransition`. View Transitions API is not enabled. Layouts must keep a single root element.
- **Nitro prerender** uses `crawlLinks: true` seeded from `/`, `/about`, `/species`, `/history`, `/populations`, `/compare`, `/anatomy`. Every `<NuxtLink>` from those pages is followed, so all 22 species detail pages get static HTML automatically. If a species ever becomes unreachable from those seeds, add its path explicitly.
- Everything is prerendered, so state that depends on the URL query, window size, the clock, or localStorage is applied after mount (Whale of the Day, `/compare` and `/species` query state, the tree's layout mode).
- Round trig-derived numbers before they reach SSR'd attributes or inline styles. Node's and the browser's `Math.sin`/`cos` differ in the last bits, which made every cladogram path and map marker a hydration mismatch until they were rounded.
- Don't put an HTML comment at a template's root: dev keeps it, the component renders as a fragment, and class fallthrough breaks.
- `<select>` uses `v-model`, not a bound `:value`: Vue skips `:value` on `<select>` during hydration, so the prerendered page showed the first option.
- `nitro.replace` maps `typeof window` to itself on purpose: Nitro's own rewrite to `"undefined"` also matched `typeof window$1` (a name Rollup gives VueUse's local `window`) and broke the server bundle.
- To check a deploy locally, run `NETLIFY=true npm run generate`; that uses the same `netlify-static` preset as the real build.

### Styling stack — important subtlety
**Tailwind CSS v4 + DaisyUI v5**, configured entirely in CSS:
- [assets/css/tailwind.css](assets/css/tailwind.css) is the source of truth. `@import "tailwindcss"` plus a single `@plugin "daisyui/theme"` block defines the **`spirit`** theme (dark, neon accents). It is the only theme — there is no light mode and no toggle.
- There is no `tailwind.config.js` — v4 does not need one for this setup. If you need to extend tokens, do it in the CSS.
- DaisyUI class vocabulary is the primary UI kit: `card`, `btn`, `navbar`, `diff`, `collapse`, `menu`, `badge`, `stat`, `divider`. Plain Tailwind utilities handle the rest.
- DaisyUI 5 ships its component styles in nested layers inside `@layer utilities`, so a plain Tailwind utility always beats a DaisyUI rule.
- DaisyUI gotchas that have bitten this site:
  - `.card-body :where(p) { flex-grow: 1 }` makes every descendant `<p>` of a card body stretch in flex layouts. It split the donut's label, opened gaps in cards, and jammed section headers together. Use `grow-0`, or a `<span>`/`<div>`.
  - `.card figure` is a centred flex row. Don't use `<figure>` for layout-critical boxes inside cards.
  - `.diff` positions each half's direct child absolutely at `100cqi` and stacks `diff-item-1` with `z-index: 1`. Put the images directly inside the halves and keep captions outside the diff, or a caption in the second half paints over the first.

### Theme
[app.vue](app.vue) sets `data-theme="spirit"` on `<html>` via `useHead({ htmlAttrs })`. There is no runtime theme management, no light mode and no switcher. Optional time-of-day ocean tint on the homepage is a separate ambient overlay, not a DaisyUI theme.

### Routes
- `/` ([pages/index.vue](pages/index.vue)) — homepage, ocean-depth sections plus whale of the day.
- `/about` ([pages/about.vue](pages/about.vue))
- `/species` ([pages/species/index.vue](pages/species/index.vue)) — all species, grouped baleen vs toothed: compact rows on phones, a card grid from `sm`. Search and filters are mirrored to `?q=&group=&status=` (read after mount, written with `router.replace`), plus a “Surprise me” pick. `useState('species-list-path')` lets a profile's “All species” link return to the filtered list.
- `/species/[id]` ([pages/species/[id].vue](pages/species/[id].vue)) — detail page. [SpeciesNav](components/SpeciesNav.vue) is the sidebar from `lg`; below that, [SpeciesSwitcher](components/SpeciesSwitcher.vue) is a sticky bar with prev/next and a searchable `<dialog>` picker. ←/→ page through species in browse order (baleen then toothed, matching the sidebar and index). `definePageMeta.validate` rejects unknown ids server-side, triggering [error.vue](error.vue) with a 404.
- `/anatomy` ([pages/anatomy.vue](pages/anatomy.vue)) — “How Whales Work”: interactive figures (see Interactive figures below), starting with echolocation, plus the part-to-anatomy mapping and sources. Toothed species profiles link to `#echolocation`.
- `/history` ([pages/history.vue](pages/history.vue)) — sourced whaling timeline.
- `/populations` ([pages/populations.vue](pages/populations.vue)) — hook stats, “How far they fell”, the decades scrubber, the Red List donut (it filters the abundance chart below it), “How many are left”, then record facts.
- `/compare` ([pages/compare.vue](pages/compare.vue)) — two species side by side. Selections are mirrored to `?a=&b=` after mount, with a swap button, quick-pick pairs, and a copy-link button. Reuses [SizeComparison](components/SizeComparison.vue) with its `versus` prop.
- [error.vue](error.vue) — renders inside `<NuxtLayout>` (nav and footer present), customised for 404 vs 5xx, and suggests destinations for mistyped paths.

Every page calls `useSeoMeta` for title, description, and OG/Twitter tags.

### Layout and site chrome
[layouts/default.vue](layouts/default.vue):
- One `links` array (to, label, icon, blurb, keywords) drives the desktop nav, the mobile menu, the footer, and QuickFind's page results. The current page gets `aria-current`.
- [QuickFind](components/QuickFind.vue) is a command palette for pages and species, opened with `/`, Ctrl/Cmd+K, or the nav search button, through [useQuickFind](composables/useQuickFind.ts) (`useState('quickfind:open')`).
- Overlay convention: modal layers are native `showModal()` `<dialog>`s, or set `aria-modal="true"` only while open. QuickFind's shortcut and the species arrow-key paging stand aside while any of them is open.
- Chrome dropdowns use [useDisclosure](composables/useDisclosure.ts) with DaisyUI's `dropdown-open` / `dropdown-close`, not focus-within.
- A skip link targets `main#main-content` (tabindex -1), which [BackToTop](components/BackToTop.vue) also focuses. `<NuxtRouteAnnouncer />` is mounted in the layout.
- Icon buttons use `size-11 lg:pointer-fine:size-8`: 44px touch targets, compact with a mouse.
- The footer carries the Ko-fi support link (https://ko-fi.com/nejcbevk).
- Sticky offsets assume the nav is about 70px tall on phones and 78px from `md`: SpeciesSwitcher `top-20 md:top-22`, SpeciesNav `top-24`, the abundance chart's axis `top-[4.5rem] md:top-[5.5rem]`. Update them if the nav height changes.
- [AmbientControl](components/AmbientControl.vue): the trigger shows the sound state (speaker icons); time of day lives inside the panel. Preferences (sound off by default, time-of-day tint, volume) persist in `localStorage` under `whalesome:ambient`. Sound is synthesized in [composables/useAmbient.ts](composables/useAmbient.ts) and never auto-starts.

### Homepage — ocean-depth gradient chain
[pages/index.vue](pages/index.vue) composes sections that form one continuous surface→abyss gradient:
1. [HomeHero](components/HomeHero.vue) — video background with a light-surface overlay that blends into the gradient, and a soft dark pool behind the copy for contrast; CTAs to Species and `#classification`. (An unattributed quote was removed: no source exists for it. Don't add quotes without a verifiable source.)
2. [WhaleOfDay](components/WhaleOfDay.vue) — one species chosen from the day of year, from the non-featured species only so it never repeats the grid (client-only, so the static prerender stays stable).
3. [WhaleTree](components/WhaleTree.vue) — `id="classification"` anchor target; wraps [CladogramTree](components/CladogramTree.vue). Below `md` the tree defaults to the Linear layout drawn as a collapsible outline; the user's choice persists in `useState('clado:mode')`.
4. [SpeciesGrid](components/SpeciesGrid.vue) — featured subset linking to `/species/[id]`.
5. [ConservationSection](components/ConservationSection.vue) — deepest section, `id="conservation"` (linked from About).

The gradient is a **single** `linear-gradient` on the `.ocean-page` wrapper in `index.vue` (sunlit surface at the top to black abyss at the bottom). Sections are transparent and sit on top of it. When “Follow time of day” is on, [composables/useAmbient.ts](composables/useAmbient.ts) overlays a second gradient that matches the real clock (dawn / day / dusk / night). [OceanParticles](components/OceanParticles.vue) draws a fixed canvas behind the content whose mix follows depth (bubbles near the surface, marine snow, then bioluminescence in the midnight zone), honouring `prefers-reduced-motion`. [DepthGauge](components/DepthGauge.vue) shows a depth readout and zone name while scrolling; its zone boundaries match the gradient stops at 24%, 60% and 80%, so move them together. The wrapper uses a negative top margin so the hero sits under the floating glass nav.

### Data layer
Static TypeScript modules under [data/](data/) — no CMS, no fetch:
- [data/species.ts](data/species.ts) — exports `species: WhaleSpecies[]` (all 22 profiles) and a derived `featuredSpecies` (those with `featured: true`). The homepage grid uses the featured subset; the species pages use the full list. Each species can carry a `gallery`, an `audio` clip, and a `habitatRegions` array (3–5 points, each tested to be at sea against the same 1:50m land data the map draws).
- [data/cladogram.ts](data/cladogram.ts) — the tree of all 94 living cetacean species on the Society for Marine Mammalogy list (April 2026), with IUCN status per species where one exists. The species count shown on the homepage is derived from it.
- [data/population.ts](data/population.ts) — per-species estimates for `/populations`. Entries resolve their display `name` from the matching profile (`hasProfile`), and carry an `estimate` (the figure the source states, otherwise a rounded midpoint). `currentLow`/`currentHigh` of 0 means no reliable global estimate; those species are listed in a footnote, not charted. Shared constants hold figures several views must agree on (right whales, vaquita). Also exports `populationOf`, `formatCount`, `FIGURES_YEAR`, and the keyed `stats` / `headlineStats` / `recordStats`. It imports `data/species.ts`.
- [data/populationHistory.ts](data/populationHistory.ts) — series for the decades scrubber. These are approximate reconstructions (some pre-1970 points are back-calculated from catch totals) and the chart says so; names and today's point come from `data/population.ts`.
- [data/whalingHistory.ts](data/whalingHistory.ts) — `/history` timeline; every event carries a source URL.
- [data/iucn.ts](data/iucn.ts) — status colours and labels for [StatusBadge](components/StatusBadge.vue).
- [data/unsplash.ts](data/unsplash.ts) — hotlinked Unsplash URLs via a `U(id, w)` helper. Unsplash titles proved unreliable (several “blue whale” or “fin whale” photos were humpbacks or orcas), so look at a photo before using it for a species.
- [data/wikimedia.ts](data/wikimedia.ts) — `wm(path, w)` helper for Wikimedia Commons thumbnails. **Wikimedia rejects arbitrary widths** — only `120 | 250 | 500 | 960 | 1280` work; anything else returns 400. The `WmWidth` type encodes that.

### Species detail enhancements
[components/SpeciesDetail.vue](components/SpeciesDetail.vue) composes optional sub-components driven by data presence:
- **Adult and calf photo** — when `baby.image` is set (only for a photo that really shows a calf of that species), a DaisyUI `diff` slider compares adult and calf; otherwise the adult photo shows alone. Adult and calf sizes sit in a bar under the photo either way.
- **[SpeciesAudio](components/SpeciesAudio.vue)** — HTML5 audio player for the species' whale call. Source URLs come from `wmAudio` / `wmAudioMp3`. 7 of 22 species have audio (the player hides when `audio` is absent).
- **[SpeciesMap](components/SpeciesMap.vue)** — static SVG map with 3–5 numbered habitat hotspots per species, plus the same hotspots as a text list. Renders during prerender; no client-only code.
- **[ImageLightbox](components/ImageLightbox.vue)** — Teleported overlay opened from the gallery thumbnails. Keyboard support: ESC closes, ←/→ navigate. Locks body scroll while open. Uses VueUse's auto-imported `useEventListener`.

Shared components:
- **[StatusBadge](components/StatusBadge.vue)** — variants: default (full name), `short` (code, with the full name for screen readers and in a tooltip), `plain` (no fill; only on base-200 or darker), and `dot`. The pill has an opaque `bg-base-300` fill so it passes contrast on any surface.
- **[StatTile](components/StatTile.vue)** — the one KPI tile used on `/populations` and `/history`, with `interactive`, `pressed`, `controls` and `size` (`sm` | `md`).
- **[SizeComparison](components/SizeComparison.vue)** — size-to-scale bars; it reads the largest number followed by “m” in `adult.size`, so keep metres in every size string.

Types live in [types/species.ts](types/species.ts).

### Interactive figures
Figures are isometric “working instrument” explainers built with the Anatomy kit (MIT, https://github.com/wheresryan22/anatomy; not vendored, built against commit 1482e84).
- Source lives in [figures/](figures/): one folder per figure with a pure `model.mjs` (every number the figure shows, with its sources) and a `build.mjs`. Build with `ANATOMY_KIT=/path/to/anatomy-clone node figures/echolocation/build.mjs`; it writes the embed page to `public/figures/echolocation.html`, which is committed (Netlify doesn't build figures). `--standalone` writes a full preview page instead.
- The embed has no page chrome and no caption; [pages/anatomy.vue](pages/anatomy.vue) renders the legend and caption, importing the same `model.mjs` so they can't drift. The kit's MIT notice is embedded in the built file because its runtime is inlined.
- [FigureFrame](components/FigureFrame.vue) shows a figure in a lazy iframe, which keeps the kit's global CSS and script away from the site. The figure posts `whalesome:figure-height` and answers `whalesome:figure-ping` (sent on mount and on load, since the prerendered frame can load before hydration), and the frame follows that height.

`nuxt.config.ts` cannot import from `~/data/...` because it runs through jiti before Nuxt aliases exist. If you need data at config time, hardcode it in the config or wait for the runtime crawl.

### Iconography
[plugins/heroicons.ts](plugins/heroicons.ts) globally registers every export from `@heroicons/vue/24/outline` as a Vue component, so `<Bars3Icon />`, `<ArrowRightIcon />`, `<CheckCircleIcon />`, etc. work without imports. Only the outline set is wired; solid/mini would require additional registration. Some components also import icons explicitly — both styles work, and explicit imports play better with IDE autocomplete.

**No emoji in UI.** Use Heroicons or typography. This is a deliberate house style.

## House style

- No em-dashes or en-dashes in user-visible copy: use commas, colons, periods, or “to”. Numeric ranges in data strings use a plain hyphen (`'7-8 m'`). Use curly quotes and apostrophes in copy, and never `&mdash;`-style entities, which render as literal text inside `{{ }}`.
- Facts need a source. Prefer the IUCN Red List, NOAA Fisheries, the Society for Marine Mammalogy list, national agencies and peer-reviewed papers over popular sites, and watch for popular myths (the “car-sized heart”, the “loudest animal” being the blue whale).
- Prefer `import.meta.client` over the deprecated `process.client`.
- Keep data additions consistent: every new `WhaleSpecies` needs adult + baby blocks, group/family tags, conservation status, gallery, habitat hotspots at sea, and a stable kebab-case `id` used in `/species/[id]` URLs. Only set `baby.image` for a verified calf photo of that species.
- Before adding new UI libraries, check whether DaisyUI, Heroicons, and the existing module set already cover the need.
