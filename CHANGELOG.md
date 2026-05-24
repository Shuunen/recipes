# Changelog

## [2.0.0] - 2026-05-24

### Added

- React + TypeScript + Tailwind CSS frontend replacing the old vanilla build
- Vite + Turbo build system with hot module replacement
- `RecipeMenu` component: loads all recipes via `import.meta.glob`, groups by category, renders a browsable list
- `RecipeViewer` component: dynamic-imports individual recipe markdown files as React components
- `uniqueMark` Vite plugin: injects git commit + version watermark into built assets
- Lint CLI (`src/bin/lint.cli.ts`): enforces recipe markdown structure (H1, required sections, ordered/unordered lists, cSpell locale)
- Test suite: vitest with 55 tests across all components and utilities (100% branch coverage on app components)
- oxlint + oxfmt for linting and formatting
- GitHub Actions CI updated to Node 24 with pnpm cache

### Changed

- Recipe directories renamed from plural to singular (`aperitifs → aperitif`, `desserts → dessert`, `plats → plat`, `pains → pain`, `boissons → boisson`, `fromages → fromage`)
- Several recipes updated with corrected content and additional entries
- Project structure migrated to monorepo-ready Turbo workspace layout

### Removed

- Old vanilla build system (`bin/build.js`, `tailwind.config.js`, `src/layout.html`)
- Custom ESLint config replaced by oxlint
- `.nvmrc`, `.npmrc`, `.markdownlint.json`, `.repo-checker.json` (tooling cleanup)
