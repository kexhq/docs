---
package: prelude
version: "0.4.0-alpha"
source: string.kex
title: String
entities:
  - { kind: make, name: "String" }
  - { kind: make, name: "Char" }
  - { kind: module, name: "String" }
  - { kind: make, name: "Tuple" }
---

# String

## make `String` implements [Enumerable](enumerable.md#trait-enumerable), [Foldable](enumerable.md#trait-foldable)

Text. A `String` is a sequence of Unicode characters, immutable like every other Kex value: every method here answers with a new string rather than changing the receiver.

A `String` is its own type, not a list of characters. It is `Enumerable`, so `each`, `reduce`, `find` and friends walk it one `Char` at a time, and the sequence operations that could reasonably answer in either currency pick the useful one: `take`, `drop` and `sort` hand back a `String`, while `first` and `last` hand back a `Char`. Use `chars` to cross over to a real list.

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


#### `reduce`

Folds the string from the left, one `Char` at a time.

This is `String`'s `Enumerable` primitive: `map`, `filter`, `find`, `any?` and the rest are defined in terms of it. Reach for it directly when you are accumulating something that is neither a string nor a list.

```kex
reduce(acc, f) : A -> (A -> Char -> A) -> A
```

**Returns**: `A` — the final accumulator

**Examples**

_Summing digit values_

```kex
"12345".reduce(0) { |sum, c| sum ` c.codepoint - 48 }   # => 15
```
_Building a character histogram_

```kex
"banana".reduce({}) do |counts, c|
  counts.put(c.string, counts.get(c.string).or(0) ` 1)
end
# => {"a": 3, "b": 1, "n": 2}
```

#### `mapChars`

Applies `f` to every character and joins the results back into a `String`.

This is the string-preserving counterpart of `map`. `map` comes from `Enumerable` and collects into a list, because its type says `(Char -> B) -> [B]` and `B` need not be a `Char` at all. When you want a string out, name the operation that produces one.

```kex
mapChars(f) : (Char -> Char) -> String
```

**Returns**: `String` — the mapped characters, as a string

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

#### `filter`

Returns the characters satisfying `pred`, as a `String`.

```kex
filter(pred) : (Char -> Bool) -> String
```

**Returns**: `String` — the matching characters, in order

**Examples**

_Keeping only the digits_

```kex
"a1b2c3".filter(~digit?)   # => "123"
```
_Stripping punctuation before comparing_

```kex
"Hello, World!".filter(~alpha?).lowerCase   # => "helloworld"
```

#### `get`

Returns the character at index `i`, counting from 0.

Answers `None` for an index past either end rather than failing, so it is safe to index with a computed position.

```kex
get(i) : Integer -> Char?
get(i) : Integer -> Char -> Char
```

**Returns**: `Char?` — the character, or `None` when out of range

**Examples**

```kex
"hi".get(1)    # => Just('i')
"hi".get(9)    # => None
```

#### `take`

Returns the first `n` characters. A short string is returned whole, so `take` never fails on an `n` that is too large.

```kex
take(n) : Integer -> String
```

**Returns**: `String` — the leading `n` characters

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

#### `drop`

Returns everything after the first `n` characters. The complement of `take`: `s.take(n) ` s.drop(n)` is `s+.

```kex
drop(n) : Integer -> String
```

**Returns**: `String` — the remaining characters

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

#### `reject`

Returns the characters that do NOT satisfy `pred`: the complement of `filter`.

```kex
reject(pred) : (Char -> Bool) -> String
```

**Returns**: `String` — the characters that failed the predicate

**Examples**

```kex
"hello".reject { |c| c == 'l' }   # => "heo"
```
_Removing whitespace_

```kex
"1 234 567".reject(~space?)   # => "1234567"
```

#### `indexOf`

Returns the index of the first occurrence of `c`, or `None` when the character does not appear.

```kex
indexOf(c) : Char -> Integer?
```

**Returns**: `Integer?` — the 0-based index, or `None`

**Examples**

```kex
"hello".indexOf('l')   # => Just(2)
"hello".indexOf('z')   # => None
```
_Splitting a `key=value` pair at the first `=`_

```kex
let pair = "host=localhost"
pair.indexOf('=').map { |i| (pair.take(i), pair.drop(i + 1)) }
# => Just(("host", "localhost"))
```

#### `findIndex`

Returns the index of the first character satisfying `pred`, or `None`.

The predicate counterpart of `indexOf`, which searches for one known character.

```kex
findIndex(pred) : (Char -> Bool) -> Integer?
```

**Returns**: `Integer?` — the 0-based index, or `None`

**Examples**

```kex
"hello".findIndex { |c| c == 'l' }   # => Just(2)
"hello".findIndex(~digit?)           # => None
```
_Finding where the leading indentation ends_

```kex
"    text".findIndex { |c| !c.space? }   # => Just(4)
```

#### `zip`

Pairs each character with the element at the same index in `other`, stopping at the shorter of the two.

```kex
zip(other) : [Y] -> [(Char, Y)]
```

**Returns**: `[(Char, Y)]` — the pairs, in order

**Examples**

```kex
"ab".zip([1, 2])      # => [('a', 1), ('b', 2)]
"abc".zip([1, 2])     # => [('a', 1), ('b', 2)]
```
_Numbering the characters_

```kex
"abc".zip((0..2).items)   # => [('a', 0), ('b', 1), ('c', 2)]
```

#### `partition`

Splits the string in two: the characters satisfying `pred`, then those that do not. One pass, both answers.

```kex
partition(pred) : (Char -> Bool) -> (String, String)
```

**Returns**: `(String, String)` — the matching and non-matching characters

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

#### `enclose`

Returns the string with `wrapper` added at both ends.

```kex
enclose(wrapper) : String -> String
enclose(wrapper) : String -> String -> String
```

**Returns**: `String` — the wrapped string

**Examples**

```kex
"hello".enclose("*")    # => "*hello*"
"hello".enclose("__")   # => "__hello__"
```
_Quoting a value for output_

```kex
value.enclose("\"")   # => "\"localhost\""
```

#### `at`

Returns the character at index `i`, counting from 0, or `None` when the index is out of range. The same as the one-argument `get`.

```kex
at(i) : Integer -> Char?
```

**Returns**: `Char?` — the character, or `None`

**Examples**

```kex
"hello".at(1)   # => Just('e')
"hello".at(9)   # => None
```

#### `byteAt`

One byte of the storage view, or `None` when the index is out of range.

This indexes the ENCODING, not the text: `byteAt` on a multi-byte character returns one of its bytes, never the character. Use `at` or `chars` for the text view.

```kex
byteAt(index) : Integer -> Byte?
```

**Returns**: `Byte?` — the byte, or `None` past the end

**Examples**

_The two views of the same string_

```kex
"héllo".byteAt(1)   # => Just(195)
"héllo".at(1)       # => Just("é")
"héllo".byteAt(99)  # => None
```

#### `bytePart`

A slice of the storage view, by byte offset and byte count.

The range is clamped rather than refused, the way `take` and `drop` already behave. Slicing mid-character yields a string holding partial UTF-8 — legal storage, but not text: decode it only at a boundary you know is a character boundary.

```kex
bytePart(offset, count) : Integer -> Integer -> String
```

**Returns**: `String` — the bytes in that range

**Examples**

_Reading a length-prefixed field out of a payload_

```kex
payload.bytePart(4, payload.byteSize - 4)
```

#### `split`

Splits the string on every occurrence of `sep`, which may be a literal string or a `Regex`.

Separators at the ends produce empty parts, so splitting `",a,"` on `","` gives three parts. Filter or trim afterwards when that is not wanted.

```kex
split(sep) : String | Regex -> [String]
split : [String]
```

**Returns**: `[String]` — the parts, in order

**Examples**

_Splitting a delimited line_

```kex
"a,b,c".split(",")     # => ["a", "b", "c"]
"a, b, c".split(", ")  # => ["a", "b", "c"]
```
_Splitting on a pattern (needs `using Regex`)_

```kex
"a1b22c".split(re`[0-9]+`)   # => ["a", "b", "c"]
```
_Empty parts at the edges are kept_

```kex
",a,".split(",")   # => ["", "a", ""]
```

#### `indentRest`

Indents every line but the first by `prefix`.

This is what splicing a multi-line value into an indented `${...}` hole needs: the hole's own indentation already covers line one, and the rest have to catch up. Blank lines stay blank, and (through `lines`) a single trailing newline is dropped, so a block does not push a stray empty line into its slot.

```kex
indentRest(prefix) : String -> String
```

**Returns**: `String` — the re-indented string

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

#### `replace`

Replaces every literal occurrence of `pattern` with `replacement`.

The pattern is matched literally, not as a regular expression. An empty pattern matches at every character boundary, including both ends.

```kex
replace(pattern, replacement) : String -> String -> String
```

**Returns**: `String` — the rewritten string

**Examples**

```kex
"a-b-c".replace("-", "`")   # => "a`b+c"
"abc".replace("", "-")      # => "-a-b-c-"
```
_Normalising a path separator_

```kex
"a\\b\\c".replace("\\", "/")   # => "a/b/c"
```

#### `substitute`

Replaces every key of `replacements` with its value, in one pass over the map.

The keys are the placeholders exactly as written: no syntax is imposed and nothing is reserved, so `$NAME$`, `__NAME__`, `{{name}}` and `%name%` are all equally valid, and a template needs no escaping to be a template. `$NAME$` is the convention to reach for when there is no reason to prefer another.

Note that a placeholder is NOT `${name}`: that is interpolation, which the compiler resolves before this ever sees the string.

This is what a template wants instead of a chain of `replace` calls: the chain reads as a pipeline when it is really a substitution table, and it quietly depends on its own order, since an earlier replacement's OUTPUT is still visible to every later one.

Substitutions are applied in the map's canonical key order and each is applied to the result of the last, so a value that itself contains a key can still be rewritten by a later one. Keep values placeholder-free when that matters.

```kex
substitute(replacements) : {String: String} -> String
```

**Returns**: `String` — the filled-in template

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

#### `contains?`

Returns `true` when `sub` appears anywhere in the string.

The search is literal and case-sensitive. Lower-case both sides to ignore case; use `Regex` when the needle is a pattern.

```kex
contains?(sub) : String -> Bool
```

**Returns**: `Bool` — `true` when it is present

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

#### `startsWith?`

Returns `true` when the string begins with `prefix`.

```kex
startsWith?(prefix) : String -> Bool
```

**Returns**: `Bool` — `true` when the string starts with it

**Examples**

```kex
"hello".startsWith?("hel")   # => true
"hello".startsWith?("llo")   # => false
```
_Recognising a command-line flag_

```kex
args.filter { |a| a.startsWith?("--") }
```

#### `endsWith?`

Returns `true` when the string ends with `suffix`.

```kex
endsWith?(suffix) : String -> Bool
```

**Returns**: `Bool` — `true` when the string ends with it

**Examples**

```kex
"hello".endsWith?("llo")   # => true
"hello".endsWith?("hel")   # => false
```
_Selecting files by extension_

```kex
paths.filter { |p| p.endsWith?(".kex") }
```

## make `Char`

A single Unicode character.

Character literals are written with single quotes (`'a'`) and are a different type from the one-character string `"a"`. The classification methods (`digit?`, `alpha?`, `space?` and the rest) are what most character code needs; `codepoint` and `String.fromCodepoint` are the escape hatch to raw Unicode values.

```kex
"hello world".chars.count(~alpha?)   # => 10
'a'.upperCase                        # => 'A'
'a'.string                           # => "a"
```


#### `in?`

Returns `true` when the character falls inside `range`, endpoints included.

```kex
in?(range) : Range<Char> -> Bool
```

**Returns**: `Bool` — `true` when the character is in range

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

Constructors for `String` values that are built from something other than text: a Unicode codepoint, or raw UTF-8 bytes.

## function `fromCodepoint`

Builds a one-character string from a Unicode codepoint.

Answers `None` for a surrogate or a value outside the Unicode scalar range, so the result is always valid text. `Char.codepoint` is the inverse.


```kex
fromCodepoint(value) : Integer -> String?
```


## function `fromBytes`

Rebuilds a string from its UTF-8 bytes: the inverse of `bytes`.

A `String` is TEXT, so bytes outside 0..255 or a malformed encoding answer `None` rather than a string that would decode to replacement characters. That makes it a decoding step you can check, not a lossy cast.


```kex
fromBytes(values) : [Byte] -> String?
```


## make `Tuple`

A fixed-size group of values, written `(a, b)`. Unlike a list, a tuple's size and the type of each position are part of its type, so the `List` methods do not apply to it: destructure it, match on it, or convert it with `items`.

```kex
let (name, age) = ("Ada", 36)
[1, 2, 3].partition { |n| n.even? }   # => ([2], [1, 3])
```


