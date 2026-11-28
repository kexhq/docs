---
package: prelude
version: "0.4.0-rc.4-dev"
source: string.kex
title: String
entities:
  - { kind: make, name: "String" }
  - { kind: make, name: "Char" }
  - { kind: module, name: "String" }
  - { kind: make, name: "Tuple" }
---

# String

## type `String`

Implements [`Monoid`](algebra.md#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Comparable`](comparable.md#trait-comparable), [`Enumerable<Char>`](enumerable.md#trait-enumerable), [`Foldable<Char>`](enumerable.md#trait-foldable), [`Truthyable`](truthyable.md#trait-truthyable).

Text. A `String` is an immutable sequence of Unicode characters; functions that transform text return a new string.

A `String` is its own type, not a list of characters. It is `Enumerable`, so `each`, `reduce` and `find` walk it one `Char` at a time. Sequence functions return whichever type is more useful: `take`, `drop` and `sort` return a `String`, while `first` and `last` return a `Char`. Use `chars` to get a `[Char]`.

```kex
let line = "  Hello, World  "
line.trim.lowerCase.split(", ")   # => ["hello", "world"]
line.trim.take(5)                 # => "Hello"
line.trim.chars.count(~upper?)    # => 2
```

Strings interpolate with `${...}`:

```kex
let name = "Ada"
"hello, ${name}"                  # => "hello, Ada"
```

### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: A, f: (A -> Char -> A)) -> A
```

Folds the string from the left, one `Char` at a time.

`String`'s other `Enumerable` functions, such as `map`, `find` and `any?`, are built on this one. Use it directly to accumulate something that is neither a string nor a list.

**Parameters**

  - `acc` — the initial accumulator
  - `f` — combines the accumulator with each character

**Returns**: the final accumulator

**Examples**

_Summing digit values_

```kex
"12345".reduce(0) { |sum, c| sum + c.codepoint - 48 }   # => 15
```

_Building a character histogram_

```kex
"banana".reduce({}) do |counts, c|
  counts.put(c.string, counts.get(c.string).or(0) + 1)
end
# => { "a": 3, "b": 1, "n": 2 }
```

### `each` (from Foldable)

```kex
each(f: (Char -> Void)) -> Void
```

Calls `f` with each character, for its side effects.

**Parameters**

  - `f` — called once per character

**Examples**

```kex
"ab".each { |c| IO.printLine(c) }
```

### `mapChars`

```kex
mapChars(f: (Char -> Char)) -> String
```

Applies `f` to every character and joins the results into a `String`.

`map`, from `Enumerable`, returns a list, since its function may return something other than a `Char`. Use `mapChars` when you want a string back.

**Parameters**

  - `f` — applied to each character

**Returns**: the mapped characters, as a string

**Examples**

```kex
"hi".mapChars(&.upperCase)   # => "HI"
"hi".map(&.upperCase)        # => ['H', 'I']  (a list, per Enumerable)
```

_Shifting every character up one codepoint_

```kex
"abc".mapChars do |c|
  String.fromCodepoint(c.codepoint + 1).or("").first.or(c)
end
# => "bcd"
```

### `filter` (from Enumerable)

```kex
filter(pred: (Char -> Bool)) -> String
```

Returns the characters satisfying `pred`, as a `String`.

**Parameters**

  - `pred` — a character is kept when this returns `true`

**Returns**: the matching characters, in order

**Examples**

_Keeping only the digits_

```kex
"a1b2c3".filter(~digit?)   # => "123"
```

_Stripping punctuation before comparing_

```kex
"Hello, World!".filter(~alpha?).lowerCase   # => "helloworld"
```

### `uniq`

```kex
uniq -> String
```

Returns the string with repeated characters removed, keeping the first occurrence of each.

**Returns**: the distinct characters, in first-seen order

**Examples**

```kex
"banana".uniq   # => "ban"
"hello".uniq    # => "helo"
```

### `first`

```kex
first -> Char?
```

A String is its own type, not a [Char], so the sequence functions below are declared here instead of coming from List: `take`/`drop`/`sort` return a String, `first`/`last` a Char. The List intrinsics they call understand the String representation.

Returns the first character, or `None` when the string is empty.

**Returns**: the first character, or `None`

**Examples**

```kex
"hi".first   # => Just('h')
"".first     # => None
```

_Testing the first character of a string that may be empty_

```kex
"hello".first.map(~upper?).or(false)   # => false
```

### `last`

```kex
last -> Char?
```

Returns the last character, or `None` when the string is empty.

**Returns**: the last character, or `None`

**Examples**

```kex
"hi".last   # => Just('i')
"".last     # => None
```

### `get`

```kex
get(i: Integer) -> Char?
get(i: Integer, default: Char) -> Char
get(i: Range<Integer>) -> String
```

Returns the character at index `i`, counting from 0.

A negative index counts back from the end, so `-1` is the last character. An index past either end returns `None`.

**Parameters**

  - `i` — the 0-based index

**Returns**: the character, or `None` when out of range

**Examples**

```kex
"hi".get(1)    # => Just('i')
"hi".get(9)    # => None
"hi".get(-1)   # => Just('i')
```

### `take`

```kex
take(n: Integer) -> String
```

Returns the first `n` characters, or the whole string when it is shorter than `n`.

**Parameters**

  - `n` — how many characters to keep

**Returns**: the leading `n` characters

**Examples**

```kex
"hello".take(2)    # => "he"
"hello".take(99)   # => "hello"
"hello".take(0)    # => ""
```

_Truncating for display_

```kex
let preview = title.take(30) + (title.count > 30 then "…" else "")
```

### `drop`

```kex
drop(n: Integer) -> String
```

Returns everything after the first `n` characters, so +s.take(n) + s.drop(n)+ is `s`.

**Parameters**

  - `n` — how many characters to skip

**Returns**: the remaining characters

**Examples**

```kex
"hello".drop(2)    # => "llo"
"hello".drop(99)   # => ""
```

_Removing a known prefix_

```kex
let flag = "--verbose"
flag.startsWith?("--") then flag.drop(2) else flag   # => "verbose"
```

### `slice`

```kex
slice(start: Integer, length: Integer) -> String
slice(range: Range<Integer>) -> String
```

Returns the substring of `length` characters starting at index `start`, counting from 0.

Indices count characters, not bytes. Out-of-range values are clamped, as in `take` and `drop`: a start past the end or a negative length returns `""`, and a length running past the end stops there. A negative start counts back from the end, as in Ruby, so `-1` is the last character; a start that is still before the beginning returns `""`.

**Parameters**

  - `start` — the 0-based index of the first character
  - `length` — how many characters to keep

**Returns**: the characters in that window

**Examples**

```kex
"hello".slice(1, 3)    # => "ell"
"hello".slice(1, 99)   # => "ello"
"hello".slice(9, 3)    # => ""
```

_Reading a fixed-width field_

```kex
line.slice(0, 10).trim   # the date column of a log line
```

### `reject`

```kex
reject(pred: (Char -> Bool)) -> String
```

Returns the characters that do not satisfy `pred`, as a `String`.

**Parameters**

  - `pred` — a character is dropped when this returns `true`

**Returns**: the characters that failed the predicate

**Examples**

```kex
"hello".reject { |c| c == 'l' }   # => "heo"
```

_Removing whitespace_

```kex
"1 234 567".reject(~space?)   # => "1234567"
```

### `sort`

```kex
sort -> String
```

Returns the characters in ascending codepoint order.

**Returns**: the sorted characters

**Examples**

```kex
"hello".sort   # => "ehllo"
```

_An anagram check_

```kex
"listen".sort == "silent".sort   # => true
```

### `indexOf`

```kex
indexOf(x: Char) -> Integer?
indexOf(x: String) -> Integer?
```

Returns the index of the first occurrence of `c`, or `None` when the character does not appear.

**Parameters**

  - `c` — the character to look for

**Returns**: the 0-based index, or `None`

**Examples**

```kex
"hello".indexOf('l')   # => Just(2)
"hello".indexOf('z')   # => None
```

_Splitting a +key=value+ pair at the first +=+_

```kex
let pair = "host=localhost"
pair.indexOf('=').map { |i| (pair.take(i), pair.drop(i + 1)) }
# => Just(("host", "localhost"))
```

### `findIndex`

```kex
findIndex(pred: (Char -> Bool)) -> Integer?
```

Returns the index of the first character satisfying `pred`, or `None`. Use `indexOf` to search for a known character.

**Parameters**

  - `pred` — the test applied to each character

**Returns**: the 0-based index, or `None`

**Examples**

```kex
"hello".findIndex { |c| c == 'l' }   # => Just(2)
"hello".findIndex(~digit?)           # => None
```

_Finding where the leading indentation ends_

```kex
"    text".findIndex { |c| !c.space? }   # => Just(4)
```

### `takeWhile`

```kex
takeWhile(pred: (Char -> Bool)) -> String
```

Returns the leading characters that satisfy `pred`, stopping at the first that does not.

**Parameters**

  - `pred` — the test applied to each character

**Returns**: the longest matching prefix

**Examples**

```kex
"123abc".takeWhile(~digit?)   # => "123"
```

### `dropWhile`

```kex
dropWhile(pred: (Char -> Bool)) -> String
```

Drops the leading characters that satisfy `pred` and returns the rest.

**Parameters**

  - `pred` — the test applied to each character

**Returns**: the string from the first character that fails `pred`

**Examples**

```kex
"123abc".dropWhile(~digit?)   # => "abc"
```

### `zip`

```kex
zip(other: [Y]) -> [(Char, Y)]
```

Pairs each character with the element at the same index in `other`, stopping at the shorter of the two.

**Parameters**

  - `other` — the list to pair with

**Returns**: the pairs, in order

**Examples**

```kex
"ab".zip([1, 2])      # => [('a', 1), ('b', 2)]
"abc".zip([1, 2])     # => [('a', 1), ('b', 2)]
```

_Numbering the characters_

```kex
"abc".zip((0..2).items)   # => [('a', 0), ('b', 1), ('c', 2)]
```

### `partition`

```kex
partition(pred: (Char -> Bool)) -> (String, String)
```

Splits the string in two: the characters satisfying `pred`, then those that do not.

**Parameters**

  - `pred` — the test applied to each character

**Returns**: the matching and non-matching characters

**Examples**

```kex
"hello".partition { |c| c == 'l' }   # => ("ll", "heo")
```

_Separating digits from the rest_

```kex
let (digits, other) = "a1b2".partition(~digit?)
digits   # => "12"
other    # => "ab"
```

### `count` (from Foldable)

```kex
count -> Integer
```

Returns the number of characters (codepoints), not bytes. `byteSize` gives the encoded length, and `graphemeCount` the characters a reader sees.

**Returns**: the character count

**Examples**

```kex
"hello".count   # => 5
"".count        # => 0
"é".count       # => 1   (but "é".bytes.count is 2)
```

### `occurrences`

```kex
occurrences(sub: String) -> Integer
```

Returns how many times `sub` occurs, counting non-overlapping matches from the left. An empty `sub` occurs 0 times. Ruby writes this `scan(sub).size`; Kex's `count` with a predicate counts characters.

**Parameters**

  - `sub` — the text to look for

**Returns**: the number of occurrences

**Examples**

```kex
"hello".occurrences("l")     # => 2
"aaaa".occurrences("aa")     # => 2
"hello".occurrences("xyz")   # => 0
```

### `length`

```kex
length -> Integer
```

Returns the number of characters. The same as `count`.

**Returns**: the character count

**Examples**

```kex
"hello".length   # => 5
```

### `graphemeCount`

```kex
graphemeCount -> Integer
```

Returns the number of user-perceived characters, counted as extended grapheme clusters (Unicode UAX #29).

`count` counts codepoints. The two agree for most text, but differ for a letter followed by a combining mark, an emoji made of several codepoints, and `"\r\n"`, which is one cluster of two codepoints. Use `graphemeCount` when the question is how many characters a person sees, for example when sizing text for display.

**Returns**: the grapheme cluster count

**Examples**

```kex
"hello".graphemeCount   # => 5, same as count
"\r\n".graphemeCount    # => 1 ("\r\n".count is 2: a CR codepoint and an LF codepoint)
```

_A base character plus a combining mark_

```kex
let acute = String.fromCodepoint(0x301).or("")     # combining acute accent
let e = "e" + acute
e.count           # => 2 (two codepoints: 'e' and the combining mark)
e.graphemeCount   # => 1 (one character on screen)
```

### `empty?`

```kex
empty? -> Bool
```

Returns `true` when the string has no characters.

A string of spaces is not empty; use `blank?` from `Blankable` when whitespace should not count.

**Returns**: `true` for the empty string

**Examples**

```kex
"".empty?      # => true
"hi".empty?    # => false
"  ".empty?    # => false
```

### `enclose`

```kex
enclose(wrapper: String) -> String
enclose(left: String, right: String) -> String
```

Returns the string with `wrapper` added at both ends.

**Parameters**

  - `wrapper` — placed before and after the string

**Returns**: the wrapped string

**Examples**

```kex
"hello".enclose("*")    # => "*hello*"
"hello".enclose("__")   # => "__hello__"
```

_Quoting a value for output_

```kex
"localhost".enclose("'")   # => "'localhost'"
```

### `at`

```kex
at(i: Integer) -> Char?
```

Returns the character at index `i`, counting from 0, or `None` when the index is out of range. A negative index counts from the end. The same as `get(i)`.

**Parameters**

  - `i` — the 0-based index

**Returns**: the character, or `None`

**Examples**

```kex
"hello".at(1)   # => Just('e')
"hello".at(9)   # => None
```

### `second`

```kex
second -> Char?
```

Returns the second character, or `None` when the string is shorter than two characters.

**Returns**: the second character, or `None`

**Examples**

```kex
"hi".second   # => Just('i')
"h".second    # => None
```

### `third`

```kex
third -> Char?
```

Returns the third character, or `None` when the string is shorter than three characters.

**Returns**: the third character, or `None`

**Examples**

```kex
"hip".third   # => Just('p')
"hi".third    # => None
```

### `rest`

```kex
rest -> String
```

Returns everything after the first character, or `""` for the empty string.

**Returns**: the string without its first character

**Examples**

```kex
"hello".rest   # => "ello"
"h".rest       # => ""
```

### `chars`

```kex
chars -> [Char]
```

Returns the string's characters as a list.

Use it to reach `List` functions that `String` lacks, and `join("")` to get back to a string.

**Returns**: the characters, in order

**Examples**

```kex
"hi".chars   # => ['h', 'i']
```

_Going out to List and back_

```kex
"hello".chars.reverse.join("")   # => "olleh"
```

### `bytes`

```kex
bytes -> [Byte]
```

Returns the string's UTF-8 encoding, one `Byte` per byte.

`chars` and `bytes` differ outside ASCII: `"é"` is one `Char` and two bytes. Use `bytes` when the encoded form matters, as in a network frame or a size limit. `String.fromBytes` is the inverse.

**Returns**: the UTF-8 bytes

**Examples**

```kex
"hi".bytes    # => [104, 105]
"é".bytes     # => [195, 169]
"é".chars     # => ['é']
```

_Measuring the encoded size_

```kex
"héllo".count         # => 5
"héllo".bytes.count   # => 6
```

### `byteSize`

```kex
byteSize -> Integer
```

Returns the length of the string's UTF-8 encoding in bytes.

It gives the same number as `bytes.count` without building a list of every byte, which matters for large payloads.

**Returns**: the length of the UTF-8 encoding

**Examples**

_Text length and storage length differ_

```kex
"héllo".count      # => 5
"héllo".byteSize   # => 6
```

### `byteAt`

```kex
byteAt(index: Integer) -> Byte?
```

Returns the byte at a UTF-8 offset, or `None` when the offset is out of range.

The offset indexes the encoding, so inside a multi-byte character it returns one of that character's bytes. Use `at` to index characters.

**Parameters**

  - `index` — a zero-based byte offset

**Returns**: the byte, or `None` past the end

**Examples**

_The two views of the same string_

```kex
"héllo".byteAt(1)   # => Just(195)
"héllo".at(1)       # => Just('é')
"héllo".byteAt(99)  # => None
```

### `bytePart`

```kex
bytePart(offset: Integer, count: Integer) -> String
```

Returns the bytes from `offset` to +offset + count+ of the UTF-8 encoding, as a `String`.

Out-of-range values are clamped, as in `take` and `drop`. Cutting inside a character leaves partial UTF-8 in the result, so slice only at offsets you know are character boundaries.

**Parameters**

  - `offset` — a zero-based byte offset, clamped to the string
  - `count` — how many bytes, clamped to what remains

**Returns**: the bytes in that range

**Examples**

_Reading a length-prefixed field out of a payload_

```kex
payload.bytePart(4, payload.byteSize - 4)
```

### `split`

```kex
split -> [String]
```

Splits the string into its individual characters, as one-character strings.

Use `chars` to get `Char` values.

**Returns**: one string per character

**Examples**

```kex
"hi".split   # => ["h", "i"]
```

```kex
split(sep: String | Regex) -> [String]
```

Splits the string on every occurrence of `sep`, which may be a literal string or a `Regex`.

Separators at the ends produce empty parts, so splitting `",a,"` on `","` gives three parts.

**Parameters**

  - `sep` — the separator to split on

**Returns**: the parts, in order

**Examples**

_Splitting a delimited line_

```kex
"a,b,c".split(",")     # => ["a", "b", "c"]
"a, b, c".split(", ")  # => ["a", "b", "c"]
```

_Splitting on a pattern (needs +using Regex+)_

```kex
"a1b22c".split(re`[0-9]+`)   # => ["a", "b", "c"]
```

_Empty parts at the edges are kept_

```kex
",a,".split(",")   # => ["", "a", ""]
```

### `lines`

```kex
lines -> [String]
```

Splits the string into lines on `\n`.

A single trailing newline is dropped, so a file that ends in one gives no final empty line. A Windows `\r\n` counts as one line ending, so no line keeps a stray `\r`. `FS.File.readLines`, `FileHandle.getLine` and file feeds split lines the same way.

**Returns**: the lines, without their newlines

**Examples**

```kex
"a\nb".lines       # => ["a", "b"]
"a\nb\n".lines     # => ["a", "b"]
"a\r\nb".lines     # => ["a", "b"]
"".lines           # => []
```

_Numbering the lines of a file_

```kex
text.lines.zip((1..text.lines.count).items).each do |pair|
  let (line, n) = pair
  IO.printLine("${n}: ${line}")
end
```

### `indentRest`

```kex
indentRest(prefix: String) -> String
```

Indents every line but the first by `prefix`.

Use it to splice a multi-line value into an indented `${...}` hole, where the text before the hole already indents the first line. Blank lines stay blank, and a single trailing newline is dropped, as `lines` does.

**Parameters**

  - `prefix` — the indentation to add

**Returns**: the re-indented string

**Examples**

```kex
"a\nb\n".indentRest("  ")   # => "a\n  b"
"a".indentRest("  ")        # => "a"
```

_Splicing a block into a template_

```kex
let body = "one\ntwo"
"items:\n  ${body.indentRest("  ")}"
# => "items:\n  one\n  two"
```

### `replace`

```kex
replace(pattern: String, replacement: String) -> String
```

Replaces every literal occurrence of `pattern` with `replacement`.

The pattern is matched literally, not as a regular expression. An empty pattern matches at every character boundary, including both ends.

**Parameters**

  - `pattern` — the text to look for
  - `replacement` — what to put in its place

**Returns**: the rewritten string

**Examples**

```kex
"a-b-c".replace("-", "+")   # => "a+b+c"
"abc".replace("", "-")      # => "-a-b-c-"
```

_Normalising a path separator_

```kex
"a\\b\\c".replace("\\", "/")   # => "a/b/c"
```

### `replaceFirst`

```kex
replaceFirst(pattern: String, replacement: String) -> String
```

Replaces only the first literal occurrence of `pattern`. Ruby calls this `sub`, and `replace` is its `gsub`.

**Parameters**

  - `pattern` — the text to look for
  - `replacement` — what to put in its place

**Returns**: the string with its first match replaced, or unchanged when there is none

**Examples**

```kex
"a-b-c".replaceFirst("-", "+")   # => "a+b-c"
"abc".replaceFirst("x", "y")     # => "abc"
```

### `substitute`

```kex
substitute(replacements: {String: String}) -> String
```

Replaces every occurrence of each key of `replacements` with its value.

Keys are matched literally, with no placeholder syntax, so `$NAME$`, `__NAME__` and `{{name}}` all work. `$NAME$` is the usual convention. A placeholder cannot be written `${name}` in a string literal, because that is interpolation and is filled in before `substitute` runs.

Substitutions run in the map's key order, each on the result of the last, so a later key can rewrite text that an earlier value put in.

**Parameters**

  - `replacements` — placeholder to replacement text

**Returns**: the filled-in template

**Examples**

```kex
"Hello, $WHO$!".substitute({"$WHO$": "world"})           # => "Hello, world!"
"$A$ and $B$".substitute({"$A$": "x", "$B$": "y"})       # => "x and y"
"__A__".substitute({"__A__": "any key works"})           # => "any key works"
```

_A reusable template_

```kex
let greeting = "Dear $NAME$,\n\nYour order $ID$ has shipped."
greeting.substitute({"$NAME$": "Ada", "$ID$": "A-1701"})
```

### `trim`

```kex
trim -> String
```

Removes leading and trailing whitespace, leaving whitespace inside the string alone.

**Returns**: the trimmed string

**Examples**

```kex
"  hello  ".trim     # => "hello"
"\n hi \t".trim      # => "hi"
"a  b".trim          # => "a  b"
```

_Cleaning up user input_

```kex
let name = IO.getLine.or("").trim
```

### `trimStart`

```kex
trimStart -> String
```

Removes leading whitespace only. Ruby calls this `lstrip`.

**Returns**: the string without its leading whitespace

**Examples**

```kex
"  hi  ".trimStart   # => "hi  "
```

### `trimEnd`

```kex
trimEnd -> String
```

Removes trailing whitespace only. Ruby calls this `rstrip`.

**Returns**: the string without its trailing whitespace

**Examples**

```kex
"  hi  ".trimEnd   # => "  hi"
```

_Dropping a line ending, CRLF included_

```kex
line.trimEnd
```

### `removePrefix`

```kex
removePrefix(prefix: String) -> String
```

Removes `prefix` from the start of the string if it is there. Ruby calls this `delete_prefix`.

**Parameters**

  - `prefix` — the text to remove

**Returns**: the string without the prefix

**Examples**

```kex
"v1.2.0".removePrefix("v")   # => "1.2.0"
"1.2.0".removePrefix("v")    # => "1.2.0"
```

### `removeSuffix`

```kex
removeSuffix(suffix: String) -> String
```

Removes `suffix` from the end of the string if it is there. Ruby calls this `delete_suffix`.

**Parameters**

  - `suffix` — the text to remove

**Returns**: the string without the suffix

**Examples**

```kex
"notes.txt".removeSuffix(".txt")   # => "notes"
```

### `padLeft`

```kex
padLeft(width: Integer) -> String
padLeft(width: Integer, pad: String) -> String
```

Pads the string on the left with spaces until it is `width` characters long. A string already that long is returned unchanged. Ruby calls this `rjust`.

**Parameters**

  - `width` — the length to reach

**Returns**: the padded string

**Examples**

```kex
"7".padLeft(3)   # => "  7"
```

### `padRight`

```kex
padRight(width: Integer) -> String
padRight(width: Integer, pad: String) -> String
```

Pads the string on the right with spaces until it is `width` characters long. Ruby calls this `ljust`.

**Parameters**

  - `width` — the length to reach

**Returns**: the padded string

**Examples**

```kex
"ab".padRight(4) + "|"   # => "ab  |"
```

### `center`

```kex
center(width: Integer) -> String
center(width: Integer, pad: String) -> String
```

Centers the string in a field of `width` characters, padding both sides with spaces. When the padding cannot split evenly, the extra character goes on the right, as Ruby's `center` does.

**Parameters**

  - `width` — the length to reach

**Returns**: the centered string

**Examples**

```kex
"ab".center(6)   # => "  ab  "
"ab".center(5)   # => " ab  "
```

### `upperCase`

```kex
upperCase -> String
```

Returns the string with every character converted to upper case.

**Returns**: the upper-cased string

**Examples**

```kex
"hello".upperCase       # => "HELLO"
"Hello, ada".upperCase  # => "HELLO, ADA"
```

_Case-insensitive comparison_

```kex
input.lowerCase == "yes"
```

### `lowerCase`

```kex
lowerCase -> String
```

Returns the string with every character converted to lower case.

**Returns**: the lower-cased string

**Examples**

```kex
"HELLO".lowerCase   # => "hello"
```

_Normalising a lookup key_

```kex
settings.get(key.trim.lowerCase)
```

### `capitalize`

```kex
capitalize -> String
```

Returns the string with its first character upper-cased and the rest LOWER-cased.

As in Ruby, `"hELLO"` becomes `"Hello"`. It is handy in a `compiled do` block for turning a lower-case word into the upper-case name that `type %name` requires.

**Returns**: the capitalized string

**Examples**

```kex
"hello".capitalize           # => "Hello"
"hELLO".capitalize           # => "Hello"   (tail is lower-cased)
"already Capital".capitalize # => "Already capital"
"".capitalize                # => ""
```

_Title-casing a sentence_

```kex
"the quick brown fox".split(" ").map(~capitalize).join(" ")
# => "The Quick Brown Fox"
```

### `snakeCase`

```kex
snakeCase -> String
```

Returns the identifier in `snake_case`: its words lower-cased and joined with underscores.

Words are separated by `_`, `-` and spaces, and by case: a capital after a lower-case letter or digit starts a word (`userId`), and so does the last capital of a run followed by a lower-case letter (`HTTPServer` is `HTTP`, `Server`). Anything else stays in its word, so `empty?` keeps its `?`.

**Returns**: the snake-cased identifier

**Examples**

```kex
"userId".snakeCase       # => "user_id"
"HTTPServer".snakeCase   # => "http_server"
"show-nickname".snakeCase   # => "show_nickname"
```

### `kebabCase`

```kex
kebabCase -> String
```

Returns the identifier in `kebab-case`: its words lower-cased and joined with hyphens. Words are found as `snakeCase` finds them.

**Returns**: the kebab-cased identifier

**Examples**

```kex
"userId".kebabCase      # => "user-id"
"show_nickname".kebabCase   # => "show-nickname"
```

### `camelCase`

```kex
camelCase -> String
```

Returns the identifier in `camelCase`: its first word lower-cased and the rest capitalized, with nothing between them. Words are found as `snakeCase` finds them.

**Returns**: the camel-cased identifier

**Examples**

```kex
"show_nickname".camelCase   # => "showNickname"
"HTTP server".camelCase     # => "httpServer"
```

### `pascalCase`

```kex
pascalCase -> String
```

Returns the identifier in `PascalCase`: every word capitalized, with nothing between them. Words are found as `snakeCase` finds them.

**Returns**: the Pascal-cased identifier

**Examples**

```kex
"show_nickname".pascalCase   # => "ShowNickname"
"user-id".pascalCase         # => "UserId"
```

### `filler`

```kex
filler(pad: String, width: Integer) -> String
```

`pad` repeated and cut to exactly `width` characters: the filler the padding functions put beside the string. Nothing for a width of 0 or less, or for an empty `pad`.

### `identifierWords`

```kex
identifierWords(chars: [Char], previous: Char?, current: String, words: [String]) -> [String]
```

The words of an identifier, read one character at a time: `previous` is the character before `chars`, `current` the word being read. `words` is kept newest first, since on BEAM `[w | words]` is cheap and `words + [w]` copies them all, and is reversed once at the end.

### `reverse`

```kex
reverse -> String
```

Returns the string with its characters in reverse order.

**Returns**: the reversed string

**Examples**

```kex
"hello".reverse   # => "olleh"
```

_A palindrome check_

```kex
let cleaned = "A man, a plan, a canal: Panama".filter(~alpha?).lowerCase
cleaned == cleaned.reverse   # => true
```

### `contains?`

```kex
contains?(sub: String) -> Bool
```

Returns `true` when `sub` appears anywhere in the string.

The search is literal and case-sensitive. Lower-case both sides to ignore case, or use `Regex` to search for a pattern.

**Parameters**

  - `sub` — the text to look for

**Returns**: `true` when it is present

**Examples**

```kex
"hello world".contains?("world")   # => true
"hello world".contains?("xyz")     # => false
"hello world".contains?("World")   # => false
```

_Ignoring case_

```kex
"Hello".lowerCase.contains?("hello")   # => true
```

### `startsWith?`

```kex
startsWith?(prefix: String) -> Bool
```

Returns `true` when the string begins with `prefix`.

**Parameters**

  - `prefix` — the expected opening text

**Returns**: `true` when the string starts with it

**Examples**

```kex
"hello".startsWith?("hel")   # => true
"hello".startsWith?("llo")   # => false
```

_Recognising a command-line flag_

```kex
args.filter { |a| a.startsWith?("--") }
```

### `endsWith?`

```kex
endsWith?(suffix: String) -> Bool
```

Returns `true` when the string ends with `suffix`.

**Parameters**

  - `suffix` — the expected closing text

**Returns**: `true` when the string ends with it

**Examples**

```kex
"hello".endsWith?("llo")   # => true
"hello".endsWith?("hel")   # => false
```

_Selecting files by extension_

```kex
paths.filter { |p| p.endsWith?(".kex") }
```

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Comparable`](comparable.md#trait-comparable)

  - [`max`](comparable.md#comparable-max) — Returns the larger of this value and `other`, or this value when they are equal.
  - [`min`](comparable.md#comparable-min) — Returns the smaller of this value and `other`, or this value when they are equal.
  - [`clamp`](comparable.md#comparable-clamp) — Returns this value limited to `low`..`high`: `low` when it is below, `high` when it is above, and the value itself otherwise.
  - [`<`](comparable.md#comparable-op-lt) — Returns `true` when this value orders before `other`.
  - [`>`](comparable.md#comparable-op-gt) — Returns `true` when this value orders after `other`.
  - [`<=`](comparable.md#comparable-op-lt-eq) — Returns `true` when this value orders before `other` or equal to it.
  - [`>=`](comparable.md#comparable-op-gt-eq) — Returns `true` when this value orders after `other` or equal to it.

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`map`](enumerable.md#enumerable-map) — Applies `f` to each item and returns the results as a list.
  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Applies `f` to each item and its 0-based position, and returns the results as a list.
  - [`into`](enumerable.md#enumerable-into) — Applies `f`, which returns a list, to each item and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Applies `f`, which returns an `Optional`, to each item and returns the present values, unwrapped.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Calls `f` with each item and its 0-based position, for its side effects.
  - [`all?`](enumerable.md#foldable-all?) — Returns `true` when every item satisfies `pred`, and `true` for an empty collection.
  - [`any?`](enumerable.md#foldable-any?) — Returns `true` when at least one item satisfies `pred`, and `false` for an empty collection.
  - [`none?`](enumerable.md#foldable-none?) — Returns `true` when no item satisfies `pred`, the opposite of `any?`.
  - [`one?`](enumerable.md#foldable-one?) — Returns `true` when exactly one item satisfies `pred`.
  - [`find`](enumerable.md#foldable-find) — Returns the first item satisfying `pred`, or `None` when nothing does.

### Defined in other modules

  - [Algebra](algebra.md#make-string): [`identity`](algebra.md#string-identity), [`combine`](algebra.md#string-combine)
  - [Blankable](blankable.md#make-string): [`blank?`](blankable.md#string-blank?)
  - [Comparable](comparable.md#make-string): [`compare`](comparable.md#string-compare)
  - [Truthyable](truthyable.md#make-string): [`truthy?`](truthyable.md#string-truthy?)

## type `Char`

Implements [`Discrete`](range.md#trait-discrete).

A single Unicode character.

Character literals use single quotes (`'a'`), and `'a'` is a different type from the one-character string `"a"`. The predicates `digit?`, `alpha?`, `space?` and the rest classify a character; `codepoint` and `String.fromCodepoint` convert to and from Unicode values.

```kex
"hello world".chars.count(~alpha?)   # => 10
'a'.upperCase                        # => 'A'
'a'.string                           # => "a"
```

### `string`

```kex
string -> String
```

Returns this character as a one-character `String`.

`to(String)` also works but returns `String?`, like every `to` conversion; `string` cannot fail, so it returns the `String` directly.

**Returns**: the character as text

**Examples**

```kex
'a'.string                 # => "a"
'a'.to(String)             # => Just("a")
"hi".chars.map(&.string)   # => ["h", "i"]
```

### `upperCase`

```kex
upperCase -> Char
```

Returns the upper-case form of this character, still as a `Char`.

Characters with no upper-case form (digits, punctuation) are returned unchanged.

**Returns**: the upper-case character

**Examples**

```kex
'a'.upperCase   # => 'A'
'1'.upperCase   # => '1'
```

### `lowerCase`

```kex
lowerCase -> Char
```

Returns the lower-case form of this character, still as a `Char`.

Characters with no lower-case form are returned unchanged.

**Returns**: the lower-case character

**Examples**

```kex
'A'.lowerCase   # => 'a'
'!'.lowerCase   # => '!'
```

### `digit?`

```kex
digit? -> Bool
```

Returns `true` when the character is a decimal digit, `'0'` through `'9'`.

**Returns**: `true` for a decimal digit

**Examples**

```kex
'3'.digit?   # => true
'a'.digit?   # => false
```

_Validating that a field is all digits_

```kex
"12345".chars.all?(~digit?)   # => true
```

### `alpha?`

```kex
alpha? -> Bool
```

Returns `true` when the character is a Unicode letter.

**Returns**: `true` for a letter

**Examples**

```kex
'a'.alpha?   # => true
'1'.alpha?   # => false
' '.alpha?   # => false
```

_Keeping only letters_

```kex
"Hello, World!".filter(~alpha?)   # => "HelloWorld"
```

### `letter?`

```kex
letter? -> Bool
```

Returns `true` when the character is a Unicode letter. The same as `alpha?`.

**Returns**: `true` for a letter

**Examples**

```kex
'z'.letter?   # => true
'-'.letter?   # => false
```

### `upper?`

```kex
upper? -> Bool
```

Returns `true` when the character is upper case.

Characters without case, such as digits and punctuation, return `false`.

**Returns**: `true` for an upper-case letter

**Examples**

```kex
'A'.upper?   # => true
'a'.upper?   # => false
'1'.upper?   # => false
```

_Finding the first capital_

```kex
"camelCaseName".findIndex(~upper?)   # => Just(5)
```

### `lower?`

```kex
lower? -> Bool
```

Returns `true` when the character is lower case.

**Returns**: `true` for a lower-case letter

**Examples**

```kex
'a'.lower?   # => true
'A'.lower?   # => false
```

### `space?`

```kex
space? -> Bool
```

Returns `true` when the character is Unicode whitespace, such as a space, tab, newline or no-break space.

**Returns**: `true` for whitespace

**Examples**

```kex
' '.space?    # => true
'\t'.space?   # => true
'a'.space?    # => false
```

_Counting the spaces on a line_

```kex
"one two  three".chars.count(~space?)   # => 3
```

### `codepoint`

```kex
codepoint -> Integer
```

Returns the character's Unicode codepoint.

`String.fromCodepoint` is the inverse.

**Returns**: the codepoint

**Examples**

```kex
'A'.codepoint   # => 65
'é'.codepoint   # => 233
```

_Converting a digit character to its value_

```kex
'7'.codepoint - '0'.codepoint   # => 7
```

### `in?`

```kex
in?(range: Range<Char>) -> Bool
```

Returns `true` when the character falls inside `range`, endpoints included.

**Parameters**

  - `range` — the inclusive character range

**Returns**: `true` when the character is in range

**Examples**

```kex
'b'.in?('a'..'z')   # => true
'B'.in?('a'..'z')   # => false
```

_A hexadecimal-digit test_

```kex
let hex?(c: Char) -> Bool = c.digit? || c.lowerCase.in?('a'..'f')
```



## module `String`

Builds `String` values from a Unicode codepoint or from UTF-8 bytes.

### `fromCodepoint`

```kex
fromCodepoint(value: Integer) -> String?
```

Builds a one-character string from a Unicode codepoint.

Returns `None` for a surrogate or a value outside the Unicode range. `Char.codepoint` is the inverse.

**Parameters**

  - `value` — the Unicode codepoint

**Returns**: the one-character string, or `None`

**Examples**

```kex
String.fromCodepoint(65)       # => Just("A")
String.fromCodepoint(233)      # => Just("é")
String.fromCodepoint(-1)       # => None
```

_Building the alphabet_

```kex
(0..25).items.map { |i| String.fromCodepoint(97 + i).or("") }.join("")
# => "abcdefghijklmnopqrstuvwxyz"
```

### `fromBytes`

```kex
fromBytes(values: [Byte]) -> String?
```

Rebuilds a string from its UTF-8 bytes: the inverse of `bytes`.

Returns `None` for a value outside 0..255 or for malformed UTF-8; invalid bytes are never turned into replacement characters.

**Parameters**

  - `values` — the UTF-8 bytes

**Returns**: the decoded string, or `None`

**Examples**

```kex
String.fromBytes([104, 105])   # => Just("hi")
String.fromBytes([195, 169])   # => Just("é")
String.fromBytes([255])        # => None
```

_A round trip_

```kex
String.fromBytes("héllo".bytes)   # => Just("héllo")
```

## type `Tuple`

A fixed-size group of values, written `(a, b)`. A tuple's size and the type of each position are part of its type, and `List` functions do not apply to it: destructure it, match on it, or convert it with `items`.

```kex
let (name, age) = ("Ada", 36)
[1, 2, 3].partition { |n| n.even? }   # => ([2], [1, 3])
```

### `items`

```kex
items -> [Any]
```

Returns the tuple's elements as a list.

The list is typed `[Any]`, so the type of each position is lost. When you know the shape, destructuring (`let (a, b) = pair`) is usually clearer.

**Returns**: the elements, in order

**Examples**

```kex
(1, "a").items   # => [1, "a"]
```

_Iterating over a pair_

```kex
("host", "port").items.each { |s| IO.printLine(s) }
```


