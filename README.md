# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Design Tokens & Tailwind Setup

The project uses Tailwind CSS (v4) with a minimal config (`tailwind.config.js`).

Current customizations:

- Primary color: `#1B5845` (available via `text-primary`, `bg-primary`, etc.)
- Font family alias: `font-avenir` (Avenir → falls back to system sans)
- Letter spacing helper: `tracking-tightpx` ( -0.25px )

Because we inlined most typography directly in components (to avoid custom class conflicts), you will see utility combinations like:

```
className="font-avenir font-extrabold text-[24px] leading-8 tracking-tightpx"
```

### Adding New Tokens

Extend `tailwind.config.js`:

```js
extend: {
  colors: { secondary: '#F2B705' },
  spacing: { '4.5': '1.125rem' },
  fontFamily: { avenir: ['Avenir','ui-sans-serif','system-ui'] },
}
```

### Suggested Future Enhancements

- Introduce CSS variables for dynamic theming (dark mode / brand variants).
- Centralize commonly repeated font utility groups via small wrapper components (e.g., `<Heading level={1}>`).
- Add a style guide page showcasing tokens and components.

## Animated Tabs Indicator

`Tabs` component uses a single sliding underline (CSS transform via width/left). To alter speed, adjust `duration-300` or easing class in `Tabs.tsx`.

## File Drop Zone

`FileDropZone` provides drag & drop + browse; customize border color or hover effect inside `FileDropZone.tsx`.

## Conventions

- Prefer axios services under `src/services/api` with clear response typing.
- Enrollee detail view lazy-loads claims when the Claims tab is first opened.
- Form date fields use ISO -> local slice for `<input type="date">`.

## Next Steps (Optional)

| Area | Idea |
|------|------|
| Theming | Add dark mode toggle (class strategy) |
| Typography | Extract repeated font stacks into semantic components |
| Accessibility | Add focus styles to Tabs indicator and ARIA roles |
| Testing | Snapshot test Tabs underline animation logic |
| Performance | Memoize heavy detail sub-sections if they grow |

---

Feel free to prune any sections not needed for distribution.
