---
package: prelude
version: "0.4.0-rc.3-dev"
source: time.kex
title: Time
entities:
  - { kind: type, name: "TimeError" }
  - { kind: record, name: "Time" }
  - { kind: module, name: "Time" }
  - { kind: make, name: "Time" }
  - { kind: make, name: "TimeError" }
---

# Time

Calendar dates, wall-clock times, and instants.

Three civil types, each a plain record:

```kex
Date      a calendar day, no time and no zone       (2026-07-30)
Time      a time of day, no date and no zone        (14:03:00)
DateTime  both, plus a fixed offset from UTC        (2026-07-30T14:03:00+02:00)
```

Two span types connect them, and which one you want depends on whether the calendar gets a say:

```kex
Duration  fixed elapsed time, a count of seconds   (36.hour, 10.day)
Period    a calendar step, resolved by the calendar (1.month, 2.year)
```

`36.hour` is always 129600 seconds; `1.month` is however long that particular month turns out to be. So `date + 1.month` clamps January 31st to the last day of February, while `date + 30.day` counts thirty days.

A time `Measure` such as `5.second` is a third thing and deliberately NOT a Duration: a Measure describes a measurement, a Duration describes elapsed time. The plural `5.second` builds the Duration.

Values are built through their own module and used through functions:

```kex
let due = Date.of(2026, 7, 30).try           # Date
due.weekday.name                             # "Thursday"
(due + 10.day).iso                          # "2026-08-09"
(due + 1.month).iso                         # "2026-08-30"
Time.now().iso                            # e.g. "14:03:00"
```

Anything that reads the clock is replaceable: `Time.Clock` is a capability, and `with Time.Clock = Mock.Clock { at: ... }` pins it for a block.

Zones are fixed offsets: UTC, an explicit `+02:00`, or whatever this machine's zone resolves to at a given instant. Named IANA zones and their DST rules are not modeled: `Time.now()` asks the host for the offset in effect at that moment, so it is right now, but it cannot say what the offset WILL be for some future local time.

Each type has its own file: Date and Weekday in date.kex, DateTime in date_time.kex, Period in period.kex, Duration's operations in duration.kex, and pattern formatting in date_format.kex. This file holds Time, the clock, TimeError, and the calendar arithmetic the others are written on. The records and ADTs stay at file level so `make` blocks, callers, and every module can see them.

## type `TimeError`

A field out of range, or text that is not a date/time.

**Variants**

  - `InvalidDate(Integer, Integer, Integer)`
  - `InvalidTime(Integer, Integer, Integer)`
  - `InvalidFormat(String)`

Implements [`Showable`](kex.md#trait-showable).

### Functions

#### `showValue` (from Showable)

```kex
showValue -> String
```

Shows the failure as the sentence `Time.errorMessage` writes, so `"${e}"` explains itself rather than printing the constructor.

**Returns**: the message

**Examples**

```kex
"${InvalidDate(2026, 13, 1)}"   # => "not a calendar date: 2026-13-1"
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `Time`

A time of day, with no date and no zone.

```kex
let t = Time.of(14, 3, 0).try
t.iso                  # => "14:03:00"
(t + 2.hour).iso      # => "16:03:00"
```

Arithmetic wraps within the day: there is no date to carry into. Reach for `DateTime` when the day rolling over matters.

**Fields**

  - `hour` : [Integer](number.md#make-integer)
  - `minute` : [Integer](number.md#make-integer)
  - `second` : [Integer](number.md#make-integer)
  - `nanosecond` : [Integer](number.md#make-integer)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Functions

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Renders the time structurally, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered time

#### `showValue` (from Showable)

```kex
showValue -> String
```

Renders the time in ISO form, so interpolation and `IO.printLine` show `14:03:00`.

**Returns**: the ISO 8601 time

**Examples**

```kex
"starts at ${Time.of(14, 3, 0).try}"   # => "starts at 14:03:00"
```

#### `secondsSinceMidnight`

```kex
secondsSinceMidnight -> Integer
```

Seconds from midnight to this time of day, ignoring the nanosecond field.

**Returns**: seconds since midnight

**Examples**

```kex
Time.of(14, 3, 0).try.secondsSinceMidnight   # => 50580
```

#### `before?`

```kex
before?(other: Time) -> Bool
```

Returns `true` when this time of day is earlier than `other`.

**Parameters**

  - `other` — the time to compare against

**Returns**: `true` when this time comes first

**Examples**

```kex
Time.of(14, 3, 0).try.before?(Time.of(15, 0, 0).try)   # => true
```

#### `after?`

```kex
after?(other: Time) -> Bool
```

Returns `true` when this time of day is later than `other`.

**Parameters**

  - `other` — the time to compare against

**Returns**: `true` when this time comes second

**Examples**

```kex
Time.of(15, 0, 0).try.after?(Time.of(14, 3, 0).try)   # => true
```

#### `+`

```kex
+(span: Duration) -> Time
```

Advances the time of day by a span, wrapping within the day.

A Time has no date to carry into, so 23:00 + 2.hour is 01:00. Reach for `DateTime` when the day rolling over is something you need to see.

Sub-second spans count: the nanoseconds carry into the seconds.

**Parameters**

  - `span` — the elapsed span to add

**Returns**: the later time of day

**Examples**

```kex
(Time.of(14, 3, 0).try + 2.hour).iso            # => "16:03:00"
(Time.of(23, 0, 0).try + 2.hour).iso            # => "01:00:00"
(Time.of(14, 3, 0).try + 500.millisecond).iso   # => "14:03:00.500"
```

#### `-`

```kex
-(span: Duration) -> Time
```

Moves the time of day back by a span, wrapping within the day.

**Parameters**

  - `span` — the elapsed span to subtract

**Returns**: the earlier time of day

**Examples**

```kex
(Time.midnight() - 1.second).iso   # => "23:59:59"
```

#### `addSeconds`

```kex
addSeconds(count: Integer) -> Time
```

The time of day `count` seconds later, wrapping within the day.

**Parameters**

  - `count` — how many seconds to add

**Returns**: the shifted time of day

**Examples**

```kex
Time.of(14, 3, 0).try.addSeconds(60).iso   # => "14:04:00"
```

#### `addMinutes`

```kex
addMinutes(count: Integer) -> Time
```

The time of day `count` minutes later, wrapping within the day.

**Parameters**

  - `count` — how many minutes to add

**Returns**: the shifted time of day

**Examples**

```kex
Time.of(14, 3, 0).try.addMinutes(30).iso   # => "14:33:00"
```

#### `addHours`

```kex
addHours(count: Integer) -> Time
```

The time of day `count` hours later, wrapping within the day.

**Parameters**

  - `count` — how many hours to add

**Returns**: the shifted time of day

**Examples**

```kex
Time.of(23, 0, 0).try.addHours(2).iso   # => "01:00:00"
```

#### `until`

```kex
until(other: Time) -> Duration
```

Elapsed time from this time of day to `other`, within the same day.

Negative when `other` is earlier. Sub-second precision is kept.

**Parameters**

  - `other` — the time to measure to

**Returns**: the elapsed span

**Examples**

```kex
Time.of(14, 3, 0).try.until(Time.of(15, 3, 0).try).wholeMinutes   # => 60
```

#### `iso`

```kex
iso -> String
```

The time of day as ISO 8601 text, with fractional seconds only when they are non-zero.

**Returns**: the ISO 8601 time

**Examples**

```kex
Time.of(14, 3, 0).try.iso              # => "14:03:00"
Time.of(14, 3, 0, 123456789).try.iso   # => "14:03:00.123456789"
```

#### `compareTo`

```kex
compareTo(other: Time) -> Ordering
```

Orders this time of day against another, nanoseconds included.

**Parameters**

  - `other` — the time to compare against

**Returns**: `Less`, `Equal` or `Greater`

**Examples**

```kex
Time.of(14, 3, 0).try.compareTo(Time.of(15, 0, 0).try)   # => Less
```

### Defined in other modules

  - [DateFormat](date_format.md#make-time): [`to`](date_format.md#time-to)

## module `Time`

Building times of day, controlling the clock in tests, and the calendar arithmetic the other time files are written on.

### `of`

```kex
of(hour: Integer, minute: Integer, second: Integer, nanosecond: Integer) -> Result<Time, TimeError>
```

Builds a validated time of day.

Every field is range-checked, so a `Time` you hold is always a real time. Leap seconds are not modeled, so a second of 60 is rejected.

**Parameters**

  - `hour` — the hour, 0 through 23
  - `minute` — the minute, 0 through 59
  - `second` — the second, 0 through 59
  - `nanosecond` — the sub-second part, 0 through 999999999; omitted for 0

**Returns**: the time, or why it is not one

**Examples**

```kex
Time.of(14, 3, 0).map { |t| t.iso }   # => Ok("14:03:00")
Time.of(25, 0, 0)                     # => Error(InvalidTime(25, 0, 0))
```

_With sub-second precision_

```kex
Time.of(14, 3, 0, 123456789).map { |t| t.iso }
# => Ok("14:03:00.123456789")
```

### `midnight`

```kex
midnight -> Time
```

Midnight, 00:00:00. The start of a day.

**Returns**: 00:00:00

**Examples**

```kex
Time.midnight().iso                   # => "00:00:00"
(Time.midnight() - 1.second).iso     # => "23:59:59"
```

### `fromSecondsSinceMidnight`

```kex
fromSecondsSinceMidnight(count: Integer, nanosecond: Integer) -> Time
```

Builds a time of day from a count of seconds since midnight.

Wraps, so 86400 is midnight again and -1 is 23:59:59, which is what makes it total where `Time.of` is fallible.

Declared before the two-argument form: the interpreter resolves an overloaded module function to its LAST definition regardless of arity, so a delegating overload has to come first or it recurses into itself.

**Parameters**

  - `count` — seconds since midnight; wraps outside 0..86399
  - `nanosecond` — the sub-second part; omitted for 0

**Returns**: the time of day

**Examples**

```kex
Time.fromSecondsSinceMidnight(50580).iso   # => "14:03:00"
Time.fromSecondsSinceMidnight(86400).iso   # => "00:00:00"
Time.fromSecondsSinceMidnight(-1).iso      # => "23:59:59"
```

### `parse`

```kex
parse(text: String) -> Result<Time, TimeError>
```

Parses an ISO 8601 time of day.

Accepts `14:03`, `14:03:00`, or `14:03:00.123456789`. Anything else is `InvalidFormat`.

**Parameters**

  - `text` — the text to parse

**Returns**: the time, or why it could not be read

**Examples**

```kex
Time.parse("14:03").map { |t| t.iso }   # => Ok("14:03:00")
Time.parse("xx")                        # => Error(InvalidFormat("xx"))
```

### `now` (foul)

```kex
now -> Time
```

The current time of day, in this machine's zone.

Reads `Time.Clock` like everything else here does, so it is pinned by replacing that capability in a test.

**Returns**: the current time of day

**Examples**

```kex
Time.now().iso   # => "14:03:00"
```

### `utcNow` (foul)

```kex
utcNow -> Time
```

The current time of day in UTC, whatever this machine's zone is.

**Returns**: the current UTC time of day

**Examples**

```kex
Time.utcNow().iso   # => "12:03:00"
```

### `parseOffset`

```kex
parseOffset(text: String) -> Result<Duration, TimeError>
```

Parses an ISO 8601 zone designator into an offset.

Accepts `Z`, +`02:00`, `-05:30`, or the empty string (all meaning UTC for the first and last).

**Parameters**

  - `text` — the zone designator

**Returns**: the offset, or why it could not be read

**Examples**

```kex
Time.parseOffset("+02:00").map { |d| d.wholeSeconds }   # => Ok(7200)
Time.parseOffset("Z").map { |d| d.wholeSeconds }        # => Ok(0)
```

### `momentAt` (foul)

```kex
momentAt(nanos: Integer) -> DateTime
```

The civil instant `nanos` after the Unix epoch, in this machine's zone as it stands at that instant. Foul because the zone is ambient.

**Parameters**

  - `nanos` — nanoseconds since the Unix epoch

**Returns**: that instant, in the local zone

### `nanosOf`

```kex
nanosOf(moment: DateTime) -> Integer
```

Nanoseconds since the Unix epoch for a civil datetime. A plain function rather than a `DateTime` function: on BEAM a function named `epochNanos` flattens onto the same name as the `DateTime.epochNanos()` module function, and the arity-0 one wins: silently, answering for the host clock instead of for `moment`.

### `leapYear?`

```kex
leapYear?(year: Integer) -> Bool
```

Public because the `make` blocks below live at file level and reach them by qualification; they are equally useful on their own.

Returns `true` when `year` is a leap year in the proleptic Gregorian calendar.

**Parameters**

  - `year` — the calendar year

**Returns**: `true` for a leap year

**Examples**

```kex
Time.leapYear?(2024)   # => true
Time.leapYear?(1900)   # => false
Time.leapYear?(2000)   # => true
```

### `daysInMonth`

```kex
daysInMonth(year: Integer, month: Integer) -> Result<Integer, TimeError>
```

The number of days in a month.

Year first, matching `Date.of(year, month, day)` and every other date-shaped signature in this file.

Returns `Error(InvalidDate(year, month, 1))` when the month is outside 1 through 12.

**Parameters**

  - `year` — the calendar year, which decides February's length
  - `month` — the month, 1 through 12

**Returns**: the day count, or why the month is not one

**Examples**

```kex
Time.daysInMonth(2024, 2)   # => Ok(29)
Time.daysInMonth(2023, 2)   # => Ok(28)
Time.daysInMonth(2026, 13)  # => Error(InvalidDate(2026, 13, 1))
```

### `daysInValidMonth`

```kex
daysInValidMonth(year: Integer, month: Integer) -> Integer
```

The number of days in a month, with the range check already done.

Every caller inside this file has a month it built or validated itself. Use `daysInMonth` for a month that came from outside.

**Parameters**

  - `year` — the calendar year
  - `month` — the month, assumed to be 1 through 12

**Returns**: the day count

**Examples**

```kex
Time.daysInValidMonth(2024, 2)   # => 29
```

### `daysFromCivil`

```kex
daysFromCivil(year: Integer, month: Integer, day: Integer) -> Integer
```

The number of days from 1970-01-01 to a calendar date, negative before it.

Howard Hinnant's civil-calendar algorithms: exact across the whole proleptic Gregorian range, and they need only truncating integer division: the semantics Kex's `/` already has.

**Parameters**

  - `year` — the calendar year
  - `month` — the month, 1 through 12
  - `day` — the day of the month

**Returns**: days since the Unix epoch

**Examples**

```kex
Time.daysFromCivil(1970, 1, 1)   # => 0
Time.daysFromCivil(2026, 7, 30)  # => 20664
```

### `civilFromDays`

```kex
civilFromDays(epochDay: Integer) -> Date
```

The calendar date a count of days since 1970-01-01 lands on. The inverse of `daysFromCivil`.

**Parameters**

  - `epochDay` — days since the Unix epoch

**Returns**: the calendar date

**Examples**

```kex
Time.civilFromDays(0).iso       # => "1970-01-01"
Time.civilFromDays(20664).iso   # => "2026-07-30"
```

### `weekdayFromEpochDay`

```kex
weekdayFromEpochDay(epochDay: Integer) -> Weekday
```

The weekday a count of days since 1970-01-01 falls on.

**Parameters**

  - `epochDay` — days since the Unix epoch

**Returns**: the day of the week

**Examples**

```kex
Time.weekdayFromEpochDay(0)   # => Thursday   (1970-01-01 was a Thursday)
```

### `weekdayNumber`

```kex
weekdayNumber -> Integer
```

The ISO number of a weekday: Monday is 1, Sunday is 7.

`weekday.number` is the readable way to ask.

**Parameters**

  - `weekday` — the day of the week

**Returns**: its ISO number, 1 through 7

**Examples**

```kex
Time.weekdayNumber(Monday)   # => 1
```

### `weekdayName`

```kex
weekdayName -> String
```

The English name of a weekday.

`weekday.name` is the readable way to ask.

**Parameters**

  - `weekday` — the day of the week

**Returns**: its English name

**Examples**

```kex
Time.weekdayName(Sunday)   # => "Sunday"
```

### `errorMessage`

```kex
errorMessage -> String
```

Renders a `TimeError` as a sentence for the user.

A plain function rather than an `Errorable` implementation: a `message` function here joins the same BEAM dispatcher as ParseError's `message` FIELD and breaks it (spec/record_field_method_collision.kex).

**Parameters**

  - `error` — the failure to describe

**Returns**: the message to show

**Examples**

```kex
Time.errorMessage(InvalidDate(2026, 13, 1))
# => "not a calendar date: 2026-13-1"
```

_Reporting a rejected date_

```kex
match Date.parse(input) do
  Ok(date) => IO.printLine(date.iso)
  Error(e) => IO.printError(Time.errorMessage(e))
end
```

### `formatDate`

```kex
formatDate(value: Date) -> String
```

### `formatDateTime`

```kex
formatDateTime(value: DateTime) -> String
```

### `formatTime`

```kex
formatTime(value: Time) -> String
```

### `formatFraction`

```kex
formatFraction(nanosecond: Integer) -> String
```

Fractional seconds, in the 3/6/9-digit groupings ISO 8601 output conventionally uses, whichever is the shortest that loses nothing. A whole second renders no fraction at all, so `14:03:00` is unchanged.

Without this the nanosecond field was kept on the value and compared, but never rendered: `Time.parse("14:03:00.5")` and `Time.parse("14:03:00")` produced different values that printed identically, and every parse/format round-trip silently dropped sub-second precision.

### `formatOffset`

```kex
formatOffset(offset: Duration) -> String
```

±HH:MM, the shape an ISO 8601 offset takes. UTC renders as "Z".

### `withNanosecond`

```kex
withNanosecond(moment: DateTime, nanosecond: Integer) -> DateTime
```

### `floorDiv`

```kex
floorDiv(value: Integer, divisor: Integer) -> Integer
```

Kex's `/` truncates toward zero; instants before the epoch need the floor.

### `truncatedBy`

```kex
truncatedBy(seconds: Float, unit: Float) -> Integer
```

A Duration holds Float seconds, so it is rounded to the nanosecond, the finest unit it names, before truncating: 7.nanosecond is 7e-9 seconds, and dividing that by 1e-9 directly gives 6.999... and so 6.

### `pad2`

```kex
pad2(value: Integer) -> String
```

### `padTo`

```kex
padTo(value: Integer, width: Integer) -> String
```

Left-pad with zeros to a fixed width. A value already that wide is left alone rather than truncated: losing digits would be worse than a field one character too long.

### `padYear`

```kex
padYear(value: Integer) -> String
```

Years keep four digits where they fit; ISO 8601 has no fixed spelling beyond that, so wider years render as-is.

### `digitsIn`

```kex
digitsIn(fragment: String, whole: String) -> Result<Integer, TimeError>
```

Digits, with the failure reported against the WHOLE input rather than the fragment that failed: `Time.parse("2:03 pm")` should complain about "2:03 pm", not about "03 pm".

### `fixedDigitsIn`

```kex
fixedDigitsIn(fragment: String, width: Integer, whole: String) -> Result<Integer, TimeError>
```

The same, for a field ISO 8601 writes at a fixed width: "14", never "2".

### `digitsToInteger`

```kex
digitsToInteger(text: String) -> Result<Integer, TimeError>
```

ASCII digits only: Integer.parse would also take a sign or surrounding space, and none of those belongs inside an ISO 8601 field.

### `parseFraction`

```kex
parseFraction(text: String, whole: String) -> Result<Integer, TimeError>
```

".5" is 500000000ns: the digits are padded out to nanosecond scale. The caller has seen the ".", so an empty fraction is malformed, not zero.

### `splitOffset`

```kex
splitOffset(text: String) -> [String]
```

Splits "14:03:00+02:00" into its time and offset halves. A missing offset reads as UTC, matching what a zero offset formats back to.

## module `Time.Clock`

The clock: the one place the current instant comes from.

Anything that asks what time it is (`Time.now`, `Date.today`, `DateTime.utcNow`) reads this, so replacing it replaces the whole calendar. It is a capability, so the replacement is for a lexical region: it reaches every call made from the region and every process spawned in it, it nests, and it cannot outlive its block. This is what makes code that calls `Date.today()` testable:

```kex
with Time.Clock = Mock.Clock { at: DateTime.parse("2026-07-30T14:03:00Z").try } do
  Date.today().iso   # "2026-07-30", always
end
```

`now` is the whole interface. Its answer carries the zone as its offset, so one member covers both ambient inputs: what time it is, and where. `Mock.Clock` is the ready-made stand-in; any record that implements `now` is one too.

### `now` (foul)

```kex
now -> DateTime
```

The current instant, in this machine's zone as it stands right now.

**Returns**: the current instant

## extends `Weekday`

More functions for [`Weekday`](date.md#type-weekday), added by this module.

### `number`

```kex
number -> Integer
```

This weekday's ISO number: Monday is 1, Sunday is 7.

**Returns**: the ISO number, 1 through 7

**Examples**

```kex
Monday.number   # => 1
Sunday.number   # => 7
```

### `name`

```kex
name -> String
```

This weekday's English name.

**Returns**: the name

**Examples**

```kex
Date.of(2026, 7, 30).try.weekday.name   # => "Thursday"
```

### `weekend?`

```kex
weekend? -> Bool
```

Returns `true` for Saturday and Sunday.

**Returns**: `true` on a weekend day

**Examples**

```kex
Saturday.weekend?   # => true
Monday.weekend?     # => false
```

_Counting working days in a range_

```kex
days.count { |d| !d.weekday.weekend? }
```
