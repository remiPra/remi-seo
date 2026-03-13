# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro 5 + React 19 marketing website for "Rémi SEO" — a digital visibility consultant based in Aix-en-Provence, France. All UI content is in French.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Production build to ./dist/
npm run preview   # Preview production build locally
```

No test or lint scripts are configured.

## Architecture

**Framework**: Astro with React integration (`@astrojs/react`). Astro handles static rendering; React is used for interactive client-side components loaded with `client:load`.

**Routing**: File-based via `src/pages/`:
- `/` → `index.astro` (homepage)
- `/devis` → `devis.astro` (quote estimator)
- `/financement` → `financement.astro` (HCR restaurant financing landing page)

**Key components**:
- `src/layouts/Layout.astro` — Base HTML layout, meta tags, font imports (Playfair Display, DM Sans)
- `src/components/Welcome.astro` — Homepage: hero, stats, services, testimonials, CTA with scroll-snap sections
- `src/components/Estimateur.jsx` — Large (~900 lines) interactive quote calculator with multi-step form, service catalog (60+ services by category), recommendation engine, localStorage persistence, and lead capture
- `src/components/Financement.astro` — Financing page for HCR sector

**Styling**: Scoped CSS in Astro components + `<style is:global>` blocks. CSS variables for theming. Responsive breakpoints at 900px, 640px, 380px. Scroll-snap, Intersection Observer animations, parallax effects.

**Static assets**: `public/` contains PDFs and downloadable documents served as-is.

## TypeScript

Extends `astro/tsconfigs/strict`. JSX configured for React (`react-jsx` / `jsxImportSource: "react"`).
