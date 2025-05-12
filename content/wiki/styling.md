# UI & Styling

## Tailwind CSS

Whalesome uses Tailwind CSS for utility-first styling, providing a flexible and maintainable approach to styling the application.

### Custom Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        "ocean-light": "#f0f7ff",
        "ocean-dark": "#1a365d",
        ocean: "#2c5282",
        "whale-blue": "#1a365d",
        "whale-gray": "#4a5568",
      },
      fontFamily: {
        whale: ["Whale", "sans-serif"],
      },
    },
  },
};
```

### Key Features

- **Utility-First Approach**

  - Rapid development
  - Consistent design
  - Easy maintenance

- **Custom Components**

  - Reusable UI elements
  - Consistent styling
  - Responsive design

- **Responsive Design**
  - Mobile-first approach
  - Breakpoint utilities
  - Flexible layouts

## Headless UI

For accessible and interactive components, we use Headless UI.

### Components Used

- **Modal Dialogs**

  - Accessible by default
  - Keyboard navigation
  - Focus management

- **Navigation Menus**

  - Dropdown menus
  - Mobile navigation
  - Keyboard support

- **Transition Components**
  - Smooth animations
  - Accessible transitions
  - Customizable effects

### Example Usage

```vue
<template>
  <Menu as="div" class="relative">
    <MenuButton>Options</MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
    >
      <MenuItems>
        <!-- Menu items here -->
      </MenuItems>
    </transition>
  </Menu>
</template>
```
