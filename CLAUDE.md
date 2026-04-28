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

No test runner, linter, or type-check script is configured. Type errors surface at dev / build time via Nuxt's `.nuxt/tsconfig.json`.

## Architecture

**Nuxt 3 + Vue 3 + TypeScript** static site, deployed to Netlify. [netlify.toml](netlify.toml) runs `npm run generate` and publishes `dist/`; the catch-all `/* → /index.html` redirect is a SPA fallback for prerendered routes.

### Styling stack — important subtlety
**Tailwind CSS v4 + DaisyUI v5**, configured entirely in CSS:
- [assets/css/tailwind.css](assets/css/tailwind.css) is the source of truth. `@import "tailwindcss"` plus a single `@plugin "daisyui/theme"` block defines the **`spirit`** theme (dark, neon accents). It is the only theme — there is no light mode and no toggle.
- There is no `tailwind.config.js` — v4 does not need one for this setup. If you need to extend tokens, do it in the CSS.
- DaisyUI class vocabulary is the primary UI kit: `card`, `btn`, `navbar`, `diff`, `collapse`, `menu`, `badge`, `stat`, `divider`. Plain Tailwind utilities handle the rest.

### Theme
[app.vue](app.vue) sets `data-theme="spirit"` on `<html>` via `useHead({ htmlAttrs })`. There is no runtime theme management, no localStorage, no composable, no switcher component. If you ever need a second theme, the previous implementation lived in `composables/useTheme.ts` (now removed) and the FOUC mitigation was an inline `<head>` script — restore both if you bring multi-theme back.

### Page & layout flow
- [app.vue](app.vue) renders `<NuxtLayout><NuxtPage /></NuxtLayout>`. Global `page` transition (blur + fade, 0.2s) is registered in [nuxt.config.ts](nuxt.config.ts) and styled in `app.vue`.
- [layouts/default.vue](layouts/default.vue) owns the site chrome: sticky DaisyUI `navbar`, desktop link row, mobile dropdown, three-column footer. The header auto-hides when scrolled close to the page bottom.

### Homepage — ocean-depth gradient chain
[pages/index.vue](pages/index.vue) composes four sections that form one continuous surface→abyss gradient:
1. [HomeHero](components/HomeHero.vue) — `.ocean-depth-surface`, CTAs to Species and `#classification`.
2. [WhaleTree](components/WhaleTree.vue) — `.ocean-depth-mid`, `id="classification"` anchor target.
3. [SpeciesGrid](components/SpeciesGrid.vue) — `.ocean-depth-deep`, featured subset + CTA to full species page.
4. [ConservationSection](components/ConservationSection.vue) — `.ocean-depth-deepest`.

Each component owns its own scoped `.ocean-depth-*` gradient. If you add, remove, or reorder a section, keep the gradient stops continuous across neighbors — that illusion is the whole concept.

### Species page — hash-based selection
[pages/species.vue](pages/species.vue) and [components/SpeciesGrid.vue](components/SpeciesGrid.vue) coordinate via URL hash, not route params:
- Grid cards link to `/species#<id>`.
- `species.vue` reads `window.location.hash` in `onMounted` to pick the initial species, then mirrors selection changes back via `history.replaceState(null, '', '#<id>')` in a `watch`.
- [SpeciesNav](components/SpeciesNav.vue) groups the sidebar by `baleen` / `toothed` and smooth-scrolls to `#<id>` on click.

Any new deep-link entry point should use this hash convention rather than dynamic routes.

### Data layer
Static TypeScript modules under [data/](data/) — no CMS, no fetch:
- [data/species.ts](data/species.ts) — exports `species: WhaleSpecies[]` (all profiles) and a derived `featuredSpecies` (those with `featured: true`). The homepage grid uses the featured subset; the species page uses the full list.
- [data/whaleTaxonomy.ts](data/whaleTaxonomy.ts) — `whaleGroups: WhaleGroup[]` drives the classification tree.
- [data/unsplash.ts](data/unsplash.ts) — centralized hotlinked Unsplash URLs via a `U(id, w)` helper. Add new imagery here rather than inlining URLs.

Types live in [types/species.ts](types/species.ts). Prose strings use real Unicode punctuation (`—`, `–`) rather than HTML entities, because `{{ }}` interpolation renders them as literals.

### Iconography
[plugins/heroicons.ts](plugins/heroicons.ts) globally registers every export from `@heroicons/vue/24/outline` as a Vue component, so `<Bars3Icon />`, `<ArrowRightIcon />`, `<CheckCircleIcon />`, etc. work without imports. Only the outline set is wired; solid/mini would require additional registration. Some components also import icons explicitly — both styles work, and explicit imports play better with IDE autocomplete.

**No emoji in UI.** Use Heroicons or typography. This is a deliberate house style.

### Motion
`@vueuse/motion/nuxt` is enabled. Components use inline `v-motion :initial :enter` directives with staggered delays. One named directive is registered in `runtimeConfig.public.motion.directives`: **`v-motion="'zoom-bg'"`** (subtle 1→1.1 scale over 1s), used on the hero background image.

## House style

- Use Unicode punctuation (em-dash `—`, en-dash `–`, curly quotes) in copy. Not `&mdash;` / `&ndash;` — those render as literal text inside `{{ }}`.
- Prefer `import.meta.client` over the deprecated `process.client`.
- Keep data additions consistent: every new `WhaleSpecies` needs adult + baby blocks, group/family tags, conservation status, and a stable kebab-case `id` used for URL hashes.
- Before adding new UI libraries, check whether DaisyUI and Heroicons already cover the need.
