---
package: tey
version: "0.2.0-dev"
source: tey/docgen/md.kex
title: Tey.Docgen.Md
entities:
  - { kind: module, name: "Tey.Docgen.Md" }
---

# Tey.Docgen.Md

## module `Tey.Docgen.Md`

Markdown → typed blocks → HTML.

Docgen already had a Markdown *emitter* (Tey.Docgen.Markdown, model → md for LLMs) and an RDoc parser for doc comments; neither reads a Markdown document. This does, so hand-written prose can go through the same chrome as the generated reference.

The subset is what the kex.run guide pages actually use: YAML-ish frontmatter, ATX headings, paragraphs, fenced code (```kex runs through the highlighter), blockquotes, ordered and unordered lists with nesting, GFM tables, thematic breaks, and inline code / bold / italics / links. It is deliberately not CommonMark — there is no HTML passthrough, no reference links, no setext headings — and anything it does not recognise stays a paragraph rather than becoming an error.

Nothing here knows about guides, books, or the kexhq site.

## record `Frontmatter`

A document's frontmatter: the keys the prose pipeline reads. Unknown keys are parsed and ignored rather than rejected, so a page can carry metadata a later renderer will use.

**Fields**

  - `title` : String (optional)
  - `description` : String (optional)
  - `order` : Integer (optional)

## record `ListItem`

One item of a list: its own inline text, plus any blocks nested under it.

**Fields**

  - `text` : String
  - `children` : [[MdBlock](#type-mdblock)]

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

  - `frontmatter` : [Frontmatter](#record-frontmatter)
  - `blocks` : [[MdBlock](#type-mdblock)]

## function `parseDocument`

The whole job: text in, document out.


```kex
parseDocument(text)
```


## function `toHtml`

Text in, HTML out — `parse` then `render`, which is all a caller wanting a page body needs.


```kex
toHtml(text)
```


## function `splitFrontmatter`

--- frontmatter -------------------------------------------------------

A leading `---` fence delimits frontmatter. Without one the document is all body, and every field takes its default.


```kex
splitFrontmatter(lines)
```


## function `closingFence`


```kex
closingFence(lines, index)
```


## function `frontmatterOf`


```kex
frontmatterOf(lines, accum)
```


## function `assign`


```kex
assign(front, key, value)
```


## function `unquote`


```kex
unquote(value)
```


## function `trimEnds`

Drops the first and last character — the quotes `quoted?` just matched.


```kex
trimEnds(value)
```


## function `quoted?`


```kex
quoted?(value, mark)
```


## function `parseBlocks`

--- block structure ---------------------------------------------------


```kex
parseBlocks(lines)
```


## function `blockLoop`

One pass over the lines, each branch consuming the whole construct it recognises and returning the lines it did not take.


```kex
blockLoop(lines, accum)
```


## function `fence?`


```kex
fence?(line)
```


## function `rule?`

`---`, `***` or `___`, three or more, nothing else on the line. Checked after frontmatter is gone, so a stray `---` here really is a break.


```kex
rule?(line)
```


## function `ruleOf?`


```kex
ruleOf?(text, mark)
```


## function `headingLevel`

`##` → 2. Zero when the line is not a heading; `#hashtag` is not one.


```kex
headingLevel(line)
```


## function `countHashes`


```kex
countHashes(text, seen)
```


## function `takeCode`

--- fenced code -------------------------------------------------------

The info string is the language. An unterminated fence runs to the end of the document rather than failing — a truncated page still renders.


```kex
takeCode(lines)
```


## function `closingCodeFence`


```kex
closingCodeFence(lines, index)
```


## function `takeQuote`

--- blockquotes -------------------------------------------------------

`>` is stripped from each line and what remains is parsed as blocks, so a quote can hold anything a document can, nesting included.


```kex
takeQuote(lines)
```


## function `quoteLine?`


```kex
quoteLine?(line)
```


## function `stripQuote`


```kex
stripQuote(line)
```


## function `takeList`

--- lists -------------------------------------------------------------

Nesting is by indentation: a line indented past the first item's marker belongs to that item and is parsed as blocks in its own right, so a list can hold paragraphs, code and deeper lists.


```kex
takeList(lines)
```


## function `listLine?`

A list continues through its own items, indented continuation lines, and blank lines — but a blank line followed by unindented text ends it, which is why the run is cut at the first line that is neither.


```kex
listLine?(line)
```


## function `listItems`


```kex
listItems(lines, indent, current, accum)
```


## function `flushItem`

The first line is the item's own text; anything below it is nested content, dedented so it parses as a document of its own.


```kex
flushItem(current, accum)
```


## function `dropTrailingBlanks`


```kex
dropTrailingBlanks(lines)
```


## function `dedent`

Removes the common indent, so nested content is parsed at column zero.


```kex
dedent(lines)
```


## function `indentOf`


```kex
indentOf(line)
```


## function `itemMarker`


```kex
itemMarker(line)
```


## function `bulletMarker`


```kex
bulletMarker(line)
```


## function `numberMarker`

"12. " → "12." ; anything else → "".


```kex
numberMarker(line)
```


## function `tableStart?`

--- tables ------------------------------------------------------------

A GFM table is a header row and a delimiter row of dashes; without the delimiter the lines are ordinary paragraphs.


```kex
tableStart?(lines)
```


## function `delimiterRow?`


```kex
delimiterRow?(line)
```


## function `delimiterChar?`


```kex
delimiterChar?(c)
```


## function `takeTable`


```kex
takeTable(lines)
```


## function `cellsOf`

Leading and trailing pipes are optional, so the split is trimmed of the empty cells they produce.


```kex
cellsOf(line)
```


## function `takeParagraph`

--- paragraphs --------------------------------------------------------

Runs to a blank line or to the start of any other construct, so a list or fence directly under prose is not swallowed into it.


```kex
takeParagraph(lines)
```


## function `paragraphLine?`


```kex
paragraphLine?(line)
```


## function `render`

--- rendering ---------------------------------------------------------


```kex
render(items)
```


## function `renderBlock`


```kex
renderBlock(block)
```


## function `renderCode`

Kex code goes through the same highlighter the reference pages use, so a snippet in the guide looks like a signature in the reference. Everything else is escaped and left plain.


```kex
renderCode(language, body)
```


## function `renderItems`


```kex
renderItems(items)
```


## function `renderItem`


```kex
renderItem(item)
```


## function `renderTable`


```kex
renderTable(header, rows)
```


## function `renderRow`


```kex
renderRow(row)
```


## function `anchor`

A heading's id: lowercase, non-alphanumerics folded to single dashes.


```kex
anchor(text)
```


## function `trimDashes`

`String.trim` takes no argument, and the folding above can leave a dash at either end (`## \`try\`` → `-try-`).


```kex
trimDashes(text)
```


## function `anchorChar`


```kex
anchorChar(c)
```


## function `squeezeDashes`


```kex
squeezeDashes(text, accum)
```


## function `stripInline`

Inline markers removed, for anchors and any other plain-text use.


```kex
stripInline(text)
```


## function `inline`

--- inline ------------------------------------------------------------

Code spans first and separately: their content is escaped but never scanned for emphasis, so `a*b*c` inside backticks stays literal.


```kex
inline(text)
```


## function `inlineLoop`


```kex
inlineLoop(text, accum)
```


## function `emphasis`

Links before emphasis, so a `*` inside a URL is not read as a marker.


```kex
emphasis(text)
```


## function `links`


```kex
links(text, accum)
```


## function `linkParts`

`label](href)` → (label, href, what follows). None when the shape is not a link after all, in which case the `[` is literal text.


```kex
linkParts(rest)
```


## function `marks`

`**bold**` before `*italic*`, or the opening `**` would parse as an empty emphasis. Escaping happens here, on the text that is left.


```kex
marks(text)
```


## function `wrap`


```kex
wrap(text, strongMark, strongTag, emMark, emTag)
```


## function `pairs`

Replaces each surviving pair of markers with a tag. An unpaired marker is left as written rather than swallowing the rest of the line.


```kex
pairs(text, mark, tag, accum)
```


## function `indexOfText`

Where `needle` first occurs in `haystack`, or None. String.indexOf takes a Char, and the markers here are two characters wide ("**"), so the search is spelled out.


```kex
indexOfText(haystack, needle, at)
```


## function `esc`


```kex
esc(s)
```

