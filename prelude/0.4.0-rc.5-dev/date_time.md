---
package: prelude
version: "0.4.0-rc.5-dev"
source: date_time.kex
title: DateTime
entities:
  - { kind: record, name: "DateTime" }
  - { kind: module, name: "DateTime" }
  - { kind: make, name: "DateTime" }
---

# DateTime

## record `DateTime`

An instant: a calendar date, a time of day, and a fixed offset from UTC.

```kex
let m = DateTime.parse("2026-07-30T14:03:00+02:00").try
m.iso        # => "2026-07-30T14:03:00+02:00"
m.utc.iso    # => "2026-07-30T12:03:00Z"
```

`compareTo`, `before?` and `after?` compare instants, so 12:00Z and 14:00+02:00 compare `Equal`. `==` compares the fields, so those two are not `==`; compare their `epochSeconds` or `utc` forms instead.

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

Writes the instant as a record, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered instant

#### `showValue` (from Showable)

```kex
showValue -> String
```

Writes the instant in ISO form, which is what interpolation and `IO.printLine` show.

**Returns**: the ISO 8601 instant

**Examples**

```kex
"logged at ${DateTime.utcNow()}"   # => "logged at 2026-07-30T12:03:00Z"
```

#### `epochSeconds`

```kex
epochSeconds -> Integer
```

Returns the whole seconds since the Unix epoch. It does not depend on the offset: 12:00Z and 14:00+02:00 give the same number.

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

Returns the day of the week at the instant's own offset. For the year, the hour and the other fields, go through `date` and `time`.

**Returns**: the day of the week

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00Z").try.weekday.name   # => "Thursday"
```

#### `at`

```kex
at(offset: Duration) -> DateTime
```

Returns the same instant at another offset. The date and time change to match; `epochSeconds` does not.

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

Returns the same instant at UTC.

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

Adds an elapsed span to the instant, keeping its offset.

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

Subtracts an elapsed span from the instant, keeping its offset.

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

Returns the instant `count` days later, at the same time of day and offset.

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

Returns the instant `count` weeks later, at the same time of day and offset.

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

Returns the instant `count` calendar months later, with the day clamped to the length of that month.

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

Returns the instant `count` calendar years later. February 29th becomes February 28th in a year without one.

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

Returns the time elapsed from this instant to `other`, negative when `other` is earlier. Fractions of a second are kept.

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

Returns the instant as ISO 8601 text, such as +2026-07-30T14:03:00+02:00+.

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

Compares two instants by when they happen, so 12:00Z and 14:00+02:00 compare `Equal`.

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

Building instants and reading the current time.

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

Returns the instant `count` seconds after the Unix epoch, at UTC.

**Parameters**

  - `count` — seconds since the Unix epoch

**Returns**: the instant

**Examples**

```kex
DateTime.fromEpochSeconds(0).iso   # => "1970-01-01T00:00:00Z"
```

### `parse`

```kex
parse(text: String) -> Result<DateTime, TimeError>
```

Parses an ISO 8601 instant.

Accepts +2026-07-30T14:03:00+02:00+, the same with `Z`, or a date and time with no offset, which is read as UTC.

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

Returns the current instant at this machine's current UTC offset.

The offset is fixed. Kex does not model named time zones, so adding months to the result keeps today's offset even across a daylight-saving change.

**Returns**: the current instant

**Examples**

```kex
DateTime.now().iso   # => "2026-07-30T14:03:00+02:00"
```

### `utcNow` (foul)

```kex
utcNow -> DateTime
```

Returns the current instant at UTC. Use it for values that are stored or sent elsewhere.

**Returns**: the current instant, at UTC

**Examples**

```kex
DateTime.utcNow().iso   # => "2026-07-30T12:03:00Z"
```

### `epochNanos` (foul)

```kex
epochNanos -> Integer
```

Returns the clock's reading in nanoseconds since the Unix epoch. It is the simplest way to time a short piece of work.

**Returns**: nanoseconds since the Unix epoch

**Examples**

_Timing a piece of work_

```kex
let started = DateTime.epochNanos()
doTheThing()
let elapsedMs = (DateTime.epochNanos() - started) / 1000000
```
