---
package: prelude
version: "0.4.0-rc.3-dev"
source: culture.kex
title: Culture
entities:
  - { kind: module, name: "Culture" }
---

# Culture

## module `Culture`

Explicit cultures for parsing and printing numbers: decimal separators, digit grouping and group sizes, plus date/time layout data.

A culture is always passed explicitly — parsing and printing never consult the ambient locale, so the same call answers the same everywhere. Defaults stay dot-only; reach for a culture exactly when the text follows human conventions instead of literal syntax:

```kex
using Culture
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Float.parse("1,44", culture: hu)   # => Ok(1.44)
Float.parse("1,44")                 # => Error(...)
```

### `DEFAULT` (constant)

```kex
DEFAULT : Culture
```

The technical default: dot decimals, no grouping, no time section. This is what no-culture parsing accepts, so `parse(s)` and `parse(s, culture: Culture.DEFAULT)` always agree. Reach for it when the text is machine-written: protocols, data files, logs.



### `of`

```kex
of(code: String) -> Culture?
```

Answers the culture registered under `code`, or `None` for an unknown tag. This is the only way to reach a preset: there are no per-culture constants.

The code is normalized before lookup — upper-cased with `-` read as `_` — so `"hu-HU"` and `"HU_HU"` find the same culture.

**Parameters**

  - `code` — the ISO tag, such as `"HU_HU"`

**Returns**: the culture, or `None`

**Examples**

```kex
Culture.of("HU_HU").or(Culture.DEFAULT).name   # => "HU_HU"
Culture.of("hu-HU").or(Culture.DEFAULT).name   # => "HU_HU"
Culture.of("XX_YY")                            # => None
```

### `valid?`

```kex
valid?(culture: Culture) -> Bool
```

Answers `true` when the culture's number settings are usable: grouped cultures need a group separator that differs from the decimal separator and a non-empty list of positive group sizes.

Parsing and printing check this for you — an invalid culture fails loudly at use — so call `valid?` only to fail earlier with your own message.

**Parameters**

  - `culture` — the culture to check

**Returns**: `true` when the number settings are usable

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.valid?(hu)              # => true
```

### `validateInteger`

```kex
validateInteger(text: String, culture: Culture) -> Result<String, ParseError>
```

Validates `text` as an integer in `culture`, answering the normalized dot-form text a strict parse delegates to.

The grammar is strict: an optional sign, digits with validated grouping, nothing else. Group separators must match the culture and land on group boundaries; anything else fails at its exact position with `value: None`.

This is plumbing shared by the typed parses — most callers want `Integer.parse(s, culture:)` instead.

**Parameters**

  - `text` — the text to validate
  - `culture` — the culture to validate against

**Returns**: the normalized text, or the failure

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.validateInteger("1 500", hu)              # => Ok("1500")
```

### `validateFloat`

```kex
validateFloat(text: String, culture: Culture) -> Result<String, ParseError>
```

Validates `text` as a float in `culture`, answering the normalized dot-form text a strict parse delegates to.

The grammar is strict: an optional sign, grouped integer digits, an optional decimal separator with required fraction digits, and an optional exponent. The decimal separator and exponent marker follow the culture only in shape — the normalized text always uses `.` and `e`.

This is plumbing shared by the typed parses — most callers want `Float.parse(s, culture:)` instead.

**Parameters**

  - `text` — the text to validate
  - `culture` — the culture to validate against

**Returns**: the normalized text, or the failure

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.validateFloat("1,44", hu)              # => Ok("1.44")
```

### `renderNumber`

```kex
renderNumber(text: String, culture: Culture) -> String?
```

Renders plain dot-form `text` with the culture's separators: the decimal separator is substituted and digit groups are inserted per the culture's group sizes. An exponent, if any, passes through unchanged. Answers `None` for an invalid culture (see `valid?`).

This is plumbing shared by the typed prints — most callers want `(1500.5).to(String, culture: culture)` instead.

**Parameters**

  - `text` — the dot-form text to render
  - `culture` — the culture to render with

**Returns**: the rendered text, or `None` for an invalid culture

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.renderNumber("1500.5", hu)              # => Just("1\u{A0}500,5")
```

### `local`

```kex
local : Culture
```

Answers the machine's culture as an ordinary value: numbers follow the `LC_ALL`, `LC_NUMERIC` or `LANG` environment variable, falling back to `DEFAULT` when none names a known culture.

The query is explicit and `foul` — ambient locale never leaks into parsing or printing on its own. Bind the answer once and pass it like any other culture:

```kex
let culture = Culture.local
Float.parse(input, culture: culture)
```

**Returns**: the machine's culture, or `DEFAULT`

## record `NumberSettings`

Number settings: which character marks the decimal point and how digit groups are separated and sized.

**Fields**

  - `decimalSeparator` : [Char](string.md#make-char) (optional)
  - `groups` : ([Char](string.md#make-char), [[Integer](number.md#make-integer)])? (optional)



## record `TimeSettings`

Date and time layout data. Carried by every preset; no behavior reads it yet — culture-aware time parsing and printing is a later slice.

**Fields**

  - `dateOrder` : [[Atom](atom.md#make-atom)]
  - `dateSeparator` : [Char](string.md#make-char)
  - `timeSeparator` : [Char](string.md#make-char)



## record `Culture`

A culture: named settings for parsing and printing.

The value carries its own settings — `parse` and `to` read them from the culture they are handed, never from globals or by-name lookup. Assemble one from a preset, from `of`, from `local`, or literally; fields you omit take neutral defaults, so a numbers-only custom culture never mentions time.

**Fields**

  - `name` : [String](string.md#make-string) (optional)
  - `numbers` : [NumberSettings](#record-culture-numbersettings)
  - `time` : [TimeSettings](#record-culture-timesettings)? (optional)


