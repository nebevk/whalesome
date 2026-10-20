# Whalesome — current state

A Nuxt 3 static field guide to whales. Dark **spirit** theme only (DaisyUI + Tailwind v4). No light/classic theme, no theme switcher.

## Shipped

- Homepage: surface-to-abyss gradient, hero video, whale of the day, cladogram, featured grid, conservation
- 22 species profiles at `/species/[id]` (gallery, Leaflet habitat map, audio where Wikimedia has a clip)
- Search and IUCN/group filters on `/species`
- `/history` (whaling timeline), `/populations` (estimates and recovery), `/compare`
- Ambient underwater sound and a real-clock time-of-day ocean tint
- Floating glass nav, back-to-top, reading progress on long pages
- Static prerender (`npm run generate`) to Netlify, Node 22

## Not in scope (dropped)

- Dual-theme switcher (`classic` / `spirit`) and `useTheme`
- VueUse Motion entrance animations
- Headless UI
- `nuxt-og-image` (it broke hydration; species pages use the primary photo as `ogImage` instead)

## Next

Ideas live in [SUGGESTIONS.md](SUGGESTIONS.md). Highest-leverage leftovers: migration polylines on the maps, a sitemap, and a typecheck/lint CI job.
