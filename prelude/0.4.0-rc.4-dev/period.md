---
package: prelude
version: "0.4.0-rc.4-dev"
source: period.kex
title: Period
entities:
  - { kind: record, name: "Period" }
  - { kind: make, name: "Integer" }
  - { kind: module, name: "Period" }
  - { kind: make, name: "Period" }
---

# Period

Calendar spans such as `1.month` and `2.year`, whose length depends on the date they are added to. Elapsed time is a `Duration`, in duration.kex.

## record `Period`

A span of calendar years, months and days.

February has 28 or 29 days and a year 365 or 366, so a month or a year is not a fixed number of seconds and cannot be a `Duration`. A `Period` keeps the calendar fields, and adding it to a date clamps the day to the end of a shorter month:

```kex
Date.of(2026, 1, 31).try + 1.month        # 2026-02-28
Date.of(2024, 2, 29).try + 1.year         # 2025-02-28
```

Use a `Duration` for elapsed time (`36.hour` is always 129600 seconds) and a `Period` for calendar steps.

**Fields**

  - `years` : [Integer](number.md#make-integer)
  - `months` : [Integer](number.md#make-integer)
  - `days` : [Integer](number.md#make-integer)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Functions

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Returns the period's fields, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered period

#### `showValue` (from Showable)

```kex
showValue -> String
```

Returns the ISO 8601 form, which is what interpolation and `IO.printLine` show.

**Returns**: the ISO 8601 duration

**Examples**

```kex
"due in ${Period.of(0, 1, 0)}"   # => "due in P1M"
```

#### `+`

```kex
+(other: Period) -> Period
```

Returns the sum of two spans, field by field.

**Parameters**

  - `other` — the span to add

**Returns**: the total

**Examples**

```kex
(Period.of(1, 2, 3) + 1.year).iso   # => "P2Y2M3D"
```

#### `-`

```kex
-(other: Period) -> Period
```

Returns the difference of two spans, field by field. Fields can go negative.

**Parameters**

  - `other` — the span to subtract

**Returns**: the difference

**Examples**

```kex
(Period.of(1, 2, 3) - 1.year).iso   # => "P2M3D"
```

#### `negated`

```kex
negated -> Period
```

Returns the span with the sign of every field flipped.

**Returns**: the negated span

**Examples**

```kex
Period.of(1, 2, 3).negated.iso   # => "P-1Y-2M-3D"
```

#### `*`

```kex
*(factor: Integer) -> Period
```

Returns the span with every field multiplied by `factor`.

**Parameters**

  - `factor` — the factor to multiply by

**Returns**: the scaled span

**Examples**

```kex
(Period.of(1, 2, 3) * 2).iso   # => "P2Y4M6D"
```

#### `zero?`

```kex
zero? -> Bool
```

Returns whether every field is zero.

**Returns**: `true` for a zero span

**Examples**

```kex
Period.zero().zero?          # => true
Period.of(0, 1, 0).zero?     # => false
```

#### `totalMonths`

```kex
totalMonths -> Integer
```

Returns the years and months of the span as one count of months.

A year is always 12 months, while a month has no fixed number of days, so +date + span+ adds the years and months in one step and the days after.

**Returns**: the total months, ignoring days

**Examples**

```kex
Period.of(1, 2, 3).totalMonths   # => 14
```

#### `normalized`

```kex
normalized -> Period
```

Returns the span with whole years of months carried into `years`.

14 months becomes 1 year 2 months. Days are not carried, since a month has no fixed number of them.

**Returns**: the normalised span

**Examples**

```kex
14.month.normalized.iso   # => "P1Y2M"
```

#### `iso`

```kex
iso -> String
```

Returns the span as an ISO 8601 duration such as `P1Y2M3D`.

The empty span is `P0D`, because a bare `P` is not valid ISO 8601.

**Returns**: the ISO 8601 duration

**Examples**

```kex
Period.of(1, 2, 3).iso   # => "P1Y2M3D"
Period.zero().iso        # => "P0D"
2.month.iso              # => "P2M"
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## extends `Integer`

More functions for [`Integer`](number.md#make-integer), added by this module.

The calendar spans `1.month` and `2.year` on `Integer`.

These return a `Period`. The fixed time units (`5.second`, `90.minute`, `2.week`) return a `Duration` and live in units.kex; `4.week` is always 28 days.

### `month`

```kex
month -> Period
```

Returns a `Period` of this many calendar months.

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2026, 7, 30).try + 1.month).iso   # => "2026-08-30"
```

_The calendar clamps a day that does not exist_

```kex
(Date.of(2026, 1, 31).try + 1.month).iso   # => "2026-02-28"
```

### `year`

```kex
year -> Period
```

Returns a `Period` of this many calendar years.

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2024, 2, 29).try + 1.year).iso   # => "2025-02-28"
```

## module `Period`

Constructors for `Period`.

### `zero`

```kex
zero -> Period
```

Returns the empty span.

**Returns**: the zero span

**Examples**

```kex
Period.zero().iso     # => "P0D"
Period.zero().zero?   # => true
```

### `of`

```kex
of(years: Integer, months: Integer, days: Integer) -> Period
```

Returns a span of the given years, months and days.

**Parameters**

  - `years` — whole years
  - `months` — whole months
  - `days` — whole days

**Returns**: the calendar span

**Examples**

```kex
Period.of(1, 2, 3).iso   # => "P1Y2M3D"
```

### `years`

```kex
years(count: Integer) -> Period
```

Returns a span of `count` calendar years.

**Parameters**

  - `count` — how many years

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2024, 2, 29).try + Period.years(1)).iso   # => "2025-02-28"
```

### `months`

```kex
months(count: Integer) -> Period
```

Returns a span of `count` calendar months.

**Parameters**

  - `count` — how many months

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2026, 1, 31).try + Period.months(1)).iso   # => "2026-02-28"
```

### `days`

```kex
days(count: Integer) -> Period
```

Returns a span of `count` calendar days.

**Parameters**

  - `count` — how many days

**Returns**: the calendar span

**Examples**

```kex
Period.days(10).iso   # => "P10D"
```

### `weeks`

```kex
weeks(count: Integer) -> Period
```

Returns a span of `count` weeks, stored as `count * 7` days.

**Parameters**

  - `count` — how many weeks

**Returns**: the calendar span

**Examples**

```kex
Period.weeks(2).iso   # => "P14D"
```
