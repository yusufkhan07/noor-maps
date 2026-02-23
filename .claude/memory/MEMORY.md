# Project Memory

## React Native / Component Conventions

- **Each component gets its own folder**, e.g. `src/components/MyComponent/`
- Inside the folder:
  - `MyComponent.tsx` — the component file
  - `styles.ts` — styles (using `StyleSheet.create`) in a separate file
- Each file should have **one component**, but up to 2–3 small internal sub-components is acceptable
- Keep styles co-located in `styles.ts`, not inline or in the component file
