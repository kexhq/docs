---
package: tey
version: "0.2.1-dev"
source: tey/docgen/md.kex
title: Tey.Docgen.Md
entities:
  - { kind: module, name: "Tey.Docgen.Md" }
---

# Tey.Docgen.Md

A Markdown reader: parses a document into blocks and renders them as HTML, so hand-written pages get the same layout as the generated reference.

(`Tey.Docgen.Markdown` goes the other way, writing Markdown from the model.)

It reads the subset the kex.run guide pages use: simple `key: value` frontmatter, `#` headings, paragraphs, fenced code (`kex` code is highlighted), blockquotes, nested ordered and unordered lists, GFM tables, horizontal rules, and inline code, bold, italics and links. It is not CommonMark: there is no inline HTML, no reference links and no underlined headings. Anything it does not recognise is a paragraph, never an error.

## module `Tey.Docgen.Md`

### `parseDocument`

```kex
parseDocument(text: String) -> Document
```

Parses a Markdown document. Windows line endings are accepted.

### `toHtml`

```kex
toHtml(text: String) -> String
```

Returns the HTML for a document's body, ignoring its frontmatter.

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

Drops the first and last character, the quotes `quoted?` matched.

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

Returns `true` for a horizontal rule: three or more of `-`, `*` or `_` and nothing else on the line. Frontmatter is removed before this runs.

### `ruleOf?`

```kex
ruleOf?(text: String, mark: String) -> Bool
```

### `headingLevel`

```kex
headingLevel(line: String) -> Integer
```

Returns a heading's level, so `##` gives 2, or 0 when the line is not a heading. `#hashtag` is not one.

### `countHashes`

```kex
countHashes(text: String, seen: Integer) -> Integer
```

### `takeCode`

```kex
takeCode(lines: [String]) -> (MdBlock, [String])
```

--- fenced code -------------------------------------------------------

Takes a fenced code block. The word after the fence is the language. A fence that is never closed runs to the end of the document.

### `closingCodeFence`

```kex
closingCodeFence(lines: [String], index: Integer) -> Integer
```

### `takeQuote`

```kex
takeQuote(lines: [String]) -> (MdBlock, [String])
```

--- blockquotes -------------------------------------------------------

Takes a blockquote. The `>` is stripped from each line and the rest is parsed as blocks, so a quote can hold anything a document can.

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

Takes a list. A line indented past the first item's marker belongs to the item above it and is parsed as blocks, so an item can hold paragraphs, code and nested lists.

### `listLine?`

```kex
listLine?(line: String) -> Bool
```

Returns `true` for a line that can continue a list: an item, an indented line or a blank line. The first other line ends the list.

### `listItems`

```kex
listItems(lines: [String], indent: Integer, current: [String], accum: [ListItem]) -> [ListItem]
```

### `flushItem`

```kex
flushItem(current: [String], accum: [ListItem]) -> [ListItem]
```

Adds the collected item to `accum`. The first line is the item's text; the lines below it are dedented and parsed as nested blocks.

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

Returns a numbered-list marker, so `"12. "` gives `"12."`, or `""` when the line has none.

### `tableStart?`

```kex
tableStart?(lines: [String]) -> Bool
```

--- tables ------------------------------------------------------------

Returns `true` when the lines start a GFM table: a header row followed by a row of dashes. Without that row the lines are a paragraph.

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

Returns the cells of a table row. Leading and trailing pipes are optional.

### `takeParagraph`

```kex
takeParagraph(lines: [String]) -> (MdBlock, [String])
```

--- paragraphs --------------------------------------------------------

Takes a paragraph, which ends at a blank line or where another block starts, so a list or code fence right under prose is not swallowed.

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

Renders a code block. Kex code goes through the reference pages' highlighter; other languages are escaped and left plain.

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

Returns a heading's id: lower case, with each run of characters other than letters and digits turned into one dash.

### `trimDashes`

```kex
trimDashes(text: String) -> String
```

Removes dashes from both ends, which `anchor` can leave: `(try)` becomes `-try-` before this.

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

Returns the text with the inline markers (backticks, `*` and `_`) removed.

### `inline`

```kex
inline(text: String) -> String
```

--- inline ------------------------------------------------------------

Renders inline Markdown. Code spans are handled first: their content is escaped but not scanned for emphasis, so `a*b*c` in backticks stays as written.

### `inlineLoop`

```kex
inlineLoop(text: String, accum: String) -> String
```

### `emphasis`

```kex
emphasis(text: String) -> String
```

Renders links, then bold and italics, so a `*` inside a URL is not read as a marker.

### `links`

```kex
links(text: String, accum: String) -> String
```

### `linkParts`

```kex
linkParts(rest: String) -> (String, String, String)?
```

Splits `label](href)` and what follows it into `(label, href, rest)`, or returns `None` when it is not a link, and the `[` is plain text.

### `marks`

```kex
marks(text: String) -> String
```

Renders bold before italics, or the opening `**` would be read as empty italics. The remaining text is escaped here.

### `wrap`

```kex
wrap(text: String, strongMark: String, strongTag: String, emMark: String, emTag: String) -> String
```

### `pairs`

```kex
pairs(text: String, mark: String, tag: String, accum: String) -> String
```

Replaces each pair of markers with a tag. A marker without a partner is left as written.

### `indexOfText`

```kex
indexOfText(haystack: String, needle: String, at: Integer) -> Integer?
```

Returns where `needle` first occurs in `haystack` from `at` on, or `None`. `String.indexOf` only finds a `Char`, and `**` is two characters.

### `esc`

```kex
esc(s: String) -> String
```

## record `Frontmatter`

The frontmatter keys this reader uses. Other keys are ignored, so a page may carry metadata for something else.

**Fields**

  - `title` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `description` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string) (optional)
  - `order` : [Integer](../../../../prelude/0.4.0-rc.5-dev/number.md#make-integer) (optional)



## record `ListItem`

One item of a list: its own inline text, plus any blocks nested under it.

**Fields**

  - `text` : [String](../../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `children` : [[MdBlock](#type-tey-docgen-md-mdblock)]



## type `MdBlock`

A block of a Markdown document.

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

A parsed document: its frontmatter and its blocks.

**Fields**

  - `frontmatter` : [Frontmatter](#record-tey-docgen-md-frontmatter)
  - `blocks` : [[MdBlock](#type-tey-docgen-md-mdblock)]


