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


#### `reduce`

Enumerable primitive and string-preserving higher-order operations. The private List intrinsics understand String's [Char] representation; the public methods remain owned here in Kex source.

```kex
reduce(acc, f) : A -> (A -> Char -> A) -> A
```

#### `mapChars`

No `map` override: the Enumerable default collects into a list, which is what `(Char -> B) -> [B]` says. A String-in/String-out mapping is a different operation with a different type, so it gets its own name.

```kex
mapChars(f) : (Char -> Char) -> String
```

**Returns**: `String`

**Examples**

```kex
  "hi".mapChars(&.upperCase)   # => "HI"
  "hi".map(&.upperCase)        # => ['H', 'I']  (a list, per Enumerable)
```

#### `filter`

```kex
filter(pred) : (Char -> Bool) -> String
```

#### `get`

Returns the character at `i`, or None when out of range.

```kex
get(i) : Integer -> Char?
get(i) : Integer -> Char -> Char
```

**Returns**: `Char?`

**Examples**

```kex
  "hi".get(1)   # => 'i'
```

#### `take`

Returns the first `n` characters.

```kex
take(n) : Integer -> String
```

**Returns**: `String`

**Examples**

```kex
  "hello".take(2)   # => "he"
```

#### `drop`

Returns everything after the first `n` characters.

```kex
drop(n) : Integer -> String
```

**Returns**: `String`

**Examples**

```kex
  "hello".drop(2)   # => "llo"
```

#### `reject`

Returns the characters that do NOT satisfy the predicate — filter's complement.

```kex
reject(pred) : (Char -> Bool) -> String
```

**Returns**: `String`

**Examples**

```kex
  "hello".reject { |c| c == 'l' }   # => "heo"
```

#### `indexOf`

Returns the index of the first occurrence of `c`, or None.

```kex
indexOf(c) : Char -> Integer?
```

**Returns**: `Integer?`

**Examples**

```kex
  "hello".indexOf('l')   # => 2
```

#### `findIndex`

Returns the index of the first character satisfying the predicate, or None. Goes through `chars` because there is no direct intrinsic.

```kex
findIndex(pred) : (Char -> Bool) -> Integer?
```

**Returns**: `Integer?`

**Examples**

```kex
  "hello".findIndex { |c| c == 'l' }   # => 2
```

#### `zip`

Pairs each character with the element at the same index in `other`, stopping at the shorter of the two.

```kex
zip(other) : [Y] -> [(Char, Y)]
```

**Returns**: `[(Char, Y)]`

**Examples**

```kex
  "ab".zip([1, 2])   # => [('a', 1), ('b', 2)]
```

#### `partition`

Splits into the characters that satisfy the predicate and those that do not, in that order.

```kex
partition(pred) : (Char -> Bool) -> (String, String)
```

**Returns**: `(String, String)`

**Examples**

```kex
  "hello".partition { |c| c == 'l' }   # => ("ll", "heo")
```

#### `enclose`

Returns an enclosed string, with `wrapper` on both ends.

```kex
enclose(wrapper) : String -> String
enclose(wrapper) : String -> String -> String
```

**Returns**: String

**Examples**

```kex
  "hello".enclose("*")   # => "*hello*"
  "hello".enclose("__")   # => "__hello__"
```

#### `at`

Returns the character at position `i` (0-based), or `None` if out of range.

```kex
at(i) : Integer -> Char?
```

**Returns**: `Char?`

**Examples**

```kex
  "hello".at(1)   # => Just('e')
  "hello".at(9)   # => None
```

#### `indentRest`

Indents every line but the first by `prefix`. That is what splicing a multi-line value into an indented `${...}` hole needs: the hole's own indentation already covers line one, the rest have to catch up. Blank lines stay blank, and — through `lines` — one trailing newline is dropped, so a block does not push a stray empty line into its slot.

```kex
indentRest(prefix) : String -> String
```

**Returns**: `String`

**Examples**

```kex
  "a\nb\n".indentRest("  ")   # => "a\n  b"
  "a".indentRest("  ")        # => "a"
```

#### `replace`

Replaces every literal occurrence of `pattern`. An empty pattern matches at every character boundary, including both ends.

```kex
replace(pattern, replacement) : String -> String -> String
```

**Returns**: `String`

**Examples**

```kex
  "a-b-c".replace("-", "`")   # => "a`b+c"
  "abc".replace("", "-")      # => "-a-b-c-"
```

#### `substitute`

Replaces every key of `replacements` with its value, in one pass over the map. The keys are the placeholders exactly as written — no syntax is imposed, and nothing is reserved — so `$NAME$`, `__NAME__`, `{{name}}` and `%name%` are all equally valid, and a template needs no escaping to be a template. `$NAME$` is the convention to reach for when there is no reason to prefer another.

Note that a placeholder is NOT `${name}`: that is interpolation, which the compiler resolves before this ever sees the string.

This is what a template wants instead of a chain of `.replace` calls: the chain reads as a pipeline when it is really a substitution table, and it quietly depends on its own order, since an earlier replacement's OUTPUT is still visible to every later one.

Substitutions are applied in the map's canonical key order and each is applied to the result of the last, so a value that itself contains a key can still be rewritten by a later one. Keep values placeholder-free when that matters.

```kex
substitute(replacements) : {String: String} -> String
```

**Returns**: `String`

**Examples**

```kex
  "Hello, $WHO$!".substitute({"$WHO$": "world"})           # => "Hello, world!"
  "$A$ and $B$".substitute({"$A$": "x", "$B$": "y"})       # => "x and y"
  "__A__".substitute({"__A__": "any key works"})           # => "any key works"
```

#### `contains?`

Returns `true` if `sub` appears anywhere within the string.

```kex
contains?(sub) : String -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  "hello world".contains?("world")   # => true
  "hello world".contains?("xyz")     # => false
```

#### `startsWith?`

Returns `true` if the string begins with `prefix`.

```kex
startsWith?(prefix) : String -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  "hello".startsWith?("hel")   # => true
  "hello".startsWith?("llo")   # => false
```

#### `endsWith?`

Returns `true` if the string ends with `suffix`.

```kex
endsWith?(suffix) : String -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  "hello".endsWith?("llo")   # => true
  "hello".endsWith?("hel")   # => false
```

## make `Char`


#### `in?`

Returns `true` if the character falls within the given range (inclusive).

```kex
in?(range) : Range<Char> -> Bool
```

**Returns**: `Bool`

**Examples**

```kex
  'b'.in?('a'..'z')   # => true
  'B'.in?('a'..'z')   # => false
```

## module `String`

## function `fromCodepoint`

Constructs a one-codepoint UTF-8 string. Surrogates and values outside the Unicode scalar range return None.


```kex
fromCodepoint(value) : Integer -> String?
```


## function `fromBytes`

Rebuilds a String from its UTF-8 bytes — the inverse of `bytes`. A String is TEXT, so bytes outside 0..255 or a malformed encoding return None rather than a string that would decode to replacement characters.

  String.fromBytes([104, 105])    # => Just("hi")   String.fromBytes([195, 169])    # => Just("é")   String.fromBytes([255])         # => None


```kex
fromBytes(values) : [Byte] -> String?
```


## make `Tuple`


