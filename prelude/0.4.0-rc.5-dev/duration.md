---
package: prelude
version: "0.4.0-rc.5-dev"
source: duration.kex
title: Duration
entities:
  - { kind: make, name: "Measure<Quantity.Time>" }
  - { kind: module, name: "Duration" }
---

# Duration

Elapsed time. A `Duration` is a `Measure<Quantity.Time>` (see units.kex) holding a number of seconds. This file adds the functions a span of time has beyond those of every measure, its ISO 8601 form, and the `Duration` module for zero spans and UTC offsets.

## extends `Measure<Quantity.Time>`

More functions for [`Measure`](units.md#record-measure), added by this module.

Functions on a `Duration` beyond those every measure has.

### `wholeNanoseconds`

```kex
wholeNanoseconds -> Integer
```

### `wholeMicroseconds`

```kex
wholeMicroseconds -> Integer
```

### `negated`

```kex
negated -> Duration
```

Returns the same span with its sign flipped.

**Returns**: the negated span

**Examples**

```kex
90.minute.negated.negative?   # => true
```

### `*`

```kex
*(factor: Number) -> Duration
```

Multiplies the span by a plain number.

The span must come first: write `1.day * 3`, not `3 * 1.day`.

**Parameters**

  - `factor` — the factor to multiply by

**Returns**: the scaled span

**Examples**

```kex
(90.minute * 2).wholeHours   # => 3
```

### `/`

```kex
/(divisor: Number) -> Duration
```

Divides the span by a plain number.

**Parameters**

  - `divisor` — the number to divide by

**Returns**: the scaled span

**Examples**

```kex
(90.minute / 2).wholeMinutes   # => 45
```

### `abs`

```kex
abs -> Duration
```

Returns the span's length without its sign.

**Returns**: the absolute span

**Examples**

```kex
(1.hour - 90.minute).abs.wholeMinutes   # => 30
```

### `zero?`

```kex
zero? -> Bool
```

Returns `true` when the span is exactly zero.

**Returns**: `true` for a zero span

**Examples**

```kex
Duration.zero().zero?   # => true
```

### `negative?`

```kex
negative? -> Bool
```

Returns `true` when the span points backwards.

`until` returns a negative span when the other moment is earlier, so this tells you which came first.

**Returns**: `true` for a negative span

**Examples**

```kex
date.until(other).negative?   # => true when `other` is earlier
```

### `positive?`

```kex
positive? -> Bool
```

Returns `true` when the span points forwards.

**Returns**: `true` for a positive span

**Examples**

```kex
90.minute.positive?   # => true
```

### `shorterThan?`

```kex
shorterThan?(other: Duration) -> Bool
```

Returns `true` when this span is shorter than `other`.

**Parameters**

  - `other` — the span to compare against

**Returns**: `true` when this span is shorter

**Examples**

```kex
30.minute.shorterThan?(1.hour)   # => true
```

_Enforcing a timeout_

```kex
if started.until(DateTime.utcNow()).longerThan?(30.second)
  IO.printError("timed out")
end
```

### `longerThan?`

```kex
longerThan?(other: Duration) -> Bool
```

Returns `true` when this span is longer than `other`.

**Parameters**

  - `other` — the span to compare against

**Returns**: `true` when this span is longer

**Examples**

```kex
90.minute.longerThan?(1.hour)   # => true
```

### `seconds`

```kex
seconds -> Float
```

Returns the span's length in seconds, fraction included. `wholeSeconds` gives an Integer.

**Returns**: the seconds

**Examples**

```kex
1.5.minute.seconds        # => 90.0
500.millisecond.seconds   # => 0.5
```

### `wholeMilliseconds`

```kex
wholeMilliseconds -> Integer
```

Returns the whole milliseconds in the span, truncated toward zero.

**Returns**: the milliseconds

**Examples**

```kex
500.millisecond.wholeMilliseconds   # => 500
```

### `wholeSeconds`

```kex
wholeSeconds -> Integer
```

Returns the whole seconds in the span, truncated toward zero.

**Returns**: the seconds

**Examples**

```kex
2.hour.wholeSeconds   # => 7200
```

### `wholeMinutes`

```kex
wholeMinutes -> Integer
```

Returns the whole minutes in the span, truncated toward zero.

**Returns**: the minutes

**Examples**

```kex
90.minute.wholeMinutes   # => 90
1.5.hour.wholeMinutes    # => 90
```

### `wholeHours`

```kex
wholeHours -> Integer
```

Returns the whole hours in the span, truncated toward zero, so a partial hour does not count.

**Returns**: the hours

**Examples**

```kex
90.minute.wholeHours   # => 1
```

### `wholeDays`

```kex
wholeDays -> Integer
```

Returns the whole days in the span, truncated toward zero.

Adding a span to a `Date` uses this, so +date + 36.hour+ moves one day forward.

**Returns**: the days

**Examples**

```kex
36.hour.wholeDays   # => 1
2.week.wholeDays    # => 14
```

### `wholeWeeks`

```kex
wholeWeeks -> Integer
```

Returns the whole weeks in the span, truncated toward zero.

**Returns**: the weeks

**Examples**

```kex
14.day.wholeWeeks   # => 2
```

### `compareTo`

```kex
compareTo(other: Duration) -> Ordering
```

Orders this span against another by length.

**Parameters**

  - `other` — the span to compare against

**Returns**: `Less`, `Equal` or `Greater`

**Examples**

```kex
90.minute.compareTo(60.minute)   # => Greater
```

_Sorting by length_

```kex
spans.sort { |a, b| a.compareTo(b) == Less }
```

### `iso`

```kex
iso -> String
```

Returns the span in ISO 8601 form, in hours, minutes and seconds.

Fractions of a second are written as a `Time`'s `iso` writes them. A zero span is `PT0S`, and a negative one starts with `-`.

**Returns**: the ISO 8601 duration

**Examples**

```kex
90.minute.iso          # => "PT1H30M"
500.millisecond.iso    # => "PT0.500S"
(-2).second.iso        # => "-PT2S"
Duration.zero().iso     # => "PT0S"
```

## module `Duration`

Building elapsed spans, and UTC offsets.

### `zero`

```kex
zero -> Duration
```

Returns a span of zero length, which is also the UTC offset.

**Returns**: the zero span

**Examples**

```kex
Duration.zero().zero?   # => true
date.at(time, Duration.zero()).iso   # => "...T09:00:00Z"
```

### `utcOffset`

```kex
utcOffset(hours: Integer, minutes: Integer) -> Duration
```

Returns a UTC offset of `hours` and `minutes`.

If either part is negative the whole offset is west of UTC, so `utcOffset(-5, 30)` is five and a half hours behind UTC.

**Parameters**

  - `hours` — the hour part of the offset
  - `minutes` — the minute part of the offset

**Returns**: the offset

**Examples**

```kex
Duration.utcOffset(2, 0).wholeSeconds     # => 7200
Duration.utcOffset(-5, 0).wholeSeconds    # => -18000
```

_Rendering an instant at another offset_

```kex
moment.at(Duration.utcOffset(-5, 0)).iso
```
