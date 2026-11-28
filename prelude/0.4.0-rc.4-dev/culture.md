---
package: prelude
version: "0.4.0-rc.4-dev"
source: culture.kex
title: Culture
entities:
  - { kind: module, name: "Culture" }
---

# Culture

## module `Culture`

Cultures for parsing and printing numbers and dates: decimal separators, digit grouping, date layout and month and weekday names.

A culture is always passed as an argument. Parsing and printing never read the machine's locale on their own, so a call gives the same result everywhere. Without a culture, numbers use a `.` decimal point and no grouping; pass one for text written for people in a particular place.

```kex
using Culture
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Float.parse("1,44", culture: hu)   # => Ok(1.44)
Float.parse("1,44")                # => Error(Trailing(1.0, ",44"))
```

### `ENGLISH_TIME_NAMES` (constant)

```kex
ENGLISH_TIME_NAMES : TimeNames
```

The English month, weekday and day-period names, also used for any culture that has none of its own.



### `timeNames`

```kex
timeNames(culture: Culture) -> TimeNames
```

Returns the names `culture` writes dates with: its own if it has them, English otherwise. The presets have names for English, Hungarian, German, French, Spanish, Italian, Portuguese and Dutch.

**Parameters**

  - `culture` — the culture

**Returns**: the names to write with

**Examples**

```kex
Culture.timeNames(Culture.of("HU_HU").or(Culture.DEFAULT)).months.first   # => Just("január")
Culture.timeNames(Culture.DEFAULT).months.first                          # => Just("January")
```

### `DEFAULT` (constant)

```kex
DEFAULT : Culture
```

The culture used when none is given: a `.` decimal point, no grouping and no time settings. `parse(s)` and `parse(s, culture: Culture.DEFAULT)` give the same result. It suits text written by programs, such as protocols, data files and logs.



### `of`

```kex
of(code: String) -> Culture?
```

Returns the preset culture for `code`, or `None` for an unknown tag.

Case does not matter and `-` reads as `_`, so `"hu-HU"` and `"HU_HU"` find the same culture.

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

Returns `true` when the culture's number settings are usable. With grouping, the group separator must differ from the decimal separator and the group sizes must be a non-empty list of positive integers.

Parsing and printing check this themselves: parsing with an invalid culture returns `Error(BadCulture)` and printing returns `None`. Call `valid?` to report the problem earlier.

**Parameters**

  - `culture` — the culture to check

**Returns**: `true` when the number settings are usable

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.valid?(hu)              # => true
```

### `readNumber`

```kex
readNumber(text: String, culture: Culture, radix: Integer, fractional: Bool, convert: (String -> String -> T?)) -> Result<T, ParseError<T>>
```

Reads the number in `text` with the grammar `Integer.parse`, `Float.parse` and `Number.parse` share. Most callers want one of those.

The grammar is an optional sign, then digits in `radix` (letters above 9 in either case). Group separators must follow `culture`'s grouping; digits with no separator read in every culture. When `fractional` is true, a decimal part after the culture's decimal separator and an exponent (`e3`, `E-2`) may follow.

`convert` gets the sign and digits without separators (`"-1500"`), and the fraction and exponent in canonical form (`".5e3"`, `".0e3"` for an exponent alone, `""` for neither). When it returns `None` the result is `OutOfRange`. A number followed by more text is `Trailing`.

**Parameters**

  - `text` — the text to read
  - `culture` — whose separators to accept
  - `radix` — the base of the digits, 2 to 36
  - `fractional` — whether a fraction and an exponent may follow
  - `convert` — the value of the digits read

**Returns**: the value, or why not

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.readNumber("1 500 Ft", hu, 10, false) { |digits, _| digits.to(Integer) }
# => Error(Trailing(1500, " Ft"))
```

### `renderNumber`

```kex
renderNumber(text: String, culture: Culture) -> String?
```

Rewrites a number written with a `.` decimal point, such as `"1500.5"`, with the culture's decimal separator and digit grouping. An exponent passes through unchanged. Returns `None` for an invalid culture (see `valid?`).

Most callers want `(1500.5).to(String, culture: culture)`, which uses it.

**Parameters**

  - `text` — the dot-form text to render
  - `culture` — the culture to render with

**Returns**: the rendered text, or `None` for an invalid culture

**Examples**

```kex
let hu = Culture.of("HU_HU").or(Culture.DEFAULT)
Culture.renderNumber("1500.5", hu)              # => Just("1\u{A0}500,5")
```

### `local` (foul)

```kex
local -> Culture
```

Returns the machine's culture, named by the first of `LC_ALL`, `LC_NUMERIC` and `LANG` that is set. Falls back to `DEFAULT` when none is set or the first one set names no known culture.

Parsing and printing never read the locale themselves, so read it once and pass it on:

```kex
let culture = Culture.local
Float.parse(input, culture: culture)
```

**Returns**: the machine's culture, or `DEFAULT`

## record `NumberSettings`

How a culture writes numbers: its decimal separator and its digit grouping.

**Fields**

  - `decimalSeparator` : [Char](string.md#make-char) (optional)
  - `groups` : ([Char](string.md#make-char), [[Integer](number.md#make-integer)])? (optional)



## record `TimeSettings`

How a culture writes dates and times: the layout `to(String, culture:)` uses on a `Date`, `Time` or `DateTime`, and the names a `Date.format` pattern uses.

**Fields**

  - `dateOrder` : [[Atom](atom.md#make-atom)]
  - `dateSeparator` : [Char](string.md#make-char)
  - `timeSeparator` : [Char](string.md#make-char)
  - `twelveHour?` : [Bool](truthyable.md#make-bool) (optional)
  - `names` : [TimeNames](#record-culture-timenames)? (optional)



## record `TimeNames`

The words a culture writes dates and times with, which `MMMM`, `MMM`, `EEEE`, `EEE` and `a` in a `Date.format` pattern produce.

**Fields**

  - `months` : [[String](string.md#make-string)]
  - `shortMonths` : [[String](string.md#make-string)]
  - `weekdays` : [[String](string.md#make-string)]
  - `shortWeekdays` : [[String](string.md#make-string)]
  - `dayPeriods` : ([String](string.md#make-string), [String](string.md#make-string))



## record `Culture`

A named set of settings for parsing and printing numbers and dates.

Get a preset with `of`, the machine's culture with `local`, or write the record yourself. A custom culture only needs `numbers`; `time` defaults to `None`.

**Fields**

  - `name` : [String](string.md#make-string) (optional)
  - `numbers` : [NumberSettings](#record-culture-numbersettings)
  - `time` : [TimeSettings](#record-culture-timesettings)? (optional)


