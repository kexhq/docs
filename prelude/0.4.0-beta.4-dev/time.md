---
package: prelude
version: "0.4.0-beta.4-dev"
source: time.kex
title: Time
entities:
  - { kind: type, name: "Weekday" }
  - { kind: type, name: "TimeError" }
  - { kind: record, name: "Date" }
  - { kind: record, name: "Time" }
  - { kind: record, name: "DateTime" }
  - { kind: record, name: "Period" }
  - { kind: module, name: "Time" }
  - { kind: module, name: "Date" }
  - { kind: module, name: "DateTime" }
  - { kind: make, name: "Integer" }
  - { kind: make, name: "Float" }
  - { kind: make, name: "Duration" }
  - { kind: module, name: "Duration" }
  - { kind: module, name: "Period" }
  - { kind: make, name: "Period" }
  - { kind: make, name: "Date" }
  - { kind: make, name: "Time" }
  - { kind: make, name: "DateTime" }
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
Duration  fixed elapsed time, a count of seconds   (36.hours, 10.days)
Period    a calendar step, resolved by the calendar (1.months, 2.years)
```

`36.hours` is always 129600 seconds; `1.months` is however long that particular month turns out to be. So `date + 1.months` clamps January 31st to the last day of February, while `date + 30.days` counts thirty days.

A time `Measure` such as `5.sec` is a third thing and deliberately NOT a Duration: a Measure describes a measurement, a Duration describes elapsed time. The plural `5.seconds` builds the Duration.

Values are built through their own module and used through methods:

```kex
let due = Date.of(2026, 7, 30).try           # Result<Date, TimeError>
due.weekday.name                             # "Thursday"
(due + 10.days).iso                          # "2026-08-09"
(due + 1.months).iso                         # "2026-08-30"
Time.now().iso                               # "2026-07-30T14:03:00+02:00"
```

Anything that reads the clock is mockable: see the test clock section in `module Time` for `Time.frozenAt`.

Zones are fixed offsets: UTC, an explicit `+02:00`, or whatever this machine's zone resolves to at a given instant. Named IANA zones and their DST rules are not modeled: `Time.now()` asks the host for the offset in effect at that moment, so it is right now, but it cannot say what the offset WILL be for some future local time.

The records and the two ADTs stay at file level so `make` blocks, callers, and every module here can see them.

## type `Weekday`

Weekday names in ISO order (Monday is day 1).

**Variants**

  - `Monday`
  - `Tuesday`
  - `Wednesday`
  - `Thursday`
  - `Friday`
  - `Saturday`
  - `Sunday`



## type `TimeError`

A field out of range, or text that is not a date/time.

**Variants**

  - `InvalidDate(Integer, Integer, Integer)`
  - `InvalidTime(Integer, Integer, Integer)`
  - `InvalidFormat(String)`



## record `Date`

A calendar day: a year, a month and a day, with no time and no zone.

```kex
let due = Date.of(2026, 7, 30).try
due.iso              # => "2026-07-30"
due.weekday.name     # => "Thursday"
(due + 10.days).iso  # => "2026-08-09"
```

Build one with `Date.of`, which validates, rather than with the record literal, which does not.

**Fields**

  - `year` : [Integer](number.md#make-integer)
  - `month` : [Integer](number.md#make-integer)
  - `day` : [Integer](number.md#make-integer)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Methods

#### `inspectValue` (from Inspectable)

```kex
inspectValue(colors: Bool) -> String
```

Renders the date structurally, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered date

#### `showValue` (from Showable)

```kex
showValue : String
```

Renders the date in ISO form, so interpolation and `IO.printLine` show `2026-07-30`.

**Returns**: the ISO 8601 date

**Examples**

```kex
"due ${Date.of(2026, 7, 30).try}"   # => "due 2026-07-30"
```

#### `epochDay`

```kex
epochDay : Integer
```

Days since 1970-01-01, negative before it.

The date's identity as a number: comparison and day arithmetic go through it.

**Returns**: days since the Unix epoch

**Examples**

```kex
Date.of(1970, 1, 1).try.epochDay    # => 0
Date.of(2026, 7, 30).try.epochDay   # => 20664
```

#### `weekday`

```kex
weekday : Weekday
```

The day of the week this date falls on.

**Returns**: the day of the week

**Examples**

```kex
Date.of(2026, 7, 30).try.weekday        # => Thursday
Date.of(2026, 7, 30).try.weekday.name   # => "Thursday"
```

#### `dayOfYear`

```kex
dayOfYear : Integer
```

The day's position in its year, counting from 1 on January 1st.

**Returns**: the day of the year

**Examples**

```kex
Date.of(2026, 1, 1).try.dayOfYear    # => 1
Date.of(2026, 7, 30).try.dayOfYear   # => 211
```

#### `leapYear?`

```kex
leapYear? : Bool
```

Returns `true` when this date falls in a leap year.

**Returns**: `true` in a leap year

**Examples**

```kex
Date.of(2024, 1, 1).try.leapYear?   # => true
Date.of(2026, 1, 1).try.leapYear?   # => false
```

#### `daysInMonth`

```kex
daysInMonth : Integer
```

The number of days in THIS date's month.

No Result: a Date's month is in range by construction, unlike `Time.daysInMonth`'s two loose integers.

**Returns**: the length of this month

**Examples**

```kex
Date.of(2024, 2, 1).try.daysInMonth   # => 29
Date.of(2026, 7, 1).try.daysInMonth   # => 31
```

#### `+`

```kex
+(span: Duration) -> Date
```

Advances the date by a fixed span, whole days only.

A Duration with a sub-day remainder truncates toward zero, so +date + 36.hours+ advances exactly one day. Use a `Period` when the calendar should get a say.

**Parameters**

  - `span` — the elapsed span to add

**Returns**: the later date

**Examples**

```kex
(Date.of(2026, 7, 30).try + 10.days).iso   # => "2026-08-09"
(Date.of(2026, 7, 30).try + 36.hours).iso  # => "2026-07-31"
```

#### `-`

```kex
-(span: Duration) -> Date
```

Moves the date back by a fixed span, whole days only.

**Parameters**

  - `span` — the elapsed span to subtract

**Returns**: the earlier date

**Examples**

```kex
(Date.of(2026, 7, 30).try - 10.days).iso   # => "2026-07-20"
```

#### `addDays`

```kex
addDays(count: Integer) -> Date
```

The date `count` days later. A negative count moves backwards.

**Parameters**

  - `count` — how many days to add

**Returns**: the shifted date

**Examples**

```kex
Date.of(2026, 7, 30).try.addDays(1).iso    # => "2026-07-31"
Date.of(2026, 7, 30).try.addDays(-1).iso   # => "2026-07-29"
```

#### `addWeeks`

```kex
addWeeks(count: Integer) -> Date
```

The date `count` weeks later. A negative count moves backwards.

**Parameters**

  - `count` — how many weeks to add

**Returns**: the shifted date

**Examples**

```kex
Date.of(2026, 7, 30).try.addWeeks(2).iso   # => "2026-08-13"
```

#### `addMonths`

```kex
addMonths(count: Integer) -> Date
```

No `date.tomorrow`/`date.yesterday` methods: on BEAM a make-block method flattens onto the same name as the `Date.tomorrow()`/`Date.yesterday()` module functions above and one of the two has to win. The module functions win: `Date.tomorrow()` is the spelling people reach for, and `date.addDays(1)` already says the rest.

The date `count` calendar months later, with the day clamped into the target month.

One month after January 31st is the last day of February, not March 3rd. A negative count moves backwards.

**Parameters**

  - `count` — how many months to add

**Returns**: the shifted date

**Examples**

```kex
Date.of(2026, 1, 31).try.addMonths(1).iso    # => "2026-02-28"
Date.of(2026, 7, 30).try.addMonths(-1).iso   # => "2026-06-30"
```

#### `addYears`

```kex
addYears(count: Integer) -> Date
```

The date `count` calendar years later, with the day clamped: February 29th plus one year is February 28th.

**Parameters**

  - `count` — how many years to add

**Returns**: the shifted date

**Examples**

```kex
Date.of(2024, 2, 29).try.addYears(1).iso   # => "2025-02-28"
```

#### `startOfMonth`

```kex
startOfMonth : Date
```

The first day of this date's month.

**Returns**: the first of the month

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfMonth.iso   # => "2026-07-01"
```

#### `endOfMonth`

```kex
endOfMonth : Date
```

The last day of this date's month, whatever its length.

**Returns**: the last of the month

**Examples**

```kex
Date.of(2026, 7, 30).try.endOfMonth.iso   # => "2026-07-31"
Date.of(2024, 2, 1).try.endOfMonth.iso    # => "2024-02-29"
```

#### `startOfYear`

```kex
startOfYear : Date
```

January 1st of this date's year.

**Returns**: the first of the year

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfYear.iso   # => "2026-01-01"
```

#### `endOfYear`

```kex
endOfYear : Date
```

December 31st of this date's year.

**Returns**: the last of the year

**Examples**

```kex
Date.of(2026, 7, 30).try.endOfYear.iso   # => "2026-12-31"
```

#### `startOfWeek`

```kex
startOfWeek : Date
```

The Monday of this date's week.

The week runs Monday to Sunday, matching the ISO weekday numbering `weekday.number` reports.

**Returns**: the Monday of this week

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfWeek.iso   # => "2026-07-27"
```

#### `endOfWeek`

```kex
endOfWeek : Date
```

The Sunday of this date's week.

**Returns**: the Sunday of this week

**Examples**

```kex
Date.of(2026, 7, 30).try.endOfWeek.iso   # => "2026-08-02"
```

#### `daysUntil`

```kex
daysUntil(other: Date) -> Integer
```

Whole days from this date to `other`, negative when `other` is earlier.

**Parameters**

  - `other` — the date to measure to

**Returns**: the number of days

**Examples**

```kex
Date.of(2026, 7, 30).try.daysUntil(Date.of(2026, 8, 9).try)   # => 10
Date.of(2026, 8, 9).try.daysUntil(Date.of(2026, 7, 30).try)   # => -10
```

#### `until`

```kex
until(other: Date) -> Duration
```

The span from this date to `other`, as a `Duration` of whole days.

**Parameters**

  - `other` — the date to measure to

**Returns**: the elapsed span

**Examples**

```kex
Date.of(2026, 7, 30).try.until(Date.of(2026, 8, 9).try).wholeDays   # => 10
```

#### `monthsUntil`

```kex
monthsUntil(other: Date) -> Integer
```

Whole calendar months from this date to `other`, negative when `other` is earlier.

Truncated, not rounded: a partial month does not count, so January 15th to February 14th is 0 months.

The count is the exact inverse of `addMonths`, which is why the correction below asks `addMonths` rather than comparing day-of-month fields: January 31st plus one month IS February 28th, so January 31st to February 28th is one month, even though 28 < 31. Comparing the day fields answers 0 there and contradicts the addition this same file performs.

**Parameters**

  - `other` — the date to measure to

**Returns**: the number of whole months

**Examples**

```kex
Date.of(2026, 1, 15).try.monthsUntil(Date.of(2026, 2, 14).try)   # => 0
Date.of(2026, 1, 31).try.monthsUntil(Date.of(2026, 2, 28).try)   # => 1
```

#### `yearsUntil`

```kex
yearsUntil(other: Date) -> Integer
```

Whole calendar years from this date to `other`, negative when `other` is earlier. Truncated, like `monthsUntil`.

This is how to compute an age.

**Parameters**

  - `other` — the date to measure to

**Returns**: the number of whole years

**Examples**

```kex
Date.of(2020, 1, 1).try.yearsUntil(Date.of(2026, 7, 30).try)   # => 6
```

_Someone's age today_

```kex
born.yearsUntil(Date.today())
```

#### `before?`

```kex
before?(other: Date) -> Bool
```

Returns `true` when this date is earlier than `other`.

**Parameters**

  - `other` — the date to compare against

**Returns**: `true` when this date comes first

**Examples**

```kex
Date.of(2026, 7, 30).try.before?(Date.of(2026, 8, 1).try)   # => true
```

#### `after?`

```kex
after?(other: Date) -> Bool
```

Returns `true` when this date is later than `other`.

**Parameters**

  - `other` — the date to compare against

**Returns**: `true` when this date comes second

**Examples**

```kex
Date.of(2026, 8, 1).try.after?(Date.of(2026, 7, 30).try)   # => true
```

#### `compareTo`

```kex
compareTo(other: Date) -> Ordering
```

Orders this date against another.

**Parameters**

  - `other` — the date to compare against

**Returns**: `Less`, `Equal` or `Greater`

**Examples**

```kex
Date.of(2026, 7, 30).try.compareTo(Date.of(2026, 8, 1).try)   # => Less
```

_Sorting dates_

```kex
dates.sort { |a, b| a.compareTo(b) == Less }
```

#### `iso`

```kex
iso : String
```

The date as ISO 8601 text, `2026-07-30`.

**Returns**: the ISO 8601 date

**Examples**

```kex
Date.of(2026, 7, 30).try.iso   # => "2026-07-30"
```

#### `at`

```kex
at(time: Time, offset: Duration) -> DateTime
```

This date at a given time of day and offset, as a `DateTime`.

**Parameters**

  - `time` — the time of day
  - `offset` — the offset from UTC

**Returns**: the instant

**Examples**

```kex
Date.of(2026, 7, 30).try.at(Time.of(9, 0, 0).try, Duration.zero()).iso
# => "2026-07-30T09:00:00Z"
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `Time`

A time of day, with no date and no zone.

```kex
let t = Time.of(14, 3, 0).try
t.iso                  # => "14:03:00"
(t + 2.hours).iso      # => "16:03:00"
```

Arithmetic wraps within the day: there is no date to carry into. Reach for `DateTime` when the day rolling over matters.

**Fields**

  - `hour` : [Integer](number.md#make-integer)
  - `minute` : [Integer](number.md#make-integer)
  - `second` : [Integer](number.md#make-integer)
  - `nanosecond` : [Integer](number.md#make-integer)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Methods

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
showValue : String
```

Renders the time in ISO form, so interpolation and `IO.printLine` show `14:03:00`.

**Returns**: the ISO 8601 time

**Examples**

```kex
"starts at ${Time.of(14, 3, 0).try}"   # => "starts at 14:03:00"
```

#### `secondsSinceMidnight`

```kex
secondsSinceMidnight : Integer
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

A Time has no date to carry into, so 23:00 + 2.hours is 01:00. Reach for `DateTime` when the day rolling over is something you need to see.

The nanosecond field rides along untouched: `wholeSeconds` truncates the span, so a sub-second Duration shifts nothing.

**Parameters**

  - `span` — the elapsed span to add

**Returns**: the later time of day

**Examples**

```kex
(Time.of(14, 3, 0).try + 2.hours).iso    # => "16:03:00"
(Time.of(23, 0, 0).try + 2.hours).iso    # => "01:00:00"
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
(Time.midnight() - 1.seconds).iso   # => "23:59:59"
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
iso : String
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

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `DateTime`

An instant: a calendar date, a time of day, and a fixed offset from UTC.

```kex
let m = DateTime.parse("2026-07-30T14:03:00+02:00").try
m.iso        # => "2026-07-30T14:03:00+02:00"
m.utc.iso    # => "2026-07-30T12:03:00Z"
```

Two `DateTime` values that name the same instant compare equal whatever offsets they are written at: comparison goes through `epochSeconds`.

**Fields**

  - `date` : [Date](#record-date)
  - `time` : [Time](#record-time)
  - `offset` : [Duration](units.md#record-duration)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Methods

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
showValue : String
```

Renders the instant in ISO form, so interpolation and `IO.printLine` show +2026-07-30T14:03:00+02:00+.

**Returns**: the ISO 8601 instant

**Examples**

```kex
"logged at ${DateTime.utcNow()}"   # => "logged at 2026-07-30T12:03:00Z"
```

#### `epochSeconds`

```kex
epochSeconds : Integer
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
weekday : Weekday
```

The day of the week this instant falls on, at its own offset.

No `year`/`hour`/... shorthands here: a method named after a record field makes `value.year` inside a module function dispatch to it on BEAM and fail with function_clause. Reach through `.date` and `.time`.

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
utc : DateTime
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
(DateTime.parse("2026-07-30T14:03:00Z").try + 90.minutes).iso
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
(DateTime.utcNow() - 24.hours).iso   # yesterday, same wall clock
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
if started.until(DateTime.utcNow()).longerThan?(30.seconds)
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
iso : String
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

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## record `Period`

A calendar span. Months and years have no fixed length: February is 28 days or 29, a year 365 or 366, so they cannot live in a `Duration`, which is a count of seconds and nothing else. A Period carries the calendar fields themselves and lets the calendar resolve them:

```kex
Date.of(2026, 1, 31).try + 1.months        # 2026-02-28, not 2026-03-03
Date.of(2024, 2, 29).try + 1.years         # 2025-02-28
```

Use a Duration for elapsed time (`36.hours` is always 129600 seconds) and a Period for calendar steps (`1.months` is however long that month is).

**Fields**

  - `years` : [Integer](number.md#make-integer)
  - `months` : [Integer](number.md#make-integer)
  - `days` : [Integer](number.md#make-integer)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Methods

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
showValue : String
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
(Period.of(1, 2, 3) + 1.years).iso   # => "P2Y2M3D"
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
(Period.of(1, 2, 3) - 1.years).iso   # => "P2M3D"
```

#### `negated`

```kex
negated : Period
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
zero? : Bool
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
totalMonths : Integer
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
normalized : Period
```

The same span with excess months carried into years.

14 months becomes 1 year 2 months. Days are left alone: there is no fixed number of them in a month to carry by.

**Returns**: the normalised span

**Examples**

```kex
14.months.normalized.iso   # => "P1Y2M"
```

#### `iso`

```kex
iso : String
```

The span as an ISO 8601 duration, `P1Y2M3D`.

A zero period is `P0D`, the shortest spelling the grammar allows: `P` alone is not valid.

**Returns**: the ISO 8601 duration

**Examples**

```kex
Period.of(1, 2, 3).iso   # => "P1Y2M3D"
Period.zero().iso        # => "P0D"
2.months.iso             # => "P2M"
```

### From [`Showable`](kex.md#trait-showable)

  - [`to`](kex.md#showable-to) — 

## module `Time`

Building times of day, controlling the clock in tests, and the calendar arithmetic the rest of this file is written on.

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
midnight : Time
```

Midnight, 00:00:00. The start of a day.

**Returns**: 00:00:00

**Examples**

```kex
Time.midnight().iso                   # => "00:00:00"
(Time.midnight() - 1.seconds).iso     # => "23:59:59"
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

### `now`

```kex
now : Time
```

The current time of day, in this machine's zone.

Reads the same clock primitive everything else here does, so it is pinned by `Time.frozenAt` in a test.

**Returns**: the current time of day

**Examples**

```kex
Time.now().iso   # => "14:03:00"
```

### `utcNow`

```kex
utcNow : Time
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

### `nanosOf`

```kex
nanosOf(moment: DateTime) -> Integer
```

Anything that asks what time it is: `Time.now`, `Date.today`, `DateTime.utcNow`: reads one primitive, so pinning that primitive pins the whole calendar. This is what makes code that calls `Date.today()` testable: freeze the clock, assert against a date you chose.

```kex
Time.freeze(DateTime.parse("2026-07-30T14:03:00Z").try)
Date.today().iso                            # "2026-07-30": always
Time.release()
```

The clock is global, not per-process: a frozen clock stays frozen inside spawned processes, which is the only behavior that matches a real one. `release` is not automatic, so a test that freezes must also release: otherwise every later test in the run inherits the frozen clock.

Nanoseconds since the Unix epoch for a civil datetime. A plain function rather than a `DateTime` method: on BEAM a method named `epochNanos` flattens onto the same name as the `DateTime.epochNanos()` module function, and the arity-0 one wins: silently, answering for the host clock instead of for `moment`.

### `CLOCK_MIN_NANOS` (constant)

The clock counts nanoseconds in a 64-bit integer, on both backends and in the host clock they stand in for. That is the whole of the instants it can name: 1677-09-21 to 2262-04-11. A Kex Integer keeps going past that: it promotes to arbitrary precision, so a date outside the range produces a number the clock cannot hold, and the check below is what stops it being truncated into some other instant entirely.



### `CLOCK_MAX_NANOS` (constant)



### `settable?`

```kex
settable?(moment: DateTime) -> Bool
```

### `freeze`

```kex
freeze(moment: DateTime) -> Result<DateTime, TimeError>
```

Pins the clock: every reading returns this exact instant until `release`.

This is what makes code that calls `Date.today()` testable. Returns the moment it pinned, so `Time.freeze(m).try` both sets the clock and fails loudly on an instant the clock cannot represent.

Prefer `Time.frozenAt`, which releases for you: a test that fails between a `freeze` and its `release` leaves the clock frozen for everything after it.

**Parameters**

  - `moment` — the instant to pin the clock to

**Returns**: the pinned moment, or why it could not be

**Examples**

```kex
Time.freeze(DateTime.parse("2026-07-30T14:03:00Z").try)
Date.utcToday().iso   # => "2026-07-30", always
Time.release()
```

### `travel`

```kex
travel(moment: DateTime) -> Result<DateTime, TimeError>
```

Moves the clock to an instant and lets it run from there.

Readings advance normally, they just start somewhere else. Use this over `freeze` when the code under test measures elapsed time: a frozen clock makes every interval zero.

**Parameters**

  - `moment` — the instant to start the clock from

**Returns**: the moment set, or why it could not be

**Examples**

```kex
Time.travel(DateTime.parse("2026-07-30T14:03:00Z").try)
Time.release()
```

### `frozenAt`

```kex
frozenAt(moment: DateTime, body: Block) -> Result<A, TimeError>
```

Freezes the clock for the length of `body`, then releases it.

This is the form to reach for: `freeze` and `release` have to be paired by hand, and a test that returns early (or fails an assertion) between them leaves the clock frozen for every test that runs after it.

Result carries whatever `body` returned. An instant the clock cannot represent is an Error, and then the clock is never touched and the body never runs.

Not nestable: `release` restores the HOST clock, not whatever control was in effect on entry, so an inner scope ending un-freezes the outer one too.

**Parameters**

  - `moment` — the instant to pin the clock to
  - `body` — what to run with the clock frozen

**Returns**: whatever `body` returned, or why the clock could not be set

### `travellingFrom`

```kex
travellingFrom(moment: DateTime, body: Block) -> Result<A, TimeError>
```

Runs `body` with the clock started at `moment`, then releases it.

The same scoping as `frozenAt`, for `travel`: readings start at `moment` and advance normally, and the clock is released when `body` ends.

**Parameters**

  - `moment` — the instant to start the clock from
  - `body` — what to run with the clock moved

**Returns**: whatever `body` returned, or why the clock could not be set

**Examples**

_Measuring elapsed time from a known start_

```kex
Time.travellingFrom(DateTime.parse("2026-07-30T14:03:00Z").try) do
  runTheThing()
end.try
```

### `release`

```kex
release : Void
```

Returns the clock to the host's.

Not automatic: a test that froze the clock must also release it, or every later test in the run inherits the frozen clock. `frozenAt` and `travellingFrom` do this for you.

**Examples**

```kex
after do
  Time.release()
end
```

### `controlled?`

```kex
controlled? : Bool
```

Returns `true` while `freeze` or `travel` is in effect.

**Returns**: `true` when the clock is under test control

**Examples**

```kex
Time.controlled?()   # => false on the host clock
```

### `frozen?`

```kex
frozen? : Bool
```

Returns `true` while `freeze` is in effect: not merely `travel`.

**Returns**: `true` when the clock is frozen

**Examples**

```kex
Time.frozen?()   # => false on the host clock
```

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

A month outside 1..12 has no answer, so this is a Result rather than an Integer: the old version fell through its month tests and returned 28, which quietly turned `Time.daysInMonth(1, 2026)`: the arguments the wrong way round: into a plausible-looking wrong number.

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
weekdayNumber(weekday: Weekday) -> Integer
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
weekdayName(weekday: Weekday) -> String
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
errorMessage(error: TimeError) -> String
```

Renders a `TimeError` as a sentence for the user.

A plain function rather than an `Errorable` implementation: a `message` method here joins the same BEAM dispatcher as ParseError's `message` FIELD and breaks it (spec/record_field_method_collision.kex).

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

### `digitsToInteger`

```kex
digitsToInteger(text: String) -> Result<Integer, TimeError>
```

### `parseFraction`

```kex
parseFraction(text: String, whole: String) -> Result<Integer, TimeError>
```

".5" is 500000000ns: the digits are padded out to nanosecond scale.

### `splitOffset`

```kex
splitOffset(text: String) -> [String]
```

Splits "14:03:00+02:00" into its time and offset halves. A missing offset reads as UTC, matching what a zero offset formats back to.

## type `Weekday`

### `number`

```kex
number : Integer
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
name : String
```

This weekday's English name.

**Returns**: the name

**Examples**

```kex
Date.of(2026, 7, 30).try.weekday.name   # => "Thursday"
```

### `weekend?`

```kex
weekend? : Bool
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



## module `Date`

Building calendar dates, and asking what today is.

### `of`

```kex
of(year: Integer, month: Integer, day: Integer) -> Result<Date, TimeError>
```

Builds a validated calendar date.

The month and the day are both range-checked, and the day is checked against that month's actual length, so February 30th is an `Error`, and a `Date` you hold is always a real day. The record literal `Date { ... }` bypasses this, so prefer it for anything derived from input.

**Parameters**

  - `year` — the calendar year
  - `month` — the month, 1 through 12
  - `day` — the day of the month

**Returns**: the date, or why it is not one

**Examples**

```kex
Date.of(2026, 7, 30).map { |d| d.iso }   # => Ok("2026-07-30")
Date.of(2026, 13, 1)                     # => Error(InvalidDate(2026, 13, 1))
Date.of(2023, 2, 29)                     # => Error(InvalidDate(2023, 2, 29))
```

_Taking the date or failing loudly_

```kex
let due = Date.of(year, month, day).try
```

### `fromEpochDay`

```kex
fromEpochDay(day: Integer) -> Date
```

The calendar date a count of days since 1970-01-01 lands on, negative before it.

**Parameters**

  - `day` — days since the Unix epoch

**Returns**: the calendar date

**Examples**

```kex
Date.fromEpochDay(0).iso       # => "1970-01-01"
Date.fromEpochDay(20664).iso   # => "2026-07-30"
```

### `parse`

```kex
parse(text: String) -> Result<Date, TimeError>
```

Parses an ISO 8601 calendar date, `2026-07-30`.

The result is validated as well as parsed, so a well-formed but impossible date is `InvalidDate` rather than `InvalidFormat`.

**Parameters**

  - `text` — the text to parse

**Returns**: the date, or why it could not be read

**Examples**

```kex
Date.parse("2026-07-30").map { |d| d.iso }   # => Ok("2026-07-30")
Date.parse("nope")                           # => Error(InvalidFormat("nope"))
Date.parse("2026-02-30")                     # => Error(InvalidDate(2026, 2, 30))
```

### `now`

```kex
now : Date
```

Today's date, in this machine's zone.

`Date.today()` reads better in most code; `now` exists so every type in this file answers the same question the same way.

**Returns**: today's date

**Examples**

```kex
Date.now().iso   # => "2026-07-30"
```

### `today`

```kex
today : Date
```

Today's date, in this machine's zone.

Pinned by `Time.frozenAt` in a test, like everything else that reads the clock.

**Returns**: today's date

**Examples**

```kex
Date.today().iso   # => "2026-07-30"
```

_Testing code that depends on today_

```kex
Time.frozenAt(DateTime.parse("2026-07-30T00:00:00Z").try) do
  Assert.equal(Date.utcToday().iso, "2026-07-30")
end.try
```

### `tomorrow`

```kex
tomorrow : Date
```

The day after today, in this machine's zone.

**Returns**: tomorrow's date

**Examples**

```kex
Date.tomorrow().iso   # => "2026-07-31"
```

### `yesterday`

```kex
yesterday : Date
```

The day before today, in this machine's zone.

**Returns**: yesterday's date

**Examples**

```kex
Date.yesterday().iso   # => "2026-07-29"
```

### `utcNow`

```kex
utcNow : Date
```

Today's date in UTC, whatever this machine's zone is.

**Returns**: today's UTC date

**Examples**

```kex
Date.utcNow().iso   # => "2026-07-30"
```

### `utcToday`

```kex
utcToday : Date
```

Today's date in UTC. The same as `Date.utcNow()`, under the name that reads better.

**Returns**: today's UTC date

**Examples**

```kex
Date.utcToday().iso   # => "2026-07-30"
```

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

### `now`

```kex
now : DateTime
```

The current instant, in this machine's zone as it stands right now.

The offset is the one in effect at this instant, so it is right today. Named IANA zones are not modeled, so it cannot say what the offset WILL be for some future local time.

**Returns**: the current instant

**Examples**

```kex
DateTime.now().iso   # => "2026-07-30T14:03:00+02:00"
```

### `utcNow`

```kex
utcNow : DateTime
```

The current instant, at UTC.

The form to prefer when the value is stored, compared or transmitted: there is no zone to disagree about.

**Returns**: the current instant, at UTC

**Examples**

```kex
DateTime.utcNow().iso   # => "2026-07-30T12:03:00Z"
```

### `epochNanos`

```kex
epochNanos : Integer
```

Nanoseconds since the Unix epoch, straight from the clock.

The rawest reading available, and the right one for measuring a short interval: no calendar work happens on the way.

**Returns**: nanoseconds since the Unix epoch

**Examples**

_Timing a piece of work_

```kex
let started = DateTime.epochNanos()
doTheThing()
let elapsedMs = (DateTime.epochNanos() - started) / 1000000
```

## extends `Integer`

More methods of [`Integer`](number.md#make-integer), added by this module.

The plural spellings build a Duration; the singular ones from units.kex build a time Measure. `5.seconds` is an elapsed span, `5.sec` a measurement.

### `milliseconds`

```kex
milliseconds : Duration
```

This many milliseconds, as a `Duration`.

**Returns**: the elapsed span

**Examples**

```kex
500.milliseconds.wholeMilliseconds   # => 500
```

### `seconds`

```kex
seconds : Duration
```

This many seconds, as a `Duration`.

Note the plural: `5.seconds` is an elapsed span, while `5.sec` from `units.kex` is a measurement.

**Returns**: the elapsed span

**Examples**

```kex
30.seconds.wholeSeconds   # => 30
```

### `minutes`

```kex
minutes : Duration
```

This many minutes, as a `Duration`.

**Returns**: the elapsed span

**Examples**

```kex
90.minutes.wholeHours   # => 1
```

### `hours`

```kex
hours : Duration
```

This many hours, as a `Duration`.

**Returns**: the elapsed span

**Examples**

```kex
36.hours.wholeDays   # => 1
```

### `days`

```kex
days : Duration
```

This many days, as a `Duration`: a fixed 86400 seconds each.

Use `Period.days` when the calendar should get a say.

**Returns**: the elapsed span

**Examples**

```kex
(Date.of(2026, 7, 30).try + 10.days).iso   # => "2026-08-09"
```

### `weeks`

```kex
weeks : Duration
```

This many weeks, as a `Duration`: a fixed 604800 seconds each.

**Returns**: the elapsed span

**Examples**

```kex
2.weeks.wholeDays   # => 14
```

### `months`

```kex
months : Period
```

This many calendar months, as a `Period`.

A calendar span, not a Duration: see the `Period` record above. `4.weeks` and `1.months` are deliberately different things: the first is exactly 28 days, the second is one calendar month, however long that turns out to be.

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2026, 7, 30).try + 1.months).iso   # => "2026-08-30"
```

_The calendar clamps a day that does not exist_

```kex
(Date.of(2026, 1, 31).try + 1.months).iso   # => "2026-02-28"
```

### `years`

```kex
years : Period
```

This many calendar years, as a `Period`.

**Returns**: the calendar span

**Examples**

```kex
(Date.of(2024, 2, 29).try + 1.years).iso   # => "2025-02-28"
```

## extends `Float`

More methods of [`Float`](number.md#make-float), added by this module.

The same `Duration` constructors on `Float`, for fractional spans: `1.5.hours`, `0.25.seconds`.

### `milliseconds`

```kex
milliseconds : Duration
```

This many milliseconds, as a `Duration`.

**Returns**: the elapsed span

### `seconds`

```kex
seconds : Duration
```

This many seconds, as a `Duration`.

**Returns**: the elapsed span

**Examples**

```kex
0.25.seconds.wholeMilliseconds   # => 250
```

### `minutes`

```kex
minutes : Duration
```

This many minutes, as a `Duration`.

**Returns**: the elapsed span

### `hours`

```kex
hours : Duration
```

This many hours, as a `Duration`.

**Returns**: the elapsed span

**Examples**

```kex
1.5.hours.wholeMinutes   # => 90
```

### `days`

```kex
days : Duration
```

This many days, as a `Duration`: a fixed 86400 seconds each.

**Returns**: the elapsed span

### `weeks`

```kex
weeks : Duration
```

This many weeks, as a `Duration`: a fixed 604800 seconds each.

**Returns**: the elapsed span

## extends `Duration`

More methods of [`Duration`](units.md#record-duration), added by this module.

### `+`

```kex
+(other: Duration) -> Duration
```

Adds two spans.

**Parameters**

  - `other` — the span to add

**Returns**: the total

**Examples**

```kex
(90.minutes + 30.minutes).wholeHours   # => 2
```

### `-`

```kex
-(other: Duration) -> Duration
```

Subtracts a span. The result may be negative.

**Parameters**

  - `other` — the span to subtract

**Returns**: the difference

**Examples**

```kex
(1.hours - 90.minutes).negative?   # => true
```

### `negated`

```kex
negated : Duration
```

The same span with its sign flipped.

**Returns**: the negated span

**Examples**

```kex
90.minutes.negated.negative?   # => true
```

### `*`

```kex
*(factor: Number) -> Duration
```

Multiplies the span by a plain number.

`3 * 1.days` is not the same call because the receiver has to be the Duration, so it is spelled `1.days * 3`.

**Parameters**

  - `factor` — the factor to multiply by

**Returns**: the scaled span

**Examples**

```kex
(90.minutes * 2).wholeHours   # => 3
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
(90.minutes / 2).wholeMinutes   # => 45
```

### `abs`

```kex
abs : Duration
```

The span's magnitude, discarding its direction.

**Returns**: the absolute span

**Examples**

```kex
(1.hours - 90.minutes).abs.wholeMinutes   # => 30
```

### `zero?`

```kex
zero? : Bool
```

Returns `true` when the span is exactly zero.

**Returns**: `true` for a zero span

**Examples**

```kex
Duration.zero().zero?   # => true
```

### `negative?`

```kex
negative? : Bool
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
positive? : Bool
```

Returns `true` when the span points forwards.

**Returns**: `true` for a positive span

**Examples**

```kex
90.minutes.positive?   # => true
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
30.minutes.shorterThan?(1.hours)   # => true
```

_Enforcing a timeout_

```kex
if started.until(DateTime.utcNow()).longerThan?(30.seconds)
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
90.minutes.longerThan?(1.hours)   # => true
```

### `wholeMilliseconds`

```kex
wholeMilliseconds : Integer
```

The whole milliseconds in the span, truncated toward zero.

**Returns**: the milliseconds

**Examples**

```kex
500.milliseconds.wholeMilliseconds   # => 500
```

### `wholeSeconds`

```kex
wholeSeconds : Integer
```

The whole seconds in the span, truncated toward zero.

**Returns**: the seconds

**Examples**

```kex
Duration.hours(2).wholeSeconds   # => 7200
```

### `wholeMinutes`

```kex
wholeMinutes : Integer
```

The whole minutes in the span, truncated toward zero.

**Returns**: the minutes

**Examples**

```kex
90.minutes.wholeMinutes   # => 90
1.5.hours.wholeMinutes    # => 90
```

### `wholeHours`

```kex
wholeHours : Integer
```

The whole hours in the span, truncated toward zero. A partial hour does not count.

**Returns**: the hours

**Examples**

```kex
90.minutes.wholeHours   # => 1
```

### `wholeDays`

```kex
wholeDays : Integer
```

The whole days in the span, truncated toward zero.

This is what +date + span+ uses, which is why +date + 36.hours+ advances exactly one day.

**Returns**: the days

**Examples**

```kex
36.hours.wholeDays   # => 1
2.weeks.wholeDays    # => 14
```

### `wholeWeeks`

```kex
wholeWeeks : Integer
```

The whole weeks in the span, truncated toward zero.

**Returns**: the weeks

**Examples**

```kex
14.days.wholeWeeks   # => 2
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
90.minutes.compareTo(60.minutes)   # => Greater
```

_Sorting by length_

```kex
spans.sort { |a, b| a.compareTo(b) == Less }
```

## module `Duration`

Building elapsed spans, and UTC offsets.

### `zero`

```kex
zero : Duration
```

A span of no time at all. Also the UTC offset.

**Returns**: the zero span

**Examples**

```kex
Duration.zero().zero?   # => true
date.at(time, Duration.zero()).iso   # => "...T09:00:00Z"
```

### `milliseconds`

```kex
milliseconds(count: Number) -> Duration
```

A span of `count` milliseconds.

**Parameters**

  - `count` — how many milliseconds

**Returns**: the elapsed span

**Examples**

```kex
Duration.milliseconds(1500).wholeSeconds   # => 1
```

### `seconds`

```kex
seconds(count: Number) -> Duration
```

A span of `count` seconds.

**Parameters**

  - `count` — how many seconds

**Returns**: the elapsed span

**Examples**

```kex
Duration.seconds(90).wholeMinutes   # => 1
```

### `minutes`

```kex
minutes(count: Number) -> Duration
```

A span of `count` minutes.

**Parameters**

  - `count` — how many minutes

**Returns**: the elapsed span

**Examples**

```kex
Duration.minutes(90).wholeHours   # => 1
```

### `hours`

```kex
hours(count: Number) -> Duration
```

A span of `count` hours.

**Parameters**

  - `count` — how many hours

**Returns**: the elapsed span

**Examples**

```kex
Duration.hours(2).wholeSeconds   # => 7200
```

### `days`

```kex
days(count: Number) -> Duration
```

A span of `count` days, each a fixed 86400 seconds.

**Parameters**

  - `count` — how many days

**Returns**: the elapsed span

**Examples**

```kex
Duration.days(2).wholeHours   # => 48
```

### `weeks`

```kex
weeks(count: Number) -> Duration
```

A span of `count` weeks, each a fixed 604800 seconds.

**Parameters**

  - `count` — how many weeks

**Returns**: the elapsed span

**Examples**

```kex
Duration.weeks(2).wholeDays   # => 14
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

## module `Period`

Building calendar spans.

### `zero`

```kex
zero : Period
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
