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
