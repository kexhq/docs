---
package: prelude
version: "0.4.0-rc.4-dev"
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

Calendar dates, times of day, and instants.

There are three calendar types, each a plain record:

```kex
Date      a calendar day, with no time or zone      (2026-07-30)
Time      a time of day, with no date or zone       (14:03:00)
DateTime  both, plus a fixed offset from UTC        (2026-07-30T14:03:00+02:00)
```

and two kinds of span:

```kex
Duration  a fixed amount of elapsed time            (36.hour, 10.day)
Period    a calendar step, sized by the calendar    (1.month, 2.year)
```

`36.hour` is always 129600 seconds, while `1.month` is as long as the month it lands in. So +date + 1.month+ takes January 31st to the last day of February, and +date + 30.day+ counts thirty days.

```kex
let due = Date.of(2026, 7, 30).try
due.weekday.name            # => "Thursday"
(due + 10.day).iso          # => "2026-08-09"
(due + 1.month).iso         # => "2026-08-30"
Time.now().iso              # the current time, such as "14:03:00"
```

Everything that reads the clock goes through the `Time.Clock` capability, so a test can fix the time with `with Time.Clock = Mock.Clock { at: ... }`.

Zones are fixed offsets: UTC, an explicit one such as `02:00`, or the offset this machine's zone has at a given instant. Named IANA zones and their daylight-saving rules are not modeled. `Time.now()` gets the right offset for the present moment, but nothing here can say what the offset will be at some future local time.

`Date` and `Weekday` are in date.kex, `DateTime` in date_time.kex, `Period` in period.kex, `Duration`'s functions in duration.kex and pattern formatting in date_format.kex. This file has `Time`, the clock, `TimeError`, and the calendar arithmetic the others use.

## type `TimeError`

The error for a date or time field out of range, or for text that is not a date or time.

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

Renders the error as the sentence `Time.errorMessage` gives, so `"${e}"` reads as a message.

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
(t + 2.hour).iso       # => "16:03:00"
```

Arithmetic wraps around midnight, since there is no date to carry into. Use `DateTime` when crossing into the next day matters.

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

Renders the time in ISO 8601 form, which is what interpolation and `IO.printLine` show.

**Returns**: the ISO 8601 time

**Examples**

```kex
"starts at ${Time.of(14, 3, 0).try}"   # => "starts at 14:03:00"
```

#### `secondsSinceMidnight`

```kex
secondsSinceMidnight -> Integer
```

Returns the number of whole seconds from midnight to this time of day.

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

**Returns**: `true` when this time comes after `other`

**Examples**

```kex
Time.of(15, 0, 0).try.after?(Time.of(14, 3, 0).try)   # => true
```

#### `+`

```kex
+(span: Duration) -> Time
```

Returns the time of day `span` later, wrapping around midnight.

A `Time` has no date to carry into, so 23:00 plus 2 hours is 01:00. Use `DateTime` to see the day change. Fractions of a second carry into the seconds.

**Parameters**

  - `span` — the span to add

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

Returns the time of day `span` earlier, wrapping around midnight.

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

Returns the time of day `count` seconds later, wrapping around midnight.

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

Returns the time of day `count` minutes later, wrapping around midnight.

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

Returns the time of day `count` hours later, wrapping around midnight.

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

Returns the time from this time of day to `other` on the same day.

It is negative when `other` is earlier, and keeps fractions of a second.

**Parameters**

  - `other` — the time to measure to

**Returns**: the span between them

**Examples**

```kex
Time.of(14, 3, 0).try.until(Time.of(15, 3, 0).try).wholeMinutes   # => 60
```

#### `iso`

```kex
iso -> String
```

Returns the time of day as ISO 8601 text, with a fraction of a second only when it is not zero.

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

Compares this time of day with `other`, nanoseconds included.

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

Functions for building times of day, the clock capability, and the calendar arithmetic the other time types use.

### `of`

```kex
of(hour: Integer, minute: Integer, second: Integer, nanosecond: Integer) -> Result<Time, TimeError>
```

Builds a time of day, checking every field.

A second of 60 is rejected, since leap seconds are not modeled.

**Parameters**

  - `hour` — the hour, 0 through 23
  - `minute` — the minute, 0 through 59
  - `second` — the second, 0 through 59
  - `nanosecond` — the fraction of a second, 0 through 999999999; 0 if omitted

**Returns**: the time, or an `InvalidTime` error

**Examples**

```kex
Time.of(14, 3, 0).map { |t| t.iso }   # => Ok("14:03:00")
Time.of(25, 0, 0)                     # => Error(InvalidTime(25, 0, 0))
```

_With a fraction of a second_

```kex
Time.of(14, 3, 0, 123456789).map { |t| t.iso }
# => Ok("14:03:00.123456789")
```

### `midnight`

```kex
midnight -> Time
```

Returns midnight, 00:00:00.

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

The one-argument form is declared first: the interpreter resolves an overloaded module function to its last definition regardless of arity, so a delegating overload placed second would call itself.

Builds a time of day from a number of seconds since midnight.

The count wraps around the day, so 86400 is midnight again and -1 is 23:59:59. Unlike `Time.of`, it cannot fail.

**Parameters**

  - `count` — seconds since midnight
  - `nanosecond` — the fraction of a second; 0 if omitted

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

Parses an ISO 8601 time of day: `14:03`, `14:03:00` or `14:03:00.123456789`.

Each field must have two digits. Anything else is an `InvalidFormat` error, and an out-of-range field is `InvalidTime`.

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

Returns the current time of day in this machine's zone.

It reads `Time.Clock`, so a test can fix it by replacing that capability.

**Returns**: the current time of day

**Examples**

```kex
Time.now().iso   # such as "14:03:00"
```

### `utcNow` (foul)

```kex
utcNow -> Time
```

Returns the current time of day in UTC.

**Returns**: the current UTC time of day

**Examples**

```kex
Time.utcNow().iso   # such as "12:03:00"
```

### `parseOffset`

```kex
parseOffset(text: String) -> Result<Duration, TimeError>
```

Parses an ISO 8601 zone designator, such as `Z`, `02:00` or -05:30, into an offset from UTC.

`Z` and the empty string both mean UTC. Otherwise the text must be a sign and two-digit hours and minutes, separated by a colon.

**Parameters**

  - `text` — the zone designator

**Returns**: the offset, or an `InvalidFormat` error

**Examples**

```kex
Time.parseOffset("+02:00").map { |d| d.wholeSeconds }   # => Ok(7200)
Time.parseOffset("-05:30").map { |d| d.wholeSeconds }   # => Ok(-19800)
Time.parseOffset("Z").map { |d| d.wholeSeconds }        # => Ok(0)
```

### `momentAt` (foul)

```kex
momentAt(nanos: Integer) -> DateTime
```

Returns the instant `nanos` nanoseconds after the Unix epoch, with the offset this machine's zone has at that instant.

It is `foul` because the machine's zone is outside the program.

**Parameters**

  - `nanos` — nanoseconds since the Unix epoch

**Returns**: that instant, in the local zone

### `nanosOf`

```kex
nanosOf(moment: DateTime) -> Integer
```

A plain function, not a DateTime function: on BEAM a function named epochNanos would share its name with the DateTime.epochNanos() module function, and the arity-0 one would win, reading the host clock instead of moment.

Returns the number of nanoseconds from the Unix epoch to `moment`.

### `leapYear?`

```kex
leapYear?(year: Integer) -> Bool
```

The functions below are public because the make blocks at file level call them, and they are useful on their own too.

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

Returns the number of days in a month of a given year.

The year comes first, as in `Date.of(year, month, day)`. A month outside 1 through 12 gives `Error(InvalidDate(year, month, 1))`.

**Parameters**

  - `year` — the calendar year, which decides February's length
  - `month` — the month, 1 through 12

**Returns**: the number of days, or an `InvalidDate` error

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

Returns the number of days in a month that is known to be 1 through 12.

Use `daysInMonth` for a month from outside the program.

**Parameters**

  - `year` — the calendar year
  - `month` — the month, which must be 1 through 12

**Returns**: the number of days

**Examples**

```kex
Time.daysInValidMonth(2024, 2)   # => 29
```

### `daysFromCivil`

```kex
daysFromCivil(year: Integer, month: Integer, day: Integer) -> Integer
```

Returns the number of days from 1970-01-01 to a calendar date, negative for earlier dates.

It uses Howard Hinnant's algorithms, which are exact across the whole proleptic Gregorian calendar.

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

Returns the date a number of days after 1970-01-01; the inverse of `daysFromCivil`.

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

Returns the weekday of the date a number of days after 1970-01-01.

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

Returns the ISO number of a weekday: 1 for Monday through 7 for Sunday.

`weekday.number` reads better.

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

Returns the English name of a weekday.

`weekday.name` reads better.

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

A plain function, not an Errorable implementation: a message function here would share BEAM's dispatcher with the message field of PatternError and break it (spec/record_field_method_collision.kex).

Returns a `TimeError` as a sentence for a person to read.

**Parameters**

  - `error` — the error to describe

**Returns**: the message

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

Formats a fraction of a second for ISO 8601 output: 3, 6 or 9 digits, whichever is the shortest that loses nothing, with a leading `.`. A fraction of 0 gives `""`, so `14:03:00` has no fraction.

### `formatOffset`

```kex
formatOffset(offset: Duration) -> String
```

Formats an offset from UTC as ISO 8601 `±HH:MM`, or `Z` for UTC.

### `withNanosecond`

```kex
withNanosecond(moment: DateTime, nanosecond: Integer) -> DateTime
```

### `truncatedBy`

```kex
truncatedBy(seconds: Float, unit: Float) -> Integer
```

Returns how many whole +unit+s fit in `seconds`.

Both are rounded to the nanosecond first, since a `Duration` holds Float seconds: 7 nanoseconds is 7e-9 seconds, and dividing that by 1e-9 gives 6.999..., which would truncate to 6.

### `pad2`

```kex
pad2(value: Integer) -> String
```

### `padTo`

```kex
padTo(value: Integer, width: Integer) -> String
```

Pads `value` with leading zeros to `width` digits. A wider value is left as it is, not cut.

### `padYear`

```kex
padYear(value: Integer) -> String
```

Formats a year with at least four digits. ISO 8601 sets no width for other years, so they are written as they are.

### `digitsIn`

```kex
digitsIn(fragment: String, whole: String) -> Result<Integer, TimeError>
```

Reads `fragment` as ASCII digits. On failure, the error names `whole`, the full input: `Time.parse("2:03 pm")` should report "2:03 pm", not "03 pm".

### `fixedDigitsIn`

```kex
fixedDigitsIn(fragment: String, width: Integer, whole: String) -> Result<Integer, TimeError>
```

Reads `fragment` as exactly `width` ASCII digits, as `digitsIn` does. ISO 8601 fields have a fixed width: "14", never "2".

### `digitsToInteger`

```kex
digitsToInteger(text: String) -> Result<Integer, TimeError>
```

Reads text of ASCII digits only. Unlike `Integer.parse`, it rejects a sign, which has no place inside an ISO 8601 field.

### `parseFraction`

```kex
parseFraction(text: String, whole: String) -> Result<Integer, TimeError>
```

Reads the digits after a decimal point as nanoseconds: "5" is 500000000. Empty text, or more than nine digits, is an `InvalidFormat` error.

### `splitOffset`

```kex
splitOffset(text: String) -> [String]
```

Splits text such as "14:03:00+02:00" into the time and the offset. With no offset, the offset part is "Z", for UTC.

## module `Time.Clock`

The clock, which every function that needs the current instant reads.

`Time.now`, `Date.today` and `DateTime.utcNow` all read it, so replacing it changes what all of them see. The replacement applies to a block: it reaches every call made inside the block and every process started there, it can be nested, and it ends with the block. That makes code that calls `Date.today()` testable:

```kex
with Time.Clock = Mock.Clock { at: DateTime.parse("2026-07-30T14:03:00Z").try } do
  Date.today().iso   # always "2026-07-30"
end
```

`now` is its only function. The instant it returns carries the local offset, so it also says which zone the machine is in. `Mock.Clock` is a ready-made replacement, and any record that implements `now` can be one.

### `now` (foul)

```kex
now -> DateTime
```

Returns the current instant, with this machine's current UTC offset.

**Returns**: the current instant

## extends `Weekday`

More functions for [`Weekday`](date.md#type-weekday), added by this module.

### `number`

```kex
number -> Integer
```

Returns the weekday's ISO number: 1 for Monday through 7 for Sunday.

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

Returns the weekday's English name.

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
