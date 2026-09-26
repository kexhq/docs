---
package: tey
version: "0.2.0-dev"
source: tey/docgen/md.kex
title: Tey.Docgen.Md
entities:
  - { kind: module, name: "Tey.Docgen.Md" }
---

# Tey.Docgen.Md

Markdown → typed blocks → HTML.

Docgen already had a Markdown *emitter* (Tey.Docgen.Markdown, model → md for LLMs) and an RDoc parser for doc comments; neither reads a Markdown document. This does, so hand-written prose can go through the same chrome as the generated reference.

The subset is what the kex.run guide pages actually use: YAML-ish frontmatter, ATX headings, paragraphs, fenced code (```kex runs through the highlighter), blockquotes, ordered and unordered lists with nesting, GFM tables, thematic breaks, and inline code / bold / italics / links. It is deliberately not CommonMark — there is no HTML passthrough, no reference links, no setext headings — and anything it does not recognise stays a paragraph rather than becoming an error.

Nothing here knows about guides, books, or the kexhq site.

## module `Tey.Docgen.Md`

### `parseDocument`

```kex
parseDocument(text: String) -> Document
```

The whole job: text in, document out.

### `toHtml`

```kex
toHtml(text: String) -> String
```

Text in, HTML out — `parse` then `render`, which is all a caller wanting a page body needs.

### `splitFrontmatter`

```kex
splitFrontmatter(lines: [String]) -> (Frontmatter, [String])
```

--- frontmatter -------------------------------------------------------

A leading `---` fence delimits frontmatter. Without one the document is all body, and every field takes its default.

### `closingFence`

```kex
closingFence(lines: [String], index: Integer) -> Integer?
```

### `frontmatterOf`

```kex
frontmatterOf(lines: [String], accum: Frontmatter) -> Frontmatter
```

### `assign`

```kex
assign(front: Frontmatter, key: String, value: String) -> Frontmatter
```

### `unquote`

```kex
unquote(value: String) -> String
```

### `trimEnds`

```kex
trimEnds(value: String) -> String
```

Drops the first and last character — the quotes `quoted?` just matched.

### `quoted?`

```kex
quoted?(value: String, mark: String) -> Bool
```

### `parseBlocks`

```kex
parseBlocks(lines: [String]) -> [MdBlock]
```

--- block structure ---------------------------------------------------

### `blockLoop`

```kex
blockLoop(lines: [String], accum: [MdBlock]) -> [MdBlock]
```

One pass over the lines, each branch consuming the whole construct it recognises and returning the lines it did not take.

### `fence?`

```kex
fence?(line: String) -> Bool
```

### `rule?`

```kex
rule?(line: String) -> Bool
```

`---`, `***` or `___`, three or more, nothing else on the line. Checked after frontmatter is gone, so a stray `---` here really is a break.

### `ruleOf?`

```kex
ruleOf?(text: String, mark: String) -> Bool
```

### `headingLevel`

```kex
headingLevel(line: String) -> Integer
```

`##` → 2. Zero when the line is not a heading; `#hashtag` is not one.

### `countHashes`

```kex
countHashes(text: String, seen: Integer) -> Integer
```

### `takeCode`

```kex
takeCode(lines: [String]) -> (MdBlock, [String])
```

--- fenced code -------------------------------------------------------

The info string is the language. An unterminated fence runs to the end of the document rather than failing — a truncated page still renders.

### `closingCodeFence`

```kex
closingCodeFence(lines: [String], index: Integer) -> Integer
```

### `takeQuote`

```kex
takeQuote(lines: [String]) -> (MdBlock, [String])
```

--- blockquotes -------------------------------------------------------

`>` is stripped from each line and what remains is parsed as blocks, so a quote can hold anything a document can, nesting included.

### `quoteLine?`

```kex
quoteLine?(line: String) -> Bool
```

### `stripQuote`

```kex
stripQuote(line: String) -> String
```

### `takeList`

```kex
takeList(lines: [String]) -> (MdBlock, [String])
```

--- lists -------------------------------------------------------------

Nesting is by indentation: a line indented past the first item's marker belongs to that item and is parsed as blocks in its own right, so a list can hold paragraphs, code and deeper lists.

### `listLine?`

```kex
listLine?(line: String) -> Bool
```

A list continues through its own items, indented continuation lines, and blank lines — but a blank line followed by unindented text ends it, which is why the run is cut at the first line that is neither.

### `listItems`

```kex
listItems(lines: [String], indent: Integer, current: [String], accum: [ListItem]) -> [ListItem]
```

### `flushItem`

```kex
flushItem(current: [String], accum: [ListItem]) -> [ListItem]
```

The first line is the item's own text; anything below it is nested content, dedented so it parses as a document of its own.

### `dropTrailingBlanks`

```kex
dropTrailingBlanks(lines: [String]) -> [String]
```

### `dedent`

```kex
dedent(lines: [String]) -> [String]
```

Removes the common indent, so nested content is parsed at column zero.

### `indentOf`

```kex
indentOf(line: String) -> Integer
```

### `itemMarker`

```kex
itemMarker(line: String) -> String
```

### `bulletMarker`

```kex
bulletMarker(line: String) -> String
```

### `numberMarker`

```kex
numberMarker(line: String) -> String
```

"12. " → "12." ; anything else → "".

### `tableStart?`

```kex
tableStart?(lines: [String]) -> Bool
```

--- tables ------------------------------------------------------------

A GFM table is a header row and a delimiter row of dashes; without the delimiter the lines are ordinary paragraphs.

### `delimiterRow?`

```kex
delimiterRow?(line: String) -> Bool
```

### `delimiterChar?`

```kex
delimiterChar?(c: String) -> Bool
```

### `takeTable`

```kex
takeTable(lines: [String]) -> (MdBlock, [String])
```

### `cellsOf`

```kex
cellsOf(line: String) -> [String]
```

Leading and trailing pipes are optional, so the split is trimmed of the empty cells they produce.

### `takeParagraph`

```kex
takeParagraph(lines: [String]) -> (MdBlock, [String])
```

--- paragraphs --------------------------------------------------------

Runs to a blank line or to the start of any other construct, so a list or fence directly under prose is not swallowed into it.

### `paragraphLine?`

```kex
paragraphLine?(line: String) -> Bool
```

### `render`

```kex
render(items: [MdBlock]) -> String
```

--- rendering ---------------------------------------------------------

### `renderBlock`

```kex
renderBlock(block: MdBlock) -> String
```

### `renderCode`

```kex
renderCode(language: String, body: String) -> String
```

Kex code goes through the same highlighter the reference pages use, so a snippet in the guide looks like a signature in the reference. Everything else is escaped and left plain.

### `renderItems`

```kex
renderItems(items: [ListItem]) -> String
```

### `renderItem`

```kex
renderItem(item: ListItem) -> String
```

### `renderTable`

```kex
renderTable(header: [String], rows: [[String]]) -> String
```

### `renderRow`

```kex
renderRow(row: [String]) -> String
```

### `anchor`

```kex
anchor(text: String) -> String
```

A heading's id: lowercase, non-alphanumerics folded to single dashes.

### `trimDashes`

```kex
trimDashes(text: String) -> String
```

`String.trim` takes no argument, and the folding above can leave a dash at either end (`## \`try\`` → `-try-`).

### `anchorChar`

```kex
anchorChar(c: Char) -> String
```

### `squeezeDashes`

```kex
squeezeDashes(text: String, accum: String) -> String
```

### `stripInline`

```kex
stripInline(text: String) -> String
```

Inline markers removed, for anchors and any other plain-text use.

### `inline`

```kex
inline(text: String) -> String
```

--- inline ------------------------------------------------------------

Code spans first and separately: their content is escaped but never scanned for emphasis, so `a*b*c` inside backticks stays literal.

### `inlineLoop`

```kex
inlineLoop(text: String, accum: String) -> String
```

### `emphasis`

```kex
emphasis(text: String) -> String
```

Links before emphasis, so a `*` inside a URL is not read as a marker.

### `links`

```kex
links(text: String, accum: String) -> String
```

### `linkParts`

```kex
linkParts(rest: String) -> (String, String, String)?
```

`label](href)` → (label, href, what follows). None when the shape is not a link after all, in which case the `[` is literal text.

### `marks`

```kex
marks(text: String) -> String
```

`**bold**` before `*italic*`, or the opening `**` would parse as an empty emphasis. Escaping happens here, on the text that is left.

### `wrap`

```kex
wrap(text: String, strongMark: String, strongTag: String, emMark: String, emTag: String) -> String
```

### `pairs`

```kex
pairs(text: String, mark: String, tag: String, accum: String) -> String
```

Replaces each surviving pair of markers with a tag. An unpaired marker is left as written rather than swallowing the rest of the line.

### `indexOfText`

```kex
indexOfText(haystack: String, needle: String, at: Integer) -> Integer?
```

Where `needle` first occurs in `haystack`, or None. String.indexOf takes a Char, and the markers here are two characters wide ("**"), so the search is spelled out.

### `esc`

```kex
esc(s: String) -> String
```

## record `Frontmatter`

A document's frontmatter: the keys the prose pipeline reads. Unknown keys are parsed and ignored rather than rejected, so a page can carry metadata a later renderer will use.

**Fields**

  - `title` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `description` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string) (optional)
  - `order` : [Integer](../../../../prelude/0.4.0-beta.4-dev/number.md#make-integer) (optional)



## record `ListItem`

One item of a list: its own inline text, plus any blocks nested under it.

**Fields**

  - `text` : [String](../../../../prelude/0.4.0-beta.4-dev/string.md#make-string)
  - `children` : [[MdBlock](#type-tey-docgen-md-mdblock)]



## type `MdBlock`

**Variants**

  - `Heading(Integer, String)`
  - `Paragraph(String)`
  - `Code(String, String)`
  - `Quote([MdBlock])`
  - `Bullets([ListItem])`
  - `Numbers([ListItem])`
  - `Table([String], [[String]])`
  - `Rule`



## record `Document`

**Fields**

  - `frontmatter` : [Frontmatter](#record-tey-docgen-md-frontmatter)
  - `blocks` : [[MdBlock](#type-tey-docgen-md-mdblock)]


