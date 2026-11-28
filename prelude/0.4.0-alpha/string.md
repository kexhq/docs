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

## type `String`

Implements [`Monoid`](algebra.md#trait-monoid), [`Blankable`](blankable.md#trait-blankable), [`Enumerable`](enumerable.md#trait-enumerable), [`Foldable`](enumerable.md#trait-foldable), [`Truthyable`](truthyable.md#trait-truthyable).

### `reduce` (from Enumerable, Foldable)

```kex
reduce(acc: A, f: (A -> Char -> A)) -> A
```

Enumerable primitive and string-preserving higher-order operations. The private List intrinsics understand String's [Char] representation; the public methods remain owned here in Kex source.

### `mapChars`

```kex
mapChars(f: (Char -> Char)) -> String
```

No `map` override: the Enumerable default collects into a list, which is what `(Char -> B) -> [B]` says. A String-in/String-out mapping is a different operation with a different type, so it gets its own name.

**Examples**

```kex
"hi".mapChars(&.upperCase)   # => "HI"
"hi".map(&.upperCase)        # => ['H', 'I']  (a list, per Enumerable)
```

### `filter` (from Enumerable)

```kex
filter(pred: (Char -> Bool)) -> String
```

### `uniq`

```kex
uniq : String
```

### `first`

```kex
first : Char?
```

A String is its OWN type, not a [Char] — `chars` converts between them. So the sequence operations below are declared here rather than inherited from List, and they answer in String's terms: `take`/`drop`/`sort` hand back a String, while `first`/`last` hand back a Char. The List intrinsics they delegate to already understand the String representation, so there is one implementation for both backends.

Returns the first character, or None when the string is empty.

**Examples**

```kex
"hi".first   # => Just('h')
"".first     # => None
```

### `last`

```kex
last : Char?
```

Returns the last character, or None when the string is empty.

**Examples**

```kex
"hi".last   # => Just('i')
```

### `get`

```kex
get(i: Integer) -> Char?
get(i: Integer, default: Char) -> Char
```

Returns the character at `i`, or None when out of range.

**Examples**

```kex
"hi".get(1)   # => 'i'
```

### `take`

```kex
take(n: Integer) -> String
```

Returns the first `n` characters.

**Examples**

```kex
"hello".take(2)   # => "he"
```

### `drop`

```kex
drop(n: Integer) -> String
```

Returns everything after the first `n` characters.

**Examples**

```kex
"hello".drop(2)   # => "llo"
```

### `reject`

```kex
reject(pred: (Char -> Bool)) -> String
```

Returns the characters that do NOT satisfy the predicate — filter's complement.

**Examples**

```kex
"hello".reject { |c| c == 'l' }   # => "heo"
```

### `sort`

```kex
sort : String
```

Returns the characters in ascending order.

**Examples**

```kex
"hello".sort   # => "ehllo"
```

### `indexOf`

```kex
indexOf(c: Char) -> Integer?
```

Returns the index of the first occurrence of `c`, or None.

**Examples**

```kex
"hello".indexOf('l')   # => 2
```

### `findIndex`

```kex
findIndex(pred: (Char -> Bool)) -> Integer?
```

Returns the index of the first character satisfying the predicate, or None. Goes through `chars` because there is no direct intrinsic.

**Examples**

```kex
"hello".findIndex { |c| c == 'l' }   # => 2
```

### `zip`

```kex
zip(other: [Y]) -> [(Char, Y)]
```

Pairs each character with the element at the same index in `other`, stopping at the shorter of the two.

**Examples**

```kex
"ab".zip([1, 2])   # => [('a', 1), ('b', 2)]
```

### `partition`

```kex
partition(pred: (Char -> Bool)) -> (String, String)
```

Splits into the characters that satisfy the predicate and those that do not, in that order.

**Examples**

```kex
"hello".partition { |c| c == 'l' }   # => ("ll", "heo")
```

### `count` (from Foldable)

```kex
count : Integer
```

Returns the number of characters in the string.

**Examples**

```kex
"hello".count   # => 5
"".count        # => 0
```

### `length`

```kex
length : Integer
```

Compatibility spelling retained as a source-owned String method.

### `empty?`

```kex
empty? : Bool
```

Returns `true` if the string contains no characters.

**Examples**

```kex
"".empty?       # => true
"hi".empty?     # => false
```

### `enclose`

```kex
enclose(wrapper: String) -> String
enclose(left: String, right: String) -> String
```

Returns an enclosed string, with `wrapper` on both ends.

**Parameters**

  - `wrapper` — String

**Returns**: String

**Examples**

```kex
"hello".enclose("*")   # => "*hello*"
"hello".enclose("__")   # => "__hello__"
```

### `at`

```kex
at(i: Integer) -> Char?
```

Returns the character at position `i` (0-based), or `None` if out of range.

**Examples**

```kex
"hello".at(1)   # => Just('e')
"hello".at(9)   # => None
```

### `second`

```kex
second : Char?
```

Returns the second character wrapped in `Just`, or `None` when absent.

### `third`

```kex
third : Char?
```

Returns the third character wrapped in `Just`, or `None` when absent.

### `rest`

```kex
rest : String
```

Returns all characters after the first.

### `chars`

```kex
chars : [Char]
```

Returns a list of the individual characters in the string.

**Examples**

```kex
"hi".chars   # => ['h', 'i']
```

### `bytes`

```kex
bytes : [Byte]
```

Returns the string's UTF-8 encoding, one Byte per byte.

`chars` is the TEXT view of a String and `bytes` is the STORAGE view, so they differ for anything outside ASCII: "é" is one Char and two Bytes.

**Examples**

```kex
"hi".bytes    # => [104, 105]
"é".bytes     # => [195, 169]
"é".chars     # => ['é']
```

### `split`

```kex
split : [String]
```

Splits on every occurrence of `sep`. With no argument, splits into individual characters.

Separator-less: one part per character, as the example above shows. Only the intrinsic had this form, so the walker answered `"hi".split` with "'this' used outside of a method context" while BEAM returned the parts. Declared BEFORE the separator form, as `sort` is in list.kex: the walker resolves a no-argument call against the first clause of that name.

**Examples**

```kex
"a,b,c".split(",")   # => ["a", "b", "c"]
"hi".split           # => ["h", "i"]
```

```kex
split(sep: String | Regex) -> [String]
split : [String]
```

### `lines`

```kex
lines : [String]
```

Splits into lines on `\n`, dropping a single trailing newline so a file ending in one does not yield a final empty line. Windows line endings are not stripped — split on `\r\n` explicitly if that matters.

**Examples**

```kex
"a\nb".lines      # => ["a", "b"]
"a\nb\n".lines    # => ["a", "b"]
"".lines          # => []
```

### `indentRest`

```kex
indentRest(prefix: String) -> String
```

Indents every line but the first by `prefix`. That is what splicing a multi-line value into an indented `${...}` hole needs: the hole's own indentation already covers line one, the rest have to catch up. Blank lines stay blank, and — through `lines` — one trailing newline is dropped, so a block does not push a stray empty line into its slot.

**Examples**

```kex
"a\nb\n".indentRest("  ")   # => "a\n  b"
"a".indentRest("  ")        # => "a"
```

### `replace`

```kex
replace(pattern: String, replacement: String) -> String
```

Replaces every literal occurrence of `pattern`. An empty pattern matches at every character boundary, including both ends.

**Examples**

```kex
"a-b-c".replace("-", "+")   # => "a+b+c"
"abc".replace("", "-")      # => "-a-b-c-"
```

### `substitute`

```kex
substitute(replacements: {String: String}) -> String
```

Replaces every key of `replacements` with its value, in one pass over the map. The keys are the placeholders exactly as written — no syntax is imposed, and nothing is reserved — so `$NAME$`, `__NAME__`, `{{name}}` and `%name%` are all equally valid, and a template needs no escaping to be a template. `$NAME$` is the convention to reach for when there is no reason to prefer another.

Note that a placeholder is NOT `${name}`: that is interpolation, which the compiler resolves before this ever sees the string.

This is what a template wants instead of a chain of `.replace` calls: the chain reads as a pipeline when it is really a substitution table, and it quietly depends on its own order, since an earlier replacement's OUTPUT is still visible to every later one.

Substitutions are applied in the map's canonical key order and each is applied to the result of the last, so a value that itself contains a key can still be rewritten by a later one. Keep values placeholder-free when that matters.

**Examples**

```kex
"Hello, $WHO$!".substitute({"$WHO$": "world"})           # => "Hello, world!"
"$A$ and $B$".substitute({"$A$": "x", "$B$": "y"})       # => "x and y"
"__A__".substitute({"__A__": "any key works"})           # => "any key works"
```

### `trim`

```kex
trim : String
```

Removes leading and trailing whitespace.

**Examples**

```kex
"  hello  ".trim   # => "hello"
```

### `upperCase`

```kex
upperCase : String
```

Returns the string with all characters converted to upper case.

**Examples**

```kex
"hello".upperCase   # => "HELLO"
```

### `lowerCase`

```kex
lowerCase : String
```

Returns the string with all characters converted to lower case.

**Examples**

```kex
"HELLO".lowerCase   # => "hello"
```

### `capitalize`

```kex
capitalize : String
```

Returns the string with its first character upper-cased and the rest LOWER-cased, matching Ruby's String#capitalize — so "hELLO" becomes "Hello", not "HELLO". Unlike `upperCase`, which shouts the whole string.

Needed to build type names from data: a generated `type %name = ...` inside a `compiled do` block requires an upper-case identifier, so a list of lower-case words has to be capitalized first.

**Examples**

```kex
"hello".capitalize          # => "Hello"
"hELLO".capitalize          # => "Hello"   (tail is lower-cased)
"already Capital".capitalize # => "Already capital"
"".capitalize               # => ""
```

### `reverse`

```kex
reverse : String
```

Returns the string with its characters in reverse order.

**Examples**

```kex
"hello".reverse   # => "olleh"
```

### `contains?`

```kex
contains?(sub: String) -> Bool
```

Returns `true` if `sub` appears anywhere within the string.

**Examples**

```kex
"hello world".contains?("world")   # => true
"hello world".contains?("xyz")     # => false
```

### `startsWith?`

```kex
startsWith?(prefix: String) -> Bool
```

Returns `true` if the string begins with `prefix`.

**Examples**

```kex
"hello".startsWith?("hel")   # => true
"hello".startsWith?("llo")   # => false
```

### `endsWith?`

```kex
endsWith?(suffix: String) -> Bool
```

Returns `true` if the string ends with `suffix`.

**Examples**

```kex
"hello".endsWith?("llo")   # => true
"hello".endsWith?("hel")   # => false
```

### From [`Monoid`](algebra.md#trait-monoid)

  - [`repeat`](algebra.md#monoid-repeat) — Combines this value with itself `n` times.

### From [`Enumerable`](enumerable.md#trait-enumerable)

  - [`map`](enumerable.md#enumerable-map) — Transforms each item by applying `f`, collecting the results into a list.
  - [`mapIndexed`](enumerable.md#enumerable-mapindexed) — Transforms each item together with its 0-based position, collecting the results into a list.
  - [`flatMap`](enumerable.md#enumerable-flatmap) — Maps each item to a list and concatenates the results.
  - [`collect`](enumerable.md#enumerable-collect) — Maps each item through `f` (returning an `Optional`), keeping and unwrapping the `Just(y)` results and dropping `None`.

### From [`Foldable`](enumerable.md#trait-foldable)

  - [`each`](enumerable.md#foldable-each) — Applies `f` to each item for its side effects.
  - [`eachIndexed`](enumerable.md#foldable-eachindexed) — Applies `f` to each item together with its 0-based position, for side effects.
  - [`all?`](enumerable.md#foldable-all?) — True if every item satisfies `pred`.
  - [`any?`](enumerable.md#foldable-any?) — True if at least one item satisfies `pred`.
  - [`find`](enumerable.md#foldable-find) — The first item satisfying `pred` wrapped in Just, or None.

### Defined in other modules

  - [Algebra](algebra.md#make-string): [`identity`](algebra.md#string-identity), [`combine`](algebra.md#string-combine)
  - [Blankable](blankable.md#make-string): [`blank?`](blankable.md#string-blank?)
  - [Truthyable](truthyable.md#make-string): [`truthy?`](truthyable.md#string-truthy?)

## type `Char`

### `string`

```kex
string : String
```

A Char and a String are distinct types, so converting between them is explicit. `to(String)` is the fallible protocol and answers `String?` like every other conversion; `string` is the total one, because a character is always one character of text and has no failure case to report. It is the single-character counterpart of `String.chars` and `[Char].join("")`.

```kex
'a'.string                      # => "a"
'a'.to(String)                  # => Just("a")
"hi".chars.map(&.string)        # => ["h", "i"]
```

### `upperCase`

```kex
upperCase : Char
```

Converts this character to upper/lower case while preserving Char.

### `lowerCase`

```kex
lowerCase : Char
```

### `digit?`

```kex
digit? : Bool
```

Returns `true` if the character is a decimal digit (`0`..`9`).

**Examples**

```kex
'3'.digit?   # => true
'a'.digit?   # => false
```

### `alpha?`

```kex
alpha? : Bool
```

### `letter?`

```kex
letter? : Bool
```

### `upper?`

```kex
upper? : Bool
```

### `lower?`

```kex
lower? : Bool
```

### `space?`

```kex
space? : Bool
```

### `codepoint`

```kex
codepoint : Integer
```

Returns this character's numeric codepoint.

### `in?`

```kex
in?(range: Range<Char>) -> Bool
```

Returns `true` if the character falls within the given range (inclusive).

**Examples**

```kex
'b'.in?('a'..'z')   # => true
'B'.in?('a'..'z')   # => false
```



## module `String`

### `fromCodepoint`

```kex
fromCodepoint(value: Integer) -> String?
```

Constructs a one-codepoint UTF-8 string. Surrogates and values outside the Unicode scalar range return None.

### `fromBytes`

```kex
fromBytes(values: [Byte]) -> String?
```

Rebuilds a String from its UTF-8 bytes — the inverse of `bytes`. A String is TEXT, so bytes outside 0..255 or a malformed encoding return None rather than a string that would decode to replacement characters.

```kex
String.fromBytes([104, 105])    # => Just("hi")
String.fromBytes([195, 169])    # => Just("é")
String.fromBytes([255])         # => None
```

## type `Tuple`

### `items`

```kex
items : [Any]
```

Returns the tuple's elements as a list.

A tuple is not a list — its arity is part of its type — so the List methods do not apply to it. This is the explicit conversion.

**Examples**

```kex
(1, "a").items   # => [1, "a"]
```


