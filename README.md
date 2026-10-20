# Whalesome

A static field guide to whales: species profiles, classification, population data, and the history of whaling. Dark “spirit” theme, built with Nuxt 3.

Live: [whalesome.netlify.app](https://whalesome.netlify.app)

## Tech stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3, TypeScript), statically prerendered
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/) (`spirit` theme only)
- **Images**: [`@nuxt/image`](https://image.nuxt.com/) (`<NuxtImg>`)
- **Fonts**: [`@nuxt/fonts`](https://fonts.nuxt.com/) (Fredoka, Merriweather Sans, Rouge Script)
- **Maps**: static Equal Earth SVGs from [Natural Earth](https://www.naturalearthdata.com/) land data, no tile server
- **Icons**: [Heroicons](https://heroicons.com/) outline
- **Deploy**: [Netlify](https://www.netlify.com/) via `npm run generate`

## Features

- 22 species profiles (adult / calf, gallery, habitat map, audio where available), fact-checked against IUCN, NOAA and the literature
- Search and filter on `/species`, with shareable filtered views
- Interactive classification tree of all 94 living cetacean species, and a whale of the day
- `/history` sourced timeline, `/populations` estimates and recovery charts, `/compare` side-by-side with shareable links
- `/anatomy`: interactive figures of how whales work, starting with echolocation (built with the [Anatomy kit](https://github.com/wheresryan22/anatomy), MIT)
- Quick find (`/` or Ctrl/Cmd+K) for any page or species
- Optional underwater ambience and a time-of-day ocean tint

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

## Production

```bash
npm run generate     # static HTML into dist/ (what Netlify runs)
npm run preview      # preview the generated output
```

`netlify.toml` builds with `npm run generate`, publishes `dist/`, and uses a catch-all `/* → /index.html` SPA fallback for prerendered routes.
