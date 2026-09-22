---
package: prelude
version: "0.4.0-beta.4-dev"
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
"12345".reduce(0) { |sum, c| sum + c.codepoint - 48 }   # => 15
```
_Building a character histogram_

```kex
"banana".reduce({}) do |counts, c|
  counts.put(c.string, counts.get(c.string).or(0) + 1)
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

#### `uniq`

Returns the string with repeated characters removed, keeping the first occurrence of each.

```kex
uniq : String
```

**Returns**: `String` — the distinct characters, in first-seen order

**Examples**

```kex
"banana".uniq   # => "ban"
"hello".uniq    # => "helo"
```

#### `first`

A String is its OWN type, not a [Char]: `chars` converts between them. So the sequence operations below are declared here rather than inherited from List, and they answer in String's terms: `take`/`drop`/`sort` hand back a String, while `first`/`last` hand back a Char. The List intrinsics they delegate to already understand the String representation, so there is one implementation for both backends.

Returns the first character, or `None` when the string is empty.

```kex
first : Char?
```

**Returns**: `Char?` — the first character, or `None`

**Examples**

```kex
"hi".first   # => Just('h')
"".first     # => None
```
_Testing an initial without risking an empty string_

```kex
"hello".first.map(~upper?).or(false)   # => false
```

#### `last`

Returns the last character, or `None` when the string is empty.

```kex
last : Char?
```

**Returns**: `Char?` — the last character, or `None`

**Examples**

```kex
"hi".last   # => Just('i')
"".last     # => None
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

Returns everything after the first `n` characters. The complement of `take`: +s.take(n) + s.drop(n)+ is `s`.

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

#### `sort`

Returns the characters in ascending codepoint order.

```kex
sort : String
```

**Returns**: `String` — the sorted characters

**Examples**

```kex
"hello".sort   # => "ehllo"
```
_An anagram check_

```kex
"listen".sort == "silent".sort   # => true
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
_Splitting a +key=value+ pair at the first +=+_

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

#### `count`

Returns the number of characters: characters, not bytes. See `bytes` for the storage-level length.

```kex
count : Integer
```

**Returns**: `Integer` — the character count

**Examples**

```kex
"hello".count   # => 5
"".count        # => 0
"é".count       # => 1   (but "é".bytes.count is 2)
```

#### `length`

Returns the number of characters. The same as `count`, under the name familiar from other languages.

```kex
length : Integer
```

**Returns**: `Integer` — the character count

**Examples**

```kex
"hello".length   # => 5
```

#### `graphemeCount`

Returns the number of user-perceived characters: extended grapheme clusters (Unicode UAX #29), which is not always `count`.

`count` answers the codepoint count, and most text is one codepoint per grapheme cluster, so the two usually agree. They part ways for a base character combined with a following mark, an emoji built from more than one codepoint, and `"\r\n"`, which is one grapheme cluster over two codepoints: reach for `graphemeCount` over `count` wherever "how many characters does a person see" is the question, such as sizing text for display or truncating it at a boundary a reader would recognize.

```kex
graphemeCount : Integer
```

**Returns**: `Integer` — the grapheme cluster count

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

#### `empty?`

Returns `true` when the string has no characters.

Note that a string of spaces is not empty: use `blank?` from the `Blankable` trait when whitespace should not count.

```kex
empty? : Bool
```

**Returns**: `Bool` — `true` for the empty string

**Examples**

```kex
"".empty?      # => true
"hi".empty?    # => false
"  ".empty?    # => false
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

#### `second`

Returns the second character, or `None` when the string is shorter than two characters.

```kex
second : Char?
```

**Returns**: `Char?` — the second character, or `None`

**Examples**

```kex
"hi".second   # => Just('i')
"h".second    # => None
```

#### `third`

Returns the third character, or `None` when the string is shorter than three characters.

```kex
third : Char?
```

**Returns**: `Char?` — the third character, or `None`

**Examples**

```kex
"hip".third   # => Just('p')
"hi".third    # => None
```

#### `rest`

Returns everything after the first character. The empty string has no rest, and answers with itself.

```kex
rest : String
```

**Returns**: `String` — the string without its first character

**Examples**

```kex
"hello".rest   # => "ello"
"h".rest       # => ""
```

#### `chars`

Returns the string's characters as a list.

The bridge from `String` to the `List` methods that a string does not have of its own. Join back with `.join("")`.

```kex
chars : [Char]
```

**Returns**: `[Char]` — the characters, in order

**Examples**

```kex
"hi".chars   # => ['h', 'i']
```
_Going out to List and back_

```kex
"hello".chars.reverse.join("")   # => "olleh"
```

#### `bytes`

Returns the string's UTF-8 encoding, one `Byte` per byte.

`chars` is the TEXT view of a string and `bytes` is the STORAGE view, so they differ for anything outside ASCII: `"é"` is one `Char` and two +Byte+s. Use `bytes` when the length that matters is the encoded one: a network frame, a file offset, a size limit.

`String.fromBytes` is the inverse.

```kex
bytes : [Byte]
```

**Returns**: `[Byte]` — the UTF-8 bytes

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

#### `byteSize`

The storage size in bytes, without building the byte list.

`bytes.count` answers the same number by materialising every byte first, which on a megabyte payload means a million values to count them. This reads the encoded length directly.

```kex
byteSize : Integer
```

**Returns**: `Integer` — the length of the UTF-8 encoding

**Examples**

_Text length and storage length differ_

```kex
"héllo".count      # => 5
"héllo".byteSize   # => 6
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

Splits the string into its individual characters, as one-character strings.

Use `chars` instead when you want `Char` values rather than strings.

Separator-less: one part per character, as the example above shows. Only the intrinsic had this form, so the walker answered `"hi".split` with "'this' used outside of a method context" while BEAM returned the parts. Declared BEFORE the separator form, as `sort` is in list.kex: the walker resolves a no-argument call against the first clause of that name.

```kex
split : [String]
```

**Returns**: `[String]` — one string per character

**Examples**

```kex
"hi".split   # => ["h", "i"]
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

#### `lines`

Splits the string into lines on `\n`.

A single trailing newline is dropped, so a file that ends in one does not produce a final empty line. Windows line endings are not stripped: split on `\r\n` explicitly, or `trim` each line, when that matters.

```kex
lines : [String]
```

**Returns**: `[String]` — the lines, without their newlines

**Examples**

```kex
"a\nb".lines      # => ["a", "b"]
"a\nb\n".lines    # => ["a", "b"]
"".lines          # => []
```
_Numbering the lines of a file_

```kex
text.lines.zip((1..text.lines.count).items).each do |pair|
  let (line, n) = pair
  IO.printLine("${n}: ${line}")
end
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
"a-b-c".replace("-", "+")   # => "a+b+c"
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

#### `trim`

Removes leading and trailing whitespace. Whitespace inside the string is left alone.

```kex
trim : String
```

**Returns**: `String` — the trimmed string

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

#### `upperCase`

Returns the string with every character converted to upper case.

```kex
upperCase : String
```

**Returns**: `String` — the upper-cased string

**Examples**

```kex
"hello".upperCase       # => "HELLO"
"Hello, ada".upperCase  # => "HELLO, ADA"
```
_Case-insensitive comparison_

```kex
input.lowerCase == "yes"
```

#### `lowerCase`

Returns the string with every character converted to lower case.

```kex
lowerCase : String
```

**Returns**: `String` — the lower-cased string

**Examples**

```kex
"HELLO".lowerCase   # => "hello"
```
_Normalising a lookup key_

```kex
settings.get(key.trim.lowerCase)
```

#### `capitalize`

Returns the string with its first character upper-cased and the rest LOWER-cased.

This matches Ruby's `String#capitalize`, so `"hELLO"` becomes `"Hello"`, not `"HELLO"`. Use `upperCase` when the whole string should shout.

It is also what building a type name from data needs: a generated `type %name = ...` inside a `compiled do` block requires an upper-case identifier, so a list of lower-case words has to be capitalized first.

```kex
capitalize : String
```

**Returns**: `String` — the capitalized string

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

#### `reverse`

Returns the string with its characters in reverse order.

```kex
reverse : String
```

**Returns**: `String` — the reversed string

**Examples**

```kex
"hello".reverse   # => "olleh"
```
_A palindrome check_

```kex
let cleaned = "A man, a plan, a canal: Panama".filter(~alpha?).lowerCase
cleaned == cleaned.reverse   # => true
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


#### `string`

Returns this character as a one-character `String`.

A `Char` and a `String` are distinct types, so converting between them is explicit. `to(String)` is the fallible conversion protocol and answers `String?` like every other conversion; `string` is the total one, because a character is always one character of text and has no failure case to report. It is the single-character counterpart of `String.chars` and `[Char].join("")`.

```kex
string : String
```

**Returns**: `String` — the character as text

**Examples**

```kex
'a'.string                 # => "a"
'a'.to(String)             # => Just("a")
"hi".chars.map(&.string)   # => ["h", "i"]
```

#### `upperCase`

Returns the upper-case form of this character, still as a `Char`.

Characters with no upper-case form (digits, punctuation) are returned unchanged.

```kex
upperCase : Char
```

**Returns**: `Char` — the upper-case character

**Examples**

```kex
'a'.upperCase   # => 'A'
'1'.upperCase   # => '1'
```

#### `lowerCase`

Returns the lower-case form of this character, still as a `Char`.

Characters with no lower-case form are returned unchanged.

```kex
lowerCase : Char
```

**Returns**: `Char` — the lower-case character

**Examples**

```kex
'A'.lowerCase   # => 'a'
'!'.lowerCase   # => '!'
```

#### `digit?`

Returns `true` when the character is a decimal digit, `'0'` through `'9'`.

```kex
digit? : Bool
```

**Returns**: `Bool` — `true` for a decimal digit

**Examples**

```kex
'3'.digit?   # => true
'a'.digit?   # => false
```
_Validating that a field is all digits_

```kex
"12345".chars.all?(~digit?)   # => true
```

#### `alpha?`

Returns `true` when the character is alphabetic.

```kex
alpha? : Bool
```

**Returns**: `Bool` — `true` for a letter

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

#### `letter?`

Returns `true` when the character is a letter. The Unicode-letter spelling of `alpha?`.

```kex
letter? : Bool
```

**Returns**: `Bool` — `true` for a letter

**Examples**

```kex
'z'.letter?   # => true
'-'.letter?   # => false
```

#### `upper?`

Returns `true` when the character is upper case.

Characters without case (digits, punctuation) answer `false`.

```kex
upper? : Bool
```

**Returns**: `Bool` — `true` for an upper-case letter

**Examples**

```kex
'A'.upper?   # => true
'a'.upper?   # => false
'1'.upper?   # => false
```
_Splitting a camelCase name_

```kex
"camelCaseName".findIndex(~upper?)   # => Just(5)
```

#### `lower?`

Returns `true` when the character is lower case.

```kex
lower? : Bool
```

**Returns**: `Bool` — `true` for a lower-case letter

**Examples**

```kex
'a'.lower?   # => true
'A'.lower?   # => false
```

#### `space?`

Returns `true` when the character is whitespace: a space, tab, newline or carriage return.

```kex
space? : Bool
```

**Returns**: `Bool` — `true` for whitespace

**Examples**

```kex
' '.space?    # => true
'\t'.space?   # => true
'a'.space?    # => false
```
_Counting the words on a line_

```kex
"one two  three".split(" ").reject(~empty?).count   # => 3
```

#### `codepoint`

Returns the character's Unicode codepoint.

`String.fromCodepoint` is the inverse.

```kex
codepoint : Integer
```

**Returns**: `Integer` — the codepoint

**Examples**

```kex
'A'.codepoint   # => 65
'é'.codepoint   # => 233
```
_Converting a digit character to its value_

```kex
'7'.codepoint - '0'.codepoint   # => 7
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


#### `items`

Returns the tuple's elements as a list.

A tuple is not a list (its arity is part of its type) so the `List` methods do not apply to it. This is the explicit conversion, and it loses the per-position typing in exchange.

Destructuring is usually clearer when you know the shape: `let (a, b) = pair`.

```kex
items : [Any]
```

**Returns**: `[Any]` — the elements, in order

**Examples**

```kex
(1, "a").items   # => [1, "a"]
```
_Iterating over a pair_

```kex
("host", "port").items.each { |s| IO.printLine(s) }
```
