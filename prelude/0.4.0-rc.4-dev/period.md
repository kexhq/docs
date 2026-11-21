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

Calendar spans: `1.month`, `2.year`, resolved by the calendar they are added on. Fixed elapsed time is a `Duration`, in duration.kex.

## record `Period`

A calendar span. Months and years have no fixed length: February is 28 days or 29, a year 365 or 366, so they cannot live in a `Duration`, which is a count of seconds and nothing else. A Period carries the calendar fields themselves and lets the calendar resolve them:

```kex
Date.of(2026, 1, 31).try + 1.month        # 2026-02-28, not 2026-03-03
Date.of(2024, 2, 29).try + 1.year         # 2025-02-28
```

Use a Duration for elapsed time (`36.hour` is always 129600 seconds) and a Period for calendar steps (`1.month` is however long that month is).

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

Renders the period structurally, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered period

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the period as its ISO 8601 form, so interpolation and `IO.printLine` show `P1Y2M3D`.

**Returns**: the ISO 8601 duration

**Examples**

```kex
"due in ${Period.of(0, 1, 0)}"   # => "due in P1M"
```

#### `+`

```kex
+(other: Period) -> Period
```

Adds two calendar spans, field by field.

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

Subtracts a calendar span, field by field. Fields may go negative.

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

The same span with every field's sign flipped: a step backwards.

**Returns**: the negated span

**Examples**

```kex
Period.of(1, 2, 3).negated.iso   # => "P-1Y-2M-3D"
```

#### `*`

```kex
*(factor: Integer) -> Period
```

Multiplies every field by `factor`.

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

Returns `true` when every field is zero.

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

The years and months of the span, as one count of months.

Years and months are one quantity for arithmetic: a month is 1/12 of a year exactly, unlike days, which are not a fixed fraction of a month. This is why `date + span` applies them together rather than one after the other.

**Returns**: the total months, ignoring days

**Examples**

```kex
Period.of(1, 2, 3).totalMonths   # => 14
```

#### `normalized`

```kex
normalized -> Period
```

The same span with excess months carried into years.

14 months becomes 1 year 2 months. Days are left alone: there is no fixed number of them in a month to carry by.

**Returns**: the normalised span

**Examples**

```kex
14.month.normalized.iso   # => "P1Y2M"
```

#### `iso`

```kex
iso -> String
```

The span as an ISO 8601 duration, `P1Y2M3D`.

A zero period is `P0D`, the shortest spelling the grammar allows: `P` alone is not valid.

**Returns**: the ISO 8601 duration

**Examples**

```kex
Period.of(1, 2, 3).iso   # => "P1Y2M3D"
Period.zero().iso        # => "P0D"
2.month.iso             # => "P2M"
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## extends `Integer`

More functions for [`Integer`](number.md#make-integer), added by this module.

Calendar spans on `Integer`: `1.month`, `2.year`. A `Period`, not a `Duration`: `4.week` is exactly 28 days, `1.month` one calendar month, however long that month turns out to be. The time units (`5.second`, `90.minute`, `2.week`) are in units.kex.

### `month`

```kex
month -> Period
```

This many calendar months, as a `Period`.

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

This many calendar years, as a `Period`.

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2024, 2, 29).try + 1.year).iso   # => "2025-02-28"
```

## module `Period`

Building calendar spans.

### `zero`

```kex
zero -> Period
```

A span of nothing.

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

A span of the given years, months and days together.

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

A span of `count` calendar years.

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

A span of `count` calendar months.

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

A span of `count` days, as a calendar step.

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

A span of `count` weeks, recorded as that many times seven days.

**Parameters**

  - `count` — how many weeks

**Returns**: the calendar span

**Examples**

```kex
Period.weeks(2).iso   # => "P14D"
```
