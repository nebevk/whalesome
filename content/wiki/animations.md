# Animations & Interactions

## VueUse Motion

Whalesome uses VueUse Motion for smooth and performant animations throughout the application.

### Features Used

- **Scroll Animations**

  - Fade-in effects
  - Slide-up animations
  - Staggered reveals

- **Page Transitions**

  - Smooth page changes
  - Fade transitions
  - Slide effects

- **Interactive Elements**
  - Hover animations
  - Click effects
  - Loading states

### Implementation

```vue
<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0 }"
    :leave="{ opacity: 0, y: -100 }"
  >
    <!-- Content -->
  </div>
</template>
```

### Benefits

- Smooth performance
- Easy to implement
- Consistent animations
- Reduced bundle size
- Great developer experience
