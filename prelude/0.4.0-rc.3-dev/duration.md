---
package: prelude
version: "0.4.0-rc.3-dev"
source: duration.kex
title: Duration
entities:
  - { kind: make, name: "Measure<Quantity.Time>" }
  - { kind: module, name: "Duration" }
---

# Duration

Elapsed time: a `Duration` is a `Measure<Quantity.Time>` (units.kex), a count of seconds. These are the operations it has beyond every measure's, its ISO 8601 form, and the `Duration` module that builds spans and UTC offsets.

## extends `Measure<Quantity.Time>`

More functions for [`Measure`](units.md#record-measure), added by this module.

The operations a span of time has beyond every measure's: a `Duration` is `Measure<Quantity.Time>`, so these are its own.

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

The same span with its sign flipped.

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

`3 * 1.day` is not the same call because the receiver has to be the Duration, so it is spelled `1.day * 3`.

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

The span's magnitude, discarding its direction.

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

A negative span is what `until` gives you when the other moment is earlier, so this is how to ask which came first.

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

Named for length rather than for order: `before?`/`after?` are about when something happened, and a Duration is not a point in time.

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

The span's length in seconds, fraction included. `wholeSeconds` is the Integer form.

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

The whole milliseconds in the span, truncated toward zero.

**Returns**: the milliseconds

**Examples**

```kex
500.millisecond.wholeMilliseconds   # => 500
```

### `wholeSeconds`

```kex
wholeSeconds -> Integer
```

The whole seconds in the span, truncated toward zero.

**Returns**: the seconds

**Examples**

```kex
2.hour.wholeSeconds   # => 7200
```

### `wholeMinutes`

```kex
wholeMinutes -> Integer
```

The whole minutes in the span, truncated toward zero.

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

The whole hours in the span, truncated toward zero. A partial hour does not count.

**Returns**: the hours

**Examples**

```kex
90.minute.wholeHours   # => 1
```

### `wholeDays`

```kex
wholeDays -> Integer
```

The whole days in the span, truncated toward zero.

This is what +date + span+ uses, which is why +date + 36.hour+ advances exactly one day.

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

The whole weeks in the span, truncated toward zero.

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

Delegates to `Number.compare` (algebra.kex), which orders the two Float second counts.

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

The span in ISO 8601 form: hours, minutes and seconds, with the fraction of a second written as `iso` on a `Time` writes it. A zero span is `PT0S`, and a negative one carries a leading `-`.

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

A span of no time at all. Also the UTC offset.

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

A whole-minute UTC offset, the only kind ISO 8601 can spell.

A negative hour or minute puts the whole offset west of UTC, so `utcOffset(-5, 30)` is five and a half hours behind UTC, not four and a half.

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
