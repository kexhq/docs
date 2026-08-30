---
package: prelude
version: "0.4.0-alpha"
source: template.kex
title: Template
entities:
  - { kind: module, name: "Template" }
---

# Template

## module `Template`

An ERB-shaped template scanner: template text in, a template AST out.

Opt-in — nothing here is in scope until `using Template`.

This is the scanning stage only (see the Template proposal for the fuller design): it turns template source into a flat list of `Node`s — plain text, and the four kinds of `<% %>` region — plus whatever frontmatter tags sit ahead of the body. It does not evaluate anything and does not know Kex syntax; the text inside a hole is kept as-is, for a later stage to parse and lower into real Kex.

```kex
using Template

let source = "---\nlayout: page\nparams: [name, library: Bool]\n---\nHi <%= name %>!"
let parsed = Template.scan(source).try
parsed.frontmatter.get("layout")   # => Just(Scalar("page"))
parsed.parameters                  # => [TemplateParam { name: "name", type: "" },
                                    #     TemplateParam { name: "library", type: "Bool" }]
parsed.nodes                       # => [Text("Hi "), Interpolate("name"), Text("!")]
```

## Syntax

```kex
<%= expr %>     interpolate (escaping is a later stage's job)
<%== expr %>    interpolate raw, no escaping
<% ... %>       a Kex control region: `if`/`match` arms, block bodies, `let`
<%# ... %>      comment, emits nothing
<%- ... -%>     whitespace control: trims the line's leading indent before
                the tag, and the newline right after it
<%%             a literal `<%`, for a template that generates ERB-shaped
                output itself
```

## Frontmatter

A template file may open with a `---` line, generic `key: value` tags up to a closing `---` line, and then the body. This is metadata for whatever reads the template — a title, a layout name, a list of tags — and there is nothing template-specific about it: it is scanned the same generic way whatever key is used.

```kex
---
title: Release notes
tags: [changelog, public]
---
# <%= title %>
```

A template's parameters, when a later stage needs them declared rather than inferred, are just another frontmatter key — conventionally `params`, a list of names each with an optional `: Type`:

```kex
---
params: [name, library: Bool, dependencies: [Dependency]]
---
# <%= name %>
```

Nothing in the scanner treats `params` specially while scanning — it is metadata like any other key, a `[a, b, c]` list same as `tags` above. `Parsed#parameters` is a convenience reader for it: it splits each entry on its first colon into a `TemplateParam { name, type }` (`type` is `""` for a bare name), so a caller does not need to know the key name, match on `Tag` itself, or split each entry by hand. `type` is raw text, same as everywhere else in this module — turning `[Dependency]` into a real, resolved Kex type is later work, not this module's.

## type `Node`

One piece of a scanned template.

Hole and control content is carried as raw text — the Kex source that was between the delimiters, trimmed of surrounding whitespace. Turning that text into real, type-checked Kex expressions is later work; a `Node` only records what KIND of region it is and what text it held.



**Variants**

  - `Text(String)`
  - `Interpolate(String)`
  - `InterpolateRaw(String)`
  - `Control(String)`
  - `Comment(String)`

## type `Tag`

A frontmatter value: a plain scalar, or a `[a, b, c]` list.



**Variants**

  - `Scalar(String)`
  - `Tags([String])`

## type `TemplateError`

Why a template's text could not be scanned, and where.



**Variants**

  - `UnterminatedTag(Integer)`
  - `UnterminatedFrontmatter`
  - `MalformedFrontmatterLine(String)`

## record `TemplateParam`

One entry from a `params: [...]` frontmatter list: a name, and its optional `: Type` annotation. `type` is raw text — `""` for a bare name, never a resolved Kex type — the same way a frontmatter `Tag` is text and not a parsed value.

**Fields**

  - `name` : String
  - `type` : String

## record `TagScan`

One scanned `<% ... %>` region: its node, and the whitespace trims its delimiters asked for. Not part of the public API — internal to scanning — but declared at module scope rather than inside `private do`: nested there, this record's fields lose their names under BEAM codegen and the value round-trips as an untagged tuple (`Undefined method: leftTrim for Tuple`), even though the same code is fine on the tree-walking interpreter.

**Fields**

  - `node` : Node
  - `leftTrim` : Bool
  - `rightTrim` : Bool

## record `Parsed`

A scanned template: its frontmatter tags, and its body as a node list.

**Fields**

  - `frontmatter` : {String: [Tag](#type-tag)}
  - `nodes` : [Node]

## make `Parsed`



## function `scan`

Scans template source into a `Parsed` template, or says where it broke.


```kex
scan(source)
```

