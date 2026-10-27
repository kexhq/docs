# kexhq/docs

The source of <https://docs.kex.run>: the Kex guide and landing page, written
with [Marqraft](https://github.com/Marqraft/cli) in the
[Krix](https://github.com/Marqraft/theme-krix) theme, around the reference
that [kexhq/kex](https://github.com/kexhq/kex) generates from source.

| where | what | who writes it |
|-------|------|---------------|
| `content/`, `.marqraft/` | landing page, guide, navigation, header links | you, in `marq dev` (or any editor) |
| `themes/theme-krix/` | the look (a git submodule) | Marqraft/theme-krix |
| `generated/` (ignored) | the Standard Library and Tey reference, mounted by `marqraft.jsonc` | kexhq/kex, `tools/build-docs.sh` |
| `scripts/finish.kex` | llms.txt, sitemap.xml, CNAME | this repo |

Branches: `main` is this source; `reference` holds only what kexhq/kex
generated; `gh-pages` is the published site. Nothing on `reference` or
`gh-pages` is edited by hand.

## Editing the site

```sh
git clone --recurse-submodules https://github.com/kexhq/docs && cd docs
git worktree add generated reference   # the reference (the mounts need it)
marq dev .                             # http://localhost:4173
```

`package.kex` declares the everyday commands, listed by `tey help`: `tey dev`
runs `marq dev .`, `tey site` builds the whole site into `dist/` the way the
publish workflow does, and `tey finish` writes only the site-wide files.

Click text to edit it; pages, links and order are edited in the sidebar and
header. Edits save to `content/` and `.marqraft/` as ordinary files — commit
them like any change. The reference pages show inside the site but are
read-only: they are generated from doc comments in kexhq/kex, so a fix to
one is a fix to that comment. `marqraft.jsonc` mounts each package directory
of `generated/` as a fragments mount; every version directory in it becomes
a version of that collection, so a new release needs no edit here.

To see the reference for a local kexhq/kex checkout instead, run `make docs`
there: it writes into `../docs/generated` when this repo is checked out
beside it.

## Publishing

`.github/workflows/publish.yml` builds the site with `marq build`, adds the
site-wide files with `scripts/finish.kex`, and publishes `dist/` to
`gh-pages`. It runs on every push to `main` and whenever kexhq/kex updates
the `reference` branch (a `reference-updated` dispatch after its own
releases and main pushes).

## A new release of the guide

Every release has its own copy of the guide at `/guide/<version>/`. When Kex
cuts a release, start the next edition from the current one:

```sh
marq copy-collection /guide/0.4.0/ /guide/0.5.0/ . --title Guide --unlist
```

`--unlist` keeps the old edition built and linkable but out of the header;
the copy gets fresh page ids and its internal links point at the new
version. Update the `version` setting (the header badge) under
Theme → Site, and the Guide link on the landing page.

## Verify the guide examples

The current guide is `/guide/0.4.0-beta.4/`. Its executable Kex fences are
checked directly from Markdown, so the tested code cannot drift from the
published examples:

```sh
python3 scripts/check-guide-examples.py --kex /path/to/kex
# During an edit:
python3 scripts/check-guide-examples.py --page records
```

Use the beta.4 toolchain. The default runs semantic analysis and execution on
both backends; pages marked `guide-backend: beam` run only on BEAM. The HTTP
example opens a temporary loopback listener. The walkthrough also checks real
input, invalid input, missing input, and usage output. The file-handle helper
is exercised against populated, empty, and missing files. All generated programs
and build artifacts live in a temporary directory.

Kex blocks on one page form one program in reading order. Use
`<!-- guide-example: name.kex -->` before each block in a multi-file example.
Shell instructions and package-file excerpts use other fence languages and
are not executed. Keep expected results as assertions. If the compiler needs
an Erlang version other than the one on PATH, set `KEX_ERL` and `KEX_ERLC` to
the matching runtime and compiler executables.
