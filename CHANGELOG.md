# Changelog

## [2.0.0] - 2026-05-24

Complete rewrite from vanilla JS to React + TypeScript + Tailwind CSS. You can now browse recipes by category, view them with proper Markdown rendering, and run `pnpm lint` to validate recipe structure automatically.

### Added

- React + TypeScript + Tailwind CSS frontend — replaces the old vanilla build; recipes render as components with proper Markdown support
- Vite + Turbo build system with hot module replacement — `pnpm dev` starts instantly, changes reflect without a full reload
- `RecipeMenu` component: loads all recipes via `import.meta.glob`, groups by category, renders a browsable list — no more manual index maintenance
- `RecipeViewer` component: dynamic-imports individual recipe Markdown files as React components — each recipe loads on demand
- `uniqueMark` Vite plugin: injects git commit + version watermark into built assets — makes it easy to verify which build is deployed
- Lint CLI (`src/bin/lint.cli.ts`): enforces recipe Markdown structure (H1, required sections, ordered/unordered lists, cSpell locale) — run `pnpm lint` to catch formatting issues before they land
- Test suite: vitest with 55 tests across all components and utilities (100% branch coverage on app components)
- oxlint + oxfmt for linting and formatting — faster than ESLint, zero config
- GitHub Actions CI updated to Node 24 with pnpm cache

### Changed

- Recipe directories renamed from plural to singular (`aperitifs → aperitif`, `desserts → dessert`, `plats → plat`, `pains → pain`, `boissons → boisson`, `fromages → fromage`) — simpler paths, consistent with French grammar
- Several recipes updated with corrected content and additional entries
- Project structure migrated to monorepo-ready Turbo workspace layout

### Removed

- Old vanilla build system (`bin/build.js`, `tailwind.config.js`, `src/layout.html`) — replaced by Vite
- Custom ESLint config replaced by oxlint
- `.nvmrc`, `.npmrc`, `.markdownlint.json`, `.repo-checker.json` (tooling cleanup)
