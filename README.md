# kexhq/docs

The generated documentation site for [Kex](https://github.com/kexhq/kex),
published at <https://kexhq.github.io/docs/> (and mirrored at
<https://docs.kex.run> when the custom domain is configured).

Everything here is **generated** — do not edit it by hand. The site is built
from the Kex repository by the `Docs` workflow in `kexhq/kex`
(`.github/workflows/docs.yml`), which:

- runs `tey docs` (docgen) against every released tag plus the unreleased
  checkout,
- writes the result to the `gh-pages` branch, which GitHub Pages serves.

Regenerate by pushing to `kexhq/kex` `main` (unreleased docs) or tagging a
release (full rebuild), or run the `Docs` workflow manually.

## Hand-written content: guide/

The one exception to "everything is generated": guide/ holds the
book-style documentation source (Markdown with title/description/order
frontmatter) for Kex itself — the language, the standard library, and Tey.
Only the core trio lives here; every other package keeps its prose with its
own sources.

Layout is one directory per release: guide/0.4.0-alpha/, guide/0.3.0/,
and so on. A release snapshots its guide directory when it ships; main
carries the upcoming release.

The Docs workflow in kexhq/kex checks this repo out and builds the
checked-out guide into the site via tools/build-docs.sh (GUIDE_SOURCE),
so this directory must stay a flat tree of .md files — no subdirectories,
no non-Markdown inputs.
