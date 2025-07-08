# Theming Guide for This Project

This document explains how theming works in this project, how to add new themes, and how to apply them globally or to individual components. It uses the `ThemeSettings` component as an example.

---

## 1. Defining Theme Variables

All theme variables are defined in `src/index.css` using CSS custom properties:

```css
:root {
  --color-bg: #fff;
  --color-text: #18181A;
}
.theme-dark {
  --color-bg: #181818;
  --color-text: #fff;
}
.theme-black {
  --color-bg: #0F0F0F;
  --color-text: #fff;
}
```

- `:root` is the default (light) theme.
- `.theme-dark` and `.theme-black` override the variables for their respective themes.

---

## 2. Tailwind Setup for Theme Variables

In `tailwind.config.js`, map Tailwind color utilities to these variables:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
      },
    },
  },
}
```

Now you can use `bg-bg` and `text-text` in your components.

---

## 3. Using Theme Classes in Components

To apply a theme to a component, add the theme class to its root element:

```tsx
<div className="theme-dark bg-bg text-text p-4">
  This box uses the dark theme!
</div>
```

- Use `theme-dark`, `theme-black`, or any other theme class you define.
- Use `bg-bg` and `text-text` for theme-aware background and text color.

---

## 4. Example: ThemeSettings Component

The `ThemeSettings` component demonstrates local theming:

```tsx
const theme = useSelector((state: any) => state.theme.theme);
return (
  <div className={`bg-bg text-text ${theme === 'dark' ? 'theme-dark' : theme === 'black' ? 'theme-black' : ''}`}>
    {/* ... */}
  </div>
);
```
- The theme class is applied only to this component.
- The background and text color update according to the selected theme.

---

## 5. How Theme Logic Works (Redux + CSS)

- The current theme is stored in Redux (`themeSlice.theme`).
- When you select a theme in ThemeSettings, it dispatches `setTheme('dark')`, `setTheme('black')`, etc.
- The root div of ThemeSettings gets the corresponding class.
- The CSS variables for that class are applied, and Tailwind utilities (`bg-bg`, `text-text`) use those variables.
- Only the component with the theme class is affected.

---

## 6. Applying a Theme Globally vs. Locally

- **Globally:** Add the theme class to `<body>` or `<html>` to affect the whole app.
- **Locally:** Add the theme class to a specific component’s root div to affect only that component.

---

## 7. How to Add a New Theme

1. Add a new class in `index.css`:
   ```css
   .theme-blue {
     --color-bg: #e0f2fe;
     --color-text: #0369a1;
   }
   ```
2. Add the option in your Redux slice and UI.
3. Use the new class on any component as needed.

---

## 8. Summary Table

| Theme Class   | Affected Area      | How to Use                |
|---------------|--------------------|--------------------------|
| .theme-dark   | Local or global    | Add to div or <body>     |
| .theme-black  | Local or global    | Add to div or <body>     |
| .theme-blue   | Local or global    | Add to div or <body>     |

---

## 9. Troubleshooting

- If you don’t see the effect, check:
  - The theme class is applied to the correct element.
  - The element uses `bg-bg` and `text-text`.
  - The CSS variables are set in `index.css`.
  - Tailwind config maps `bg-bg` and `text-text` to the variables.

---

## 10. Example: Toggling Themes in ThemeSettings

- When you click a theme button, Redux updates the theme state.
- The root div of ThemeSettings gets the new theme class.
- The CSS variables update, and the component’s colors change.
- The rest of the app is unaffected unless you apply the theme class elsewhere.

---

**This guide will help you implement, debug, and extend theming in your project!** 