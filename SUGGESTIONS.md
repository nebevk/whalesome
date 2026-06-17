# Whalesome, ideas for the portal

A roadmap of things the Whalesome portal could grow into, organised by effort and
grouped by theme. Everything here fits the current stack (Nuxt 3, DaisyUI, static
prerender) unless noted. Items already shipped in this pass are marked done.

---

## Already shipped in this pass
- Continuous surface-to-abyss gradient across the whole homepage, with a bubble and
  marine-snow particle field that fades in below the surface.
- Floating glass navigation, detached from the top, with a handwritten Rouge Script
  wordmark and a punchier logo.
- 22 species profiles (up from 10), each with verified Wikimedia photography.
- A **/history** page: a sourced timeline of whaling from Basque shore stations to the
  1986 moratorium and the uneven recovery since.
- A **/populations** page: current global estimates, depletion-and-recovery charts, IUCN
  status breakdown, and nine headline statistics, all from `data/population.ts`.
- Em-dashes removed from all site copy.

---

## Quick wins (an afternoon each)
1. **Species filter and search** on `/species`: filter by group, family, conservation
   status, ocean basin; live text search. The data already supports it.
2. **Conservation-status badges with colour**, reused from the populations palette, so a
   "Critically Endangered" vaquita reads red at a glance everywhere it appears.
3. **"Whale of the day"** on the homepage, deterministically chosen from the date so it is
   stable for static prerender.
4. **Compare two whales** side by side (size, weight, status, range) using the existing
   DaisyUI `diff` and `stat` components.
5. **Size-comparison graphic**: a silhouette scale that puts a blue whale next to a human,
   a bus, and a vaquita. Pure SVG, very shareable.
6. **Re-enable OG share images** (the `nuxt-og-image` work is half-done) so species and the
   new history/populations pages get rich link previews.
7. **Back-to-top button** and a reading-progress bar on the long history and species pages.

## Content and data
8. **Migration maps**: animated routes for the great migrators (gray, humpback, fin) on the
   existing Leaflet maps, drawn as polylines between known feeding and breeding grounds.
9. **Whale song library**: expand the audio beyond the 7 species that have it, with a small
   spectrogram and "what you are hearing" notes.
10. **Glossary** of cetacean terms (baleen, rorqual, melon, spermaceti, callosity, ecotype)
    with hover-cards that light up wherever a term appears in prose.
11. **Threats explainer**: short, sourced pages on ship strikes, entanglement, ocean noise,
    plastics, and warming seas, each linking to the species most affected.
12. **"Whale fall" feature**: the deep-sea afterlife of a whale carcass and the ecosystem it
    feeds, tied to the carbon-sequestration stat already on the populations page.
13. **Data freshness**: a small script or scheduled job that re-checks IUCN and NOAA figures
    and flags anything that has changed since `data/population.ts` was written.

## Interactivity and engagement
14. **Quiz / "which whale are you"**: a light, shareable personality or knowledge quiz.
15. **Whale tracker embed**: pull in a public satellite-tag or sightings feed (e.g. Happywhale,
    OBIS) for a "recently seen" map.
16. **Bookmark / favourites** with `localStorage`, so a visitor can keep a shortlist of
    species without any account.
17. **Sound-on ambient mode**: an optional looping underwater ambience toggle that pairs with
    the particle background (respecting reduced-motion and starting muted).

## Visual and UX polish
18. **Parallax depth** on the homepage: shift the particle layer and section art at slightly
    different scroll speeds to deepen the dive feeling.
19. **Scroll-triggered reveals** for cards and timeline entries using the already-installed
    `@vueuse/motion`.
20. **A light/surface theme** as an option (the project is dark-only today); the gradient and
    DaisyUI tokens make a second theme cheap.
21. **Per-species accent colour** drawn from the hero photo, tinting that profile page.

## Community and portal features
22. **Newsletter signup** ("a whale in your inbox each month"), static-friendly via a form
    provider (Buttondown, ConvertKit).
23. **Adopt / donate hub**: deeper than the current conservation cards, with vetted programs,
    what a donation funds, and recurring-giving links.
24. **Citizen-science callout**: how to report a sighting or stranding, by region.
25. **Submit a photo**: a moderated gallery of visitor whale photos (needs a backend or a
    form-to-storage service, so this is the first feature that breaks the static model).

## Technical and infrastructure
26. **Type-check and lint in CI**: no checks run today. Add `nuxi typecheck`, ESLint, and a
    build on every push so regressions surface before deploy.
27. **Image pipeline**: route the new Wikimedia portraits through `<NuxtImg>` for WebP and
    responsive `srcset` (a couple use full-resolution `Special:FilePath` today).
28. **Sitemap and structured data**: `@nuxtjs/sitemap` plus `schema.org` markup for species
    (helps search and rich results).
29. **Analytics, privacy-first** (Plausible or Umami) to learn which species and pages land.
30. **Accessibility pass**: audit colour contrast on the neon-on-dark palette, focus states on
    the glass nav, and `prefers-reduced-motion` coverage for every animation.

## Ambitious / stretch
31. **A 3D whale viewer** (model-viewer or Three.js) for a couple of hero species.
32. **An interactive "tree of life"** that replaces the static classification accordion with a
    zoomable cladogram of all ~90 cetacean species.
33. **Timeline scrubber** on the history page that animates a population line for a chosen
    species as you drag through the decades.
34. **Localisation** (i18n) so the field guide reaches non-English audiences.

---

## Suggested next three
If I were picking what to do next: **(1) species filter and search**, since the catalogue is
now big enough to need it; **(2) migration maps**, the single most "wow" addition for the
effort; and **(3) re-enable OG images + sitemap**, so the new pages are shareable and
discoverable. The rest can follow as the portal finds its audience.
