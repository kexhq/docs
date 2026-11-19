---
package: prelude
version: "0.4.0-rc.3-dev"
source: date_time.kex
title: DateTime
entities:
  - { kind: record, name: "DateTime" }
  - { kind: module, name: "DateTime" }
  - { kind: make, name: "DateTime" }
---

# DateTime

Instants: a calendar date, a time of day, and a fixed offset from UTC. Built from date.kex's `Date` and time.kex's `Time`.

## record `DateTime`

An instant: a calendar date, a time of day, and a fixed offset from UTC.

```kex
let m = DateTime.parse("2026-07-30T14:03:00+02:00").try
m.iso        # => "2026-07-30T14:03:00+02:00"
m.utc.iso    # => "2026-07-30T12:03:00Z"
```

Two `DateTime` values that name the same instant order `Equal` under `compareTo` whatever offsets they are written at: ordering goes through `epochSeconds`. `==` is structural, so the same instant written at two offsets is not `==`; compare `epochSeconds` (or `utc`) for that.

**Fields**

  - `date` : [Date](date.md#record-date)
  - `time` : [Time](time.md#record-time)
  - `offset` : Duration

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Functions

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Renders the instant structurally, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered instant

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the instant in ISO form, so interpolation and `IO.printLine` show +2026-07-30T14:03:00+02:00+.

**Returns**: the ISO 8601 instant

**Examples**

```kex
"logged at ${DateTime.utcNow()}"   # => "logged at 2026-07-30T12:03:00Z"
```

#### `epochSeconds`

```kex
epochSeconds -> Integer
```

Seconds since the Unix epoch.

This is the value to compare and subtract: it identifies the instant, independent of the offset rendering it, so 12:00Z and 14:00+02:00 have the same one.

**Returns**: seconds since the Unix epoch

**Examples**

```kex
DateTime.parse("1970-01-01T00:00:00Z").try.epochSeconds   # => 0
```

_Storing an instant as a number_

```kex
FS.File.write("stamp", "${DateTime.utcNow().epochSeconds}")
```

#### `weekday`

```kex
weekday -> Weekday
```

The day of the week this instant falls on, at its own offset.

No `year`/`hour`/... shorthands here: a function named after a record field makes `value.year` inside a module function dispatch to it on BEAM and fail with function_clause. Reach through `.date` and `.time`.

**Returns**: the day of the week

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00Z").try.weekday.name   # => "Thursday"
```

#### `at`

```kex
at(offset: Duration) -> DateTime
```

The same instant, rendered at another offset.

Nothing moves: the wall clock changes because the offset does, and `epochSeconds` is unchanged.

**Parameters**

  - `offset` — the offset to render at

**Returns**: the same instant, at that offset

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try
  .at(Duration.utcOffset(-5, 0)).iso
# => "2026-07-30T07:03:00-05:00"
```

#### `utc`

```kex
utc -> DateTime
```

The same instant, rendered at UTC.

The form to store, compare and transmit: there is no offset to disagree about.

**Returns**: the same instant, at UTC

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try.utc.iso
# => "2026-07-30T12:03:00Z"
```

#### `+`

```kex
+(span: Duration) -> DateTime
```

Advances the instant by a fixed span, keeping its offset.

**Parameters**

  - `span` — the elapsed span to add

**Returns**: the later instant

**Examples**

```kex
(DateTime.parse("2026-07-30T14:03:00Z").try + 90.minute).iso
# => "2026-07-30T15:33:00Z"
```

#### `-`

```kex
-(span: Duration) -> DateTime
```

Moves the instant back by a fixed span, keeping its offset.

**Parameters**

  - `span` — the elapsed span to subtract

**Returns**: the earlier instant

**Examples**

```kex
(DateTime.utcNow() - 24.hour).iso   # yesterday, same wall clock
```

#### `addDays`

```kex
addDays(count: Integer) -> DateTime
```

The instant `count` days later, keeping the wall clock and the offset.

**Parameters**

  - `count` — how many days to add

**Returns**: the shifted instant

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00Z").try.addDays(1).iso
# => "2026-07-31T14:03:00Z"
```

#### `addWeeks`

```kex
addWeeks(count: Integer) -> DateTime
```

The instant `count` weeks later, keeping the wall clock and the offset.

**Parameters**

  - `count` — how many weeks to add

**Returns**: the shifted instant

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00Z").try.addWeeks(1).iso
# => "2026-08-06T14:03:00Z"
```

#### `addMonths`

```kex
addMonths(count: Integer) -> DateTime
```

The instant `count` calendar months later, with the day clamped into the target month.

**Parameters**

  - `count` — how many months to add

**Returns**: the shifted instant

**Examples**

```kex
DateTime.parse("2026-01-31T09:00:00Z").try.addMonths(1).iso
# => "2026-02-28T09:00:00Z"
```

#### `addYears`

```kex
addYears(count: Integer) -> DateTime
```

The instant `count` calendar years later, with the day clamped.

**Parameters**

  - `count` — how many years to add

**Returns**: the shifted instant

**Examples**

```kex
DateTime.parse("2024-02-29T09:00:00Z").try.addYears(1).iso
# => "2025-02-28T09:00:00Z"
```

#### `until`

```kex
until(other: DateTime) -> Duration
```

Elapsed time from this instant to `other`, negative when `other` is earlier. Sub-second precision is kept.

**Parameters**

  - `other` — the instant to measure to

**Returns**: the elapsed span

**Examples**

```kex
started.until(DateTime.utcNow()).wholeSeconds
```

_Enforcing a deadline_

```kex
if started.until(DateTime.utcNow()).longerThan?(30.second)
  IO.printError("timed out")
end
```

#### `before?`

```kex
before?(other: DateTime) -> Bool
```

Returns `true` when this instant is earlier than `other`, whatever offsets they are written at.

**Parameters**

  - `other` — the instant to compare against

**Returns**: `true` when this instant comes first

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try
  .before?(DateTime.parse("2026-07-31T00:00:00Z").try)
# => true
```

#### `after?`

```kex
after?(other: DateTime) -> Bool
```

Returns `true` when this instant is later than `other`.

**Parameters**

  - `other` — the instant to compare against

**Returns**: `true` when this instant comes second

**Examples**

```kex
DateTime.utcNow().after?(started)   # => true
```

#### `iso`

```kex
iso -> String
```

The instant as ISO 8601 text, +2026-07-30T14:03:00+02:00+.

**Returns**: the ISO 8601 instant

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try.iso
# => "2026-07-30T14:03:00+02:00"
```

#### `compareTo`

```kex
compareTo(other: DateTime) -> Ordering
```

Orders this instant against another, by instant rather than by wall clock, so 12:00Z and 14:00+02:00 compare `Equal`.

Named `compareTo` rather than `compare`: a make-block `compare` is shadowed by the builtin comparison dispatch and fails at runtime on both backends.

**Parameters**

  - `other` — the instant to compare against

**Returns**: `Less`, `Equal` or `Greater`

**Examples**

```kex
DateTime.parse("2026-07-30T12:00:00Z").try
  .compareTo(DateTime.parse("2026-07-30T14:00:00+02:00").try)
# => Equal
```

_Sorting events by when they happened_

```kex
events.sort { |a, b| a.at.compareTo(b.at) == Less }
```

### Defined in other modules

  - [DateFormat](date_format.md#make-datetime): [`to`](date_format.md#datetime-to)

## module `DateTime`

Building instants, and asking what time it is now.

### `of`

```kex
of(date: Date, time: Time, offset: Duration) -> DateTime
```

Combines a date, a time of day and a UTC offset into an instant.

**Parameters**

  - `date` — the calendar date
  - `time` — the time of day
  - `offset` — the offset from UTC

**Returns**: the instant

**Examples**

```kex
DateTime.of(Date.of(2026, 7, 30).try,
            Time.of(9, 0, 0).try,
            Duration.zero()).iso
# => "2026-07-30T09:00:00Z"
```

_At an offset_

```kex
DateTime.of(date, time, Duration.utcOffset(2, 0))
```

### `fromEpochSeconds`

```kex
fromEpochSeconds(count: Integer, offset: Duration) -> DateTime
```

The instant a count of seconds since the Unix epoch names, rendered at UTC or at the offset you give.

Declared before the two-argument form: the interpreter resolves an overloaded module function to its LAST definition regardless of arity, so a delegating overload has to come first or it recurses into itself.

**Parameters**

  - `count` — seconds since the Unix epoch
  - `offset` — the offset to render at; omitted for UTC

**Returns**: the instant

**Examples**

```kex
DateTime.fromEpochSeconds(0).iso   # => "1970-01-01T00:00:00Z"
```

_Rendered at a local offset_

```kex
DateTime.fromEpochSeconds(0, Duration.utcOffset(2, 0)).iso
# => "1970-01-01T02:00:00+02:00"
```

### `parse`

```kex
parse(text: String) -> Result<DateTime, TimeError>
```

Parses an ISO 8601 instant.

Accepts +2026-07-30T14:03:00+02:00+, the same with `Z`, or a bare civil datetime with no zone at all, which is read as UTC.

**Parameters**

  - `text` — the text to parse

**Returns**: the instant, or why it could not be read

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").map { |m| m.utc.iso }
# => Ok("2026-07-30T12:03:00Z")
DateTime.parse("nope")   # => Error(InvalidFormat("nope"))
```

_Reading a timestamp out of a log line_

```kex
DateTime.parse(line.take(20)).map { |m| m.epochSeconds }
```

### `now` (foul)

```kex
now -> DateTime
```

The current instant, in this machine's zone as it stands right now.

The offset is the one in effect at this instant, so it is right today. Named IANA zones are not modeled, so it cannot say what the offset WILL be for some future local time.

**Returns**: the current instant

**Examples**

```kex
DateTime.now().iso   # => "2026-07-30T14:03:00+02:00"
```

### `utcNow` (foul)

```kex
utcNow -> DateTime
```

The current instant, at UTC.

The form to prefer when the value is stored, compared or transmitted: there is no zone to disagree about.

**Returns**: the current instant, at UTC

**Examples**

```kex
DateTime.utcNow().iso   # => "2026-07-30T12:03:00Z"
```

### `epochNanos` (foul)

```kex
epochNanos -> Integer
```

Nanoseconds since the Unix epoch, straight from the clock.

The right reading for measuring a short interval: a plain integer, with no zone to disagree about.

**Returns**: nanoseconds since the Unix epoch

**Examples**

_Timing a piece of work_

```kex
let started = DateTime.epochNanos()
doTheThing()
let elapsedMs = (DateTime.epochNanos() - started) / 1000000
```
