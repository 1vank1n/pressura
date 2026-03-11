# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run deploy` — build and deploy to GitHub Pages via gh-pages
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript type check

## Architecture

React 18 + TypeScript app (Vite, inline styles, no CSS files). Health diary tracker for headaches and blood pressure, Russian-language UI.

### File structure

- **[src/types.ts](src/types.ts)** — `Entry` (union of `HeadacheEntry` | `BPEntry`), filter/tab types.
- **[src/constants.ts](src/constants.ts)** — pain levels, locations, triggers, month/weekday labels.
- **[src/utils.ts](src/utils.ts)** — date helpers (`now`, `parseDatetime`, `buildDatetime`), localStorage (`loadEntries`, `saveEntries`).
- **[src/styles.ts](src/styles.ts)** — all inline style objects (`S` for app, `PS` for date picker).
- **[src/App.tsx](src/App.tsx)** — root component, manages entries state and tab switching.
- **[src/components/EntryForm.tsx](src/components/EntryForm.tsx)** — add headache/bp entry form.
- **[src/components/History.tsx](src/components/History.tsx)** — history tab with month grouping, type filter, excel export/import.
- **[src/components/EntryCard.tsx](src/components/EntryCard.tsx)** — single entry display.
- **[src/components/DateTimePicker.tsx](src/components/DateTimePicker.tsx)** — custom calendar + time picker.

### Key details

- Data persists in `localStorage` under key `health-diary-entries`.
- Excel export/import uses the `xlsx` library.
- PWA-capable via [public/manifest.json](public/manifest.json).
- `vite.config.js` sets `base: '/pressura/'` for GitHub Pages deployment — update this if the repo name changes.
