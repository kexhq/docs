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

Writing dates, times of day and instants by a CLDR pattern: the `DateFormat` record and module, and `to(String, format)` on `Date`, `Time` and `DateTime`.

## record `DateFormat`

How `to(String, format)` writes a date, a time of day or an instant: a CLDR pattern such as `"yyyy-MM-dd HH:mm"`, described at `Date.format`. Build one with the `Date.format` tagged literal, or with `DateFormat.parse`, which says where a pattern known only at run time goes wrong.

**Fields**

  - `pattern` : [String](string.md#make-string)



## module `DateFormat`

### `parse`

```kex
parse(pattern: String) -> Result<DateFormat, ParseError>
```

Checks a pattern known only at run time. `Date.format` describes the patterns.

**Parameters**

  - `pattern` — the pattern

**Returns**: the format, or where the pattern goes wrong

**Examples**

```kex
DateFormat.parse("yyyy-MM-dd")   # => Ok(DateFormat { pattern: "yyyy-MM-dd" })
DateFormat.parse("yyyy-QQ")      # => Error(ParseError { position: 5, ... })
```

### `pieces`

```kex
pieces(pattern: String) -> Result<[Piece], (Integer, String)>
```

Splits a pattern into its fields and its literal text. Otherwise the index of its first problem, and what that problem is.

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

Writes `date`, `time` and `offset` (whichever the value has) by the pieces of a pattern, with `culture`'s names. `None` when the pattern asks for a field the value does not have, such as an hour of a `Date`.

The `to(String, format)` functions on `Date`, `Time` and `DateTime` are the way to reach this.

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

The pattern a culture writes its dates in: year, month and day in its order, joined by its date separator. ISO order without a time section.

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

The pattern a culture writes a time of day in: hours, minutes and seconds joined by its time separator, on a 12-hour clock with a day period where the culture reads time that way.

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

Writes the instant by a CLDR pattern, as read at its own offset. Patterns are described at `Date.format`.

**Parameters**

  - `String` — the target type
  - `format` — the pattern

**Returns**: the text, or `None` for a pattern that is not valid

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try.to(String, Date.format`yyyy-MM-dd HH:mm XXX`)
# => Just("2026-07-30 14:03 +02:00")
```
