# Whalesome Development Plan

## Project Overview
A Nuxt 3 application dedicated to whales, featuring a theme switcher, immersive homepage, species information, and conservation resources.

**Tech Stack:**
- Nuxt 3 with Vue 3
- DaisyUI + Tailwind CSS
- TypeScript
- VueUse Motion (already configured)

---

## Phase 1: Project Setup & Configuration

### 1.1 Install and Configure DaisyUI
- [ ] Install DaisyUI: `npm install -D daisyui@latest`
- [ ] Update `tailwind.config.js` to include DaisyUI plugin
- [ ] Configure DaisyUI themes: "classic" and "spirit" mode
- [ ] Test DaisyUI components are working

### 1.2 Project Structure Setup
- [ ] Create `composables/` directory for reusable logic
- [ ] Create `types/` directory for TypeScript interfaces
- [ ] Create `data/` directory for whale species data
- [ ] Set up proper TypeScript types for whale species

---

## Phase 2: Theme Switcher Implementation

### 2.1 Theme Management
- [ ] Create `composables/useTheme.ts` composable
  - [ ] Implement theme state management (classic/spirit)
  - [ ] Add localStorage persistence
  - [ ] Add reactive theme switching
- [ ] Update `app.vue` or layout to apply theme class to root element

### 2.2 Theme Switcher Component
- [ ] Create `components/ThemeSwitcher.vue`
  - [ ] Toggle button/switch UI
  - [ ] Visual indicator of current theme
  - [ ] Smooth transition between themes
- [ ] Integrate ThemeSwitcher into header/navigation

### 2.3 Theme Styles
- [ ] Define "classic" theme colors and styles
- [ ] Define "spirit" theme colors and styles (mystical/oceanic)
- [ ] Ensure all components respect theme switching

---

## Phase 3: Homepage Implementation

### 3.1 Hero Section
- [ ] Create `components/HomeHero.vue`
  - [ ] Large, majestic hero section
  - [ ] Display exact text:
    - Main heading: "Whalesome"
    - Subheading: "Discover the majestic world of whales — their stories, species, and the deep connection we share with them."
    - Quote: "The whale is a creature of myth, of beauty, and of oceanic truth. To hear its song is to touch the soul of the sea."
  - [ ] Ocean depth visual effect (gradient from surface to deep)
  - [ ] Smooth animations using VueUse Motion

### 3.2 Whale Classification Tree Section
- [ ] Create `components/WhaleTree.vue`
  - [ ] Visual tree/hierarchy of whale groups and families
  - [ ] Interactive elements (hover effects, expandable sections)
  - [ ] Use DaisyUI components for styling
  - [ ] Data structure for whale taxonomy:
    - Baleen whales (Mysticeti)
    - Toothed whales (Odontoceti)
    - Sub-families and groups

### 3.3 Featured Species Grid Section
- [ ] Create `components/SpeciesGrid.vue`
  - [ ] Grid layout (4 columns on desktop, responsive)
  - [ ] Display 4 main species:
    1. Blue Whale
    2. Humpback Whale
    3. Orca (Killer Whale)
    4. Beluga Whale
  - [ ] Each card includes:
    - Species name
    - Short description
    - Image/illustration
    - Link to species detail page
  - [ ] Use DaisyUI card components

### 3.4 Conservation Section
- [ ] Create `components/ConservationSection.vue`
  - [ ] Call-to-action to get involved
  - [ ] Grid/list of conservation organizations
  - [ ] Social media accounts section (Instagram, etc.)
  - [ ] Links to organizations doing good work for whales
  - [ ] Engaging visuals and copy

### 3.5 Homepage Integration
- [ ] Update `pages/index.vue`
  - [ ] Integrate all homepage sections
  - [ ] Implement ocean depth scrolling effect
  - [ ] Ensure smooth transitions between sections
  - [ ] Add parallax or depth effects

---

## Phase 4: About Page

### 4.1 About Page Content
- [ ] Update `pages/about.vue`
- [ ] Create three-column layout
- [ ] Three pillars of motivation:
  1. **My Love for Whales** - Personal connection and passion
  2. **My Sandbox for Learning** - Educational/experimental aspect
  3. **My Passion for Web Development** - Technical showcase
- [ ] Use DaisyUI grid/card components
- [ ] Add engaging visuals and content

---

## Phase 5: Whale Species Page

### 5.1 Species Data Structure
- [ ] Create `data/species.ts` or `types/species.ts`
  - [ ] Define TypeScript interfaces for species data
  - [ ] Include fields: name, description, adult info, baby info, images, etc.
  - [ ] Create data for all 4 main species + additional species

### 5.2 Species Page Layout
- [ ] Update `pages/species.vue` or create `pages/species/[id].vue`
- [ ] Two-column layout:
  - **Left Side**: Navigation menu/sidebar
    - [ ] List of all whale species
    - [ ] Active species highlighting
    - [ ] Smooth navigation between species
  - **Right Side**: Species information display
    - [ ] Species name and overview
    - [ ] DaisyUI diff component for adult vs baby whale
    - [ ] Toggle between adult and baby views
    - [ ] Additional species information

### 5.3 Species Detail Component
- [ ] Create `components/SpeciesDetail.vue`
  - [ ] Display species information
  - [ ] Integrate DaisyUI diff component
  - [ ] Adult whale information panel
  - [ ] Baby whale information panel
  - [ ] Images for both adult and baby
  - [ ] Key facts and characteristics

### 5.4 Species Navigation
- [ ] Create `components/SpeciesNav.vue`
  - [ ] Sidebar navigation component
  - [ ] List of all available species
  - [ ] Active state management
  - [ ] Smooth scrolling/highlighting

---

## Phase 6: Styling & Polish

### 6.1 Ocean Depth Theme
- [ ] Implement gradient system for homepage
  - [ ] Surface colors (light blue, bright)
  - [ ] Mid-depth colors (medium blue)
  - [ ] Deep ocean colors (dark blue, navy)
- [ ] Apply depth effect to sections
- [ ] Ensure theme works in both classic and spirit modes

### 6.2 Responsive Design
- [ ] Test and optimize for mobile devices
- [ ] Test and optimize for tablets
- [ ] Test and optimize for desktop
- [ ] Ensure all components are responsive

### 6.3 Animations & Transitions
- [ ] Add smooth page transitions
- [ ] Add scroll animations
- [ ] Add hover effects
- [ ] Ensure performance is optimal

### 6.4 Accessibility
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Ensure color contrast meets WCAG standards

---

## Phase 7: Content & Data

### 7.1 Whale Species Content
- [ ] Research and write content for each species
- [ ] Collect/create images for species
- [ ] Write adult vs baby whale comparisons
- [ ] Add scientific names and taxonomy

### 7.2 Conservation Resources
- [ ] Research conservation organizations
- [ ] Collect social media accounts
- [ ] Write engaging conservation content
- [ ] Add links and resources

### 7.3 Whale Classification Data
- [ ] Research whale taxonomy
- [ ] Create accurate classification tree
- [ ] Add visual representation
- [ ] Make it interactive and educational

---

## Phase 8: Testing & Optimization

### 8.1 Functionality Testing
- [ ] Test theme switcher in all scenarios
- [ ] Test navigation between pages
- [ ] Test species page switching
- [ ] Test all links and interactions

### 8.2 Performance Optimization
- [ ] Optimize images
- [ ] Lazy load components
- [ ] Optimize bundle size
- [ ] Test loading times

### 8.3 Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

---

## Implementation Notes

### DaisyUI Theme Configuration
The "classic" and "spirit" themes should be defined in `tailwind.config.js`:
```js
daisyui: {
  themes: [
    {
      classic: {
        // Classic theme colors
      },
      spirit: {
        // Spirit/mystical theme colors
      }
    }
  ]
}
```

### Ocean Depth Effect
Consider using:
- CSS gradients with multiple stops
- Parallax scrolling
- Z-index layering
- Color transitions from light to dark blue

### Species Data Structure
```typescript
interface WhaleSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  adult: {
    size: string;
    weight: string;
    characteristics: string[];
    image: string;
  };
  baby: {
    size: string;
    weight: string;
    characteristics: string[];
    image: string;
  };
  habitat: string;
  conservationStatus: string;
}
```

---

## Priority Order
1. Phase 1: Setup & Configuration
2. Phase 2: Theme Switcher
3. Phase 3: Homepage (Hero → Tree → Grid → Conservation)
4. Phase 4: About Page
5. Phase 5: Species Page
6. Phase 6-8: Polish, Content, Testing
