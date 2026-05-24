# Recipes

<!-- markdownlint-disable MD043 -->

[![GitHub license](https://img.shields.io/github/license/shuunen/recipes.svg?color=informational)](https://github.com/Shuunen/recipes/blob/master/LICENSE)
[![Mozilla HTTP Observatory Grade](https://img.shields.io/mozilla-observatory/grade/recettes-shuunen.netlify.app.svg?publish)](https://observatory.mozilla.org/analyze/recettes-shuunen.netlify.app)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/Shuunen/recipes?style=flat)](https://codeclimate.com/github/Shuunen/recipes)
[![Website](https://img.shields.io/website/https/recettes-shuunen.netlify.app.svg)](https://recettes-shuunen.netlify.app)

![logo](docs/logo.svg)

> My personal [ french ] recipes

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

## Stack

React + TypeScript + Tailwind CSS, built with Vite and Turbo.

- **RecipeMenu** — loads all recipes via `import.meta.glob`, groups by category, renders a browsable list
- **RecipeViewer** — dynamic-imports individual recipe markdown files as React components
- **Lint CLI** (`src/bin/lint.cli.ts`) — enforces recipe markdown structure: H1, required sections, cSpell locale
- **uniqueMark** plugin — injects git commit + version watermark into built assets
- Test suite: vitest (55 tests, 100% branch coverage on app components)
- oxlint + oxfmt for linting and formatting

## Demo

![demo](docs/demo.gif)

## Thanks

- [Boxy Svg](https://boxy-svg.com) : simple & effective svg editor
- [Github](https://github.com) : this great, free and evolving platform
- [Gordon Johnson](https://pixabay.com/users/GDJ-1086657) : elegant divider
- [Netlify](https://netlify.com/) : always here offering free hosting for open source projects
- [oxlint](https://oxc.rs/docs/guide/usage/linter) : fast Rust-based linter replacing ESLint
- [React](https://react.dev) : the UI library powering the frontend
- [Shields.io](https://shields.io) : for the nice badges on top of this readme
- [Svg Omg](https://jakearchibald.github.io/svgomg/) : the great king of svg file size reduction
- [Tailwind CSS](https://tailwindcss.com) : utility-first CSS framework
- [Vecteezy](https://www.vecteezy.com/free-vector/macaroni) : funky macaroni pattern background (I made it repeatable)
- [Vite](https://vitejs.dev) : next generation frontend build tool
- [Vitest](https://vitest.dev) : blazing fast unit test framework

## Stargazers over time

[![Stargazers over time](https://starchart.cc/Shuunen/recipes.svg?variant=adaptive)](https://starchart.cc/Shuunen/recipes)

## Page views

[![Free Website Counter](https://www.websitecounterfree.com/c.php?d=9&id=63986&s=12)](https://www.websitecounterfree.com)
