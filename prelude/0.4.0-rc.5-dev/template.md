---
package: prelude
version: "0.4.0-rc.5-dev"
source: template.kex
title: Template
entities:
  - { kind: module, name: "Template" }
---

# Template

## module `Template`

ERB-style templates: scanning template text into nodes, and filling simple templates at run time.

Nothing here is in scope until `using Template`.

`Template.scan` turns template text into its frontmatter and a flat list of +Node+s: plain text and the four kinds of `<% %>` region. It does not run anything or parse Kex; the text inside a tag is kept as written. `Template.render` fills a template that only substitutes values, from a map. A template with Kex control flow is compiled instead, with `Template.html(Kex.embed(path))` or `Template.text(Kex.embed(path))`.

```kex
using Template

let source = "---\ntitle: Welcome\nparams: [name, library: Bool]\n---\nHi <%= name %>!"
let parsed = Template.scan(source).try
parsed.frontmatter.get("title")    # => Just(Scalar("Welcome"))
parsed.parameters.map { |p| (p.name, p.type) }
# => [("name", ""), ("library", "Bool")]
parsed.nodes                       # => [Text("Hi "), Interpolate("name"), Text("!")]
```

A template file's name puts the extension of what it produces before `.ket`, such as `README.md.ket` or `profile.html.ket`, so an editor can highlight it:

```kex
---
params: [name, library: Bool, dependencies: [Dependency]]
---
# <%= name %>

<% if library %>
A Kex library.
<% else %>
A Kex application.
<% end %>

<% dependencies.map do |dep| %>
- `<%= dep.name %>` ~> <%= dep.version %>
<% end %>
```

## Syntax

```kex
<%= expr %>     inserts the value, HTML-escaped by Template.html and
                Template.render
<%== expr %>    inserts the value without escaping
<% ... %>       Kex control code: if and match arms, block bodies, let
<%# ... %>      a comment, which produces nothing
<%- ... -%>     trims the indentation before the tag and the newline
                after it (see Whitespace below)
<%%             a literal <%, for a template that writes ERB itself
```

## Layouts

A layout is a template that takes the page as a block. The two templates do not refer to each other; the Kex code that calls them puts them together. Insert the block's result with `<%== %>`, since it is already rendered, and already escaped if it came from `Template.html`.

```kex
---
params: [title: String, content: Block<String>]
---
<title><%= title %></title>
<main><%== content() %></main>

let frame = Template.html(Kex.embed("views/layouts/auth.html.ket"))
let form = Template.html(Kex.embed("views/signin.html.ket"))

let signin(email: String) -> String = frame("Sign in") { form(email) }
```

## Whitespace

A `<% %>` or `<%# %>` tag that is alone on its line, with only whitespace around it, removes the whole line from the output, its indentation and newline included. So the template reads the way its output does:

```kex
<% if dependencies.count > 0 %>
## Dependencies
<% end %>

# => "## Dependencies\n", with no blank lines where the tags were
```

The `<%-` and `-%>` markers are for a tag that shares its line with other content, where only the author knows what should be trimmed:

```kex
Total: <%= total %> <%- if pending > 0 %>(<%= pending %> pending)<% end %>
```

An interpolation is never trimmed, even alone on its line. It stands for content, so the whitespace around it is content too:

```kex
<%= greeting %>
<%= name %>

# => "Hi\nAda\n", with both newlines kept
```

## Frontmatter

A template may start with a `---` line, then `key: value` lines, then a closing `---` line before the body. The keys are for whatever reads the template, such as a title or a list of tags, and the scanner reads every key the same way. A value is a plain string or a `[a, b, c]` list.

```kex
---
title: Release notes
tags: [changelog, public]
---
# <%= title %>
```

By convention, a template declares its parameters under `params`, as a list of names, each with an optional `: Type`:

```kex
---
params: [name, library: Bool, dependencies: [Dependency]]
---
# <%= name %>
```

`Parsed.parameters` reads that list and splits each entry at its first colon into a `TemplateParam`. The type stays text: `[Dependency]` is the string `"[Dependency]"`, not a resolved Kex type.

### `scan`

```kex
scan(source: String) -> Result<Parsed, TemplateError>
```

Scans template text into its frontmatter and nodes.

**Parameters**

  - `source` — the template's full text

**Returns**: the scanned template, or what is wrong with it

**Examples**

```kex
Template.scan("Hi <%= name %>!").map(~nodes)
# => Ok([Text("Hi "), Interpolate("name"), Text("!")])
```

_A control tag alone on its line leaves no blank line behind_

```kex
Template.scan("<% if admin %>\nWelcome back.\n<% end %>\n").try.nodes
# => [Control("if admin"), Text("Welcome back.\n"), Control("end")]
```

_An unclosed tag, reported at its position_

```kex
Template.scan("Hi <%= name")
# => Error(UnterminatedTag(6))
```

### `escapeHtml`

```kex
escapeHtml(text: String) -> String
```

Escapes `&`, `<`, `>`, double quotes and single quotes, so the text is safe in HTML content and in quoted attribute values.

`Template.html` escapes `<%= %>` tags this way. It does not make text safe inside a URL, a script or a style sheet.

**Parameters**

  - `text` — the text to escape

**Returns**: the escaped text

**Examples**

```kex
Template.escapeHtml("<b>Tom & Jerry</b>")
# => "&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;"
```

### `renderParsed`

```kex
renderParsed(parsed: Parsed, context: {String: String}) -> Result<String, TemplateError>
```

Fills a scanned template with the values in `context`.

`<%= %>` inserts the value HTML-escaped, and `<%== %>` inserts it as is. Only substitution is supported: a `<% ... %>` control tag gives an `UnsupportedControl` error. For templates with control flow, use `Template.html` or `Template.text`, which compile the template.

Each tag's trimmed text is looked up as a key, whole. `<%= dep.name %>` reads the `"dep.name"` key; it does not read a field of a value under `"dep"`.

**Parameters**

  - `parsed` — a template scanned by `Template.scan`
  - `context` — a value for every `<%= %>` and `<%== %>` tag, keyed by the tag's trimmed text

**Returns**: the rendered text, or why it could not be rendered

**Examples**

```kex
let parsed = Template.scan("Hi <%= name %>!").try
Template.renderParsed(parsed, { "name": "<Ada>" })
# => Ok("Hi &lt;Ada&gt;!")
```

_A tag that +context+ has no value for_

```kex
Template.renderParsed(Template.scan("<%= missing %>").try, {})
# => Error(UndefinedVariable("missing"))
```

_A control tag_

```kex
Template.renderParsed(Template.scan("<% if x %>y<% end %>").try, {})
# => Error(UnsupportedControl("if x"))
```

### `render`

```kex
render(source: String, context: {String: String}) -> Result<String, TemplateError>
```

Scans `source` and fills it with the values in `context`, as `Template.renderParsed` does.

**Parameters**

  - `source` — the template's full text
  - `context` — a value for every `<%= %>` and `<%== %>` tag, keyed by the tag's trimmed text

**Returns**: the rendered text, or why it could not be scanned or rendered

**Examples**

```kex
Template.render("Hi <%= name %>!", { "name": "Ada" })
# => Ok("Hi Ada!")
```

## type `Node`

One piece of a scanned template: plain text, or one kind of tag with the text inside it.

The text inside a tag is the Kex source between the delimiters, with the surrounding whitespace trimmed. It is not parsed.

**Variants**

  - `Text(String)`
  - `Interpolate(String)`
  - `InterpolateRaw(String)`
  - `Control(String)`
  - `Comment(String)`



## type `Tag`

A frontmatter value: a plain string, or a `[a, b, c]` list.

**Variants**

  - `Scalar(String)`
  - `Tags([String])`



## type `TemplateError`

The reason a template could not be scanned or rendered.

`UnterminatedTag` carries the character position of the tag that is not closed. `MalformedFrontmatterLine` carries the offending line. `UndefinedVariable` and `UnsupportedControl` come from `Template.render` and `Template.renderParsed`, and carry the tag's text.

**Variants**

  - `UnterminatedTag(Integer)`
  - `UnterminatedFrontmatter`
  - `MalformedFrontmatterLine(String)`
  - `UndefinedVariable(String)`
  - `UnsupportedControl(String)`



## record `TemplateParam`

One entry of a `params: [...]` frontmatter list: a name and its type.

`type` is the text after the colon, or `""` for a bare name. It is not resolved to a Kex type.

**Fields**

  - `name` : [String](string.md#make-string)
  - `type` : [String](string.md#make-string)



## record `TagScan`

One scanned `<% ... %>` tag and the whitespace trims its delimiters ask for. Used inside the scanner only.

It is declared outside `private do` because a record nested there loses its field names on BEAM.

**Fields**

  - `node` : Node
  - `leftTrim?` : [Bool](truthyable.md#make-bool)
  - `rightTrim?` : [Bool](truthyable.md#make-bool)



## record `Parsed`

A scanned template: its frontmatter, and its body as a list of nodes.

**Fields**

  - `frontmatter` : {[String](string.md#make-string): [Tag](#type-template-tag)}
  - `nodes` : [Node]

### Functions

#### `parameters`

```kex
parameters -> [TemplateParam]
```

Returns the parameters declared under the template's `params` key, in the order written.

Returns `[]` when there is no `params` key, or when its value is not a list.

**Returns**: the declared parameters

**Examples**

```kex
Template.scan("---\nparams: [name, library: Bool]\n---\n").try
  .parameters.map { |p| (p.name, p.type) }
# => [("name", ""), ("library", "Bool")]
```
