# Changelog

All notable changes to this project are documented in this file.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- Astro static site scaffold (`astro.config.mjs`, TypeScript, Preact
  integration), configured for GitHub Pages at
  `https://sundione.github.io/what-limits-us/`.
- Build-time data pipeline (`scripts/generate-data.ts`) that reads the
  companion dataset from `nlp-self-reported-limitations` at a pinned
  commit (`dataset.config.json`) and generates:
  - a global search/filter index covering all 16,063 papers (union of
    the human-coded and LLM-coded datasets), and
  - one detail file per paper with sentence-level evidence spans,
    justifications, and code assignments.
- Landing page (`/`): title, authors, affiliations, venue badge,
  abstract, link bar (arXiv, dataset GitHub), and a one-click BibTeX
  copy block.
- Dataset explorer (`/explore`): search and filter papers by title,
  year, venue, track, or code; per-paper detail view with sentence-level
  code highlighting and justifications; reverse lookup from a code to
  every paper that carries it; every view is shareable via URL query
  parameters (`?paper=`, `?code=`) and restores correctly on reload.
- GitHub Actions workflow (`.github/workflows/deploy.yml`) that clones
  the pinned dataset commit, regenerates the data, builds the site, and
  deploys it to GitHub Pages on every push to `main`.

### Notes

- The methodology figure, codebook version-diff browser, results/charts
  page, and inter-annotator-agreement page are not yet built (see
  `docs/requirements.md` for the full requirements and roadmap).
- Requires the repository to be public and GitHub Pages source set to
  "GitHub Actions" before the deploy workflow can publish anything.
