---
package: prelude
version: "0.4.0-rc.4-dev"
source: date_format.kex
title: DateFormat
entities:
  - { kind: record, name: "DateFormat" }
  - { kind: module, name: "DateFormat" }
  - { kind: make, name: "Date" }
  - { kind: make, name: "Time" }
  - { kind: make, name: "DateTime" }
---

# DateFormat

## record `DateFormat`

A CLDR pattern such as `"yyyy-MM-dd HH:mm"` for `to(String, format)` on a date, a time of day or an instant. The patterns are described at `Date.format`. Build one with the `Date.format` tagged literal, or with `DateFormat.parse` for a pattern known only at run time.

**Fields**

  - `pattern` : [String](string.md#make-string)



## module `DateFormat`

### `parse`

```kex
parse(pattern: String) -> Result<DateFormat, PatternError>
```

Checks a pattern known only at run time and returns it as a `DateFormat`. `Date.format` describes the patterns.

**Parameters**

  - `pattern` — the pattern

**Returns**: the format, or where the pattern goes wrong

**Examples**

```kex
DateFormat.parse("yyyy-MM-dd")   # => Ok(DateFormat { pattern: "yyyy-MM-dd" })
DateFormat.parse("yyyy-QQ")      # => Error(PatternError { message: "...", position: 5 })
```

### `pieces`

```kex
pieces(pattern: String) -> Result<[Piece], (Integer, String)>
```

Splits a pattern into its fields and its literal text. For a bad pattern it returns the index of the first problem and a message.

**Parameters**

  - `pattern` — the pattern

**Returns**: the pieces, or the problem

**Examples**

```kex
DateFormat.pieces("d MMM")   # => Ok([PatternField('d', 1), PatternText(" "), PatternField('M', 3)])
```

### `renderParts`

```kex
renderParts(format: DateFormat, date: Date?, time: Time?, offset: Duration?, culture: Culture.Culture) -> String?
```

Writes whichever of `date`, `time` and `offset` are given by a pattern, with `culture`'s names. Returns `None` for a bad pattern or when the pattern asks for a field that is missing, such as an hour of a `Date`.

Callers normally use `to(String, format)` on `Date`, `Time` or `DateTime` instead.

**Parameters**

  - `format` — the pattern
  - `date` — the calendar date, when the value has one
  - `time` — the time of day, when the value has one
  - `offset` — the offset from UTC, when the value has one
  - `culture` — where month, weekday and day-period names come from

**Returns**: the text, or `None`

### `dateLayout`

```kex
dateLayout(culture: Culture.Culture) -> String
```

Returns the pattern a culture writes dates in: year, month and day in its order, joined by its date separator. A culture without time settings gets `"yyyy-MM-dd"`.

**Parameters**

  - `culture` — the culture

**Returns**: the pattern, such as `"dd.MM.yyyy"`

**Examples**

```kex
DateFormat.dateLayout(Culture.of("DE_DE").or(Culture.DEFAULT))   # => "dd.MM.yyyy"
```

### `timeLayout`

```kex
timeLayout(culture: Culture.Culture) -> String
```

Returns the pattern a culture writes a time of day in: hours, minutes and seconds joined by its time separator, with a 12-hour clock and AM/PM where the culture uses them. A culture without time settings gets `"HH:mm:ss"`.

**Parameters**

  - `culture` — the culture

**Returns**: the pattern, such as `"HH:mm:ss"` or `"h:mm:ss a"`

**Examples**

```kex
DateFormat.timeLayout(Culture.of("EN_US").or(Culture.DEFAULT))   # => "h:mm:ss a"
```

## type `Piece`

One piece of a pattern: a field letter written `width` times, or text written as it stands.

**Variants**

  - `PatternField(Char, Integer)`
  - `PatternText(String)`



## extends `Date`

More functions for [`Date`](date.md#record-date), added by this module.

### `to`

```kex
to(String: Type, format: DateFormat, culture: Culture) -> String?
```

Writes the date by a CLDR pattern, with English month and weekday names. Patterns are described at `Date.format`.

**Parameters**

  - `String` — the target type
  - `format` — the pattern

**Returns**: the text, or `None` when the pattern asks for a time field, which a date does not have

**Examples**

```kex
Date.of(2026, 11, 7).try.to(String, Date.format`yyyy-MM-dd`)   # => Just("2026-11-07")
Date.of(2026, 11, 7).try.to(String, Date.format`EEEE, d MMMM yyyy`)
# => Just("Saturday, 7 November 2026")
```

## extends `Time`

More functions for [`Time`](time.md#record-time), added by this module.

### `to`

```kex
to(String: Type, format: DateFormat, culture: Culture) -> String?
```

Writes the time of day by a CLDR pattern. Patterns are described at `Date.format`.

**Parameters**

  - `String` — the target type
  - `format` — the pattern

**Returns**: the text, or `None` when the pattern asks for a date or an offset field, which a time of day does not have

**Examples**

```kex
Time.of(14, 3, 0).try.to(String, Date.format`HH:mm`)     # => Just("14:03")
Time.of(14, 3, 0).try.to(String, Date.format`h:mm a`)    # => Just("2:03 PM")
```

## extends `DateTime`

More functions for [`DateTime`](date_time.md#record-datetime), added by this module.

### `to`

```kex
to(String: Type, format: DateFormat, culture: Culture) -> String?
```

Writes the instant by a CLDR pattern, at its own offset. Patterns are described at `Date.format`.

**Parameters**

  - `String` — the target type
  - `format` — the pattern

**Returns**: the text, or `None` for a pattern that is not valid

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try.to(String, Date.format`yyyy-MM-dd HH:mm XXX`)
# => Just("2026-07-30 14:03 +02:00")
```
