---
package: prelude
version: "0.4.0-alpha"
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

## type `Weekday`

Calendar dates, wall-clock times, and instants.

Three civil types, each a plain record:

```kex
Date      a calendar day, no time and no zone       (2026-07-30)
Time      a time of day, no date and no zone        (14:03:00)
DateTime  both, plus a fixed offset from UTC        (2026-07-30T14:03:00`02:00)
```

Two span types connect them, and which one you want depends on whether the calendar gets a say:

```kex
Duration  fixed elapsed time, a count of seconds   (36.hours, 10.days)
Period    a calendar step, resolved by the calendar (1.months, 2.years)
```

`36.hours` is always 129600 seconds; `1.months` is however long that particular month turns out to be. So `date ` 1.months` clamps January 31st to the last day of February, while `date ` 30.days` counts thirty days.

A time `Measure` such as `5.sec` is a third thing and deliberately NOT a Duration: a Measure describes a measurement, a Duration describes elapsed time. The plural `5.seconds` builds the Duration.

Values are built through their own module and used through methods:

```kex
let due = Date.of(2026, 7, 30).try           # Result<Date, TimeError>
due.weekday.name                             # "Thursday"
(due ` 10.days).iso                          # "2026-08-09"
(due ` 1.months).iso                         # "2026-08-30"
Time.now().iso                               # "2026-07-30T14:03:00`02:00"
```

Anything that reads the clock is mockable: see the test clock section in `module Time` for `Time.frozenAt`.

Zones are fixed offsets: UTC, an explicit `+02:00`, or whatever this machine's zone resolves to at a given instant. Named IANA zones and their DST rules are not modeled: `Time.now()` asks the host for the offset in effect at that moment, so it is right now, but it cannot say what the offset WILL be for some future local time.

The records and the two ADTs stay at file level so `make` blocks, callers, and every module here can see them.

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
(due ` 10.days).iso  # => "2026-08-09"
```

Build one with `Date.of+, which validates, rather than with the record literal, which does not.

**Fields**

  - `year` : Integer
  - `month` : Integer
  - `day` : Integer

## record `Time`

A time of day, with no date and no zone.

```kex
let t = Time.of(14, 3, 0).try
t.iso                  # => "14:03:00"
(t ` 2.hours).iso      # => "16:03:00"
```

Arithmetic wraps within the day: there is no date to carry into. Reach for `DateTime+ when the day rolling over matters.

**Fields**

  - `hour` : Integer
  - `minute` : Integer
  - `second` : Integer
  - `nanosecond` : Integer

## record `DateTime`

An instant: a calendar date, a time of day, and a fixed offset from UTC.

```kex
let m = DateTime.parse("2026-07-30T14:03:00`02:00").try
m.iso        # => "2026-07-30T14:03:00`02:00"
m.utc.iso    # => "2026-07-30T12:03:00Z"
```

Two `DateTime` values that name the same instant compare equal whatever offsets they are written at: comparison goes through `epochSeconds`.

**Fields**

  - `date` : Date
  - `time` : Time
  - `offset` : Duration

## record `Period`

A calendar span. Months and years have no fixed length: February is 28 days or 29, a year 365 or 366, so they cannot live in a `Duration`, which is a count of seconds and nothing else. A Period carries the calendar fields themselves and lets the calendar resolve them:

```kex
Date.of(2026, 1, 31).try ` 1.months        # 2026-02-28, not 2026-03-03
Date.of(2024, 2, 29).try ` 1.years         # 2025-02-28
```

Use a Duration for elapsed time (`36.hours` is always 129600 seconds) and a Period for calendar steps (`1.months` is however long that month is).

**Fields**

  - `years` : Integer
  - `months` : Integer
  - `days` : Integer

## module `Time`

Building times of day, controlling the clock in tests, and the calendar arithmetic the rest of this file is written on.

## function `of`

Builds a validated time of day.

Every field is range-checked, so a `Time` you hold is always a real time. Leap seconds are not modeled, so a second of 60 is rejected.


```kex
of(hour, minute, second)
```


## function `midnight`

Midnight, 00:00:00. The start of a day.


```kex
midnight()
```


## function `fromSecondsSinceMidnight`

Builds a time of day from a count of seconds since midnight.

Wraps, so 86400 is midnight again and -1 is 23:59:59, which is what makes it total where `Time.of` is fallible.

Declared before the two-argument form: the interpreter resolves an overloaded module function to its LAST definition regardless of arity, so a delegating overload has to come first or it recurses into itself.


```kex
fromSecondsSinceMidnight(count)
```


## function `parse`

Parses an ISO 8601 time of day.

Accepts `14:03`, `14:03:00`, or `14:03:00.123456789`. Anything else is `InvalidFormat`.


```kex
parse(text)
```


## function `now`

The current time of day, in this machine's zone.

Reads the same clock primitive everything else here does, so it is pinned by `Time.frozenAt` in a test.


```kex
now()
```


## function `utcNow`

The current time of day in UTC, whatever this machine's zone is.


```kex
utcNow()
```


## function `parseOffset`

Parses an ISO 8601 zone designator into an offset.

Accepts `Z`, ``02:00`, `-05:30`, or the empty string (all meaning UTC for the first and last).


```kex
parseOffset(text)
```


## function `nanosOf`

Anything that asks what time it is: `Time.now`, `Date.today`, `DateTime.utcNow`: reads one primitive, so pinning that primitive pins the whole calendar. This is what makes code that calls `Date.today()` testable: freeze the clock, assert against a date you chose.

```kex
Time.freeze(DateTime.parse("2026-07-30T14:03:00Z").try)
Date.today().iso                            # "2026-07-30": always
Time.release()
```

The clock is global, not per-process: a frozen clock stays frozen inside spawned processes, which is the only behavior that matches a real one. `release` is not automatic, so a test that freezes must also release: otherwise every later test in the run inherits the frozen clock.

Nanoseconds since the Unix epoch for a civil datetime. A plain function rather than a `DateTime` method: on BEAM a method named `epochNanos` flattens onto the same name as the `DateTime.epochNanos()` module function, and the arity-0 one wins: silently, answering for the host clock instead of for `moment`.


```kex
nanosOf(moment)
```


## constant `CLOCK_MIN_NANOS`

The clock counts nanoseconds in a 64-bit integer, on both backends and in the host clock they stand in for. That is the whole of the instants it can name: 1677-09-21 to 2262-04-11. A Kex Integer keeps going past that: it promotes to arbitrary precision, so a date outside the range produces a number the clock cannot hold, and the check below is what stops it being truncated into some other instant entirely.



## constant `CLOCK_MAX_NANOS`



## function `settable?`


```kex
settable?(moment)
```


## function `freeze`

Pins the clock: every reading returns this exact instant until `release`.

This is what makes code that calls `Date.today()` testable. Returns the moment it pinned, so `Time.freeze(m).try` both sets the clock and fails loudly on an instant the clock cannot represent.

Prefer `Time.frozenAt`, which releases for you: a test that fails between a `freeze` and its `release` leaves the clock frozen for everything after it.


```kex
freeze(moment)
```


## function `travel`

Moves the clock to an instant and lets it run from there.

Readings advance normally, they just start somewhere else. Use this over `freeze` when the code under test measures elapsed time: a frozen clock makes every interval zero.


```kex
travel(moment)
```


## function `frozenAt`

Freezes the clock for the length of `body`, then releases it.

This is the form to reach for: `freeze` and `release` have to be paired by hand, and a test that returns early (or fails an assertion) between them leaves the clock frozen for every test that runs after it.

Result carries whatever `body` returned. An instant the clock cannot represent is an Error, and then the clock is never touched and the body never runs.

Not nestable: `release` restores the HOST clock, not whatever control was in effect on entry, so an inner scope ending un-freezes the outer one too.


```kex
frozenAt(moment, body)
```


## function `travellingFrom`

Runs `body` with the clock started at `moment`, then releases it.

The same scoping as `frozenAt`, for `travel`: readings start at `moment` and advance normally, and the clock is released when `body` ends.


```kex
travellingFrom(moment, body)
```


## function `release`

Returns the clock to the host's.

Not automatic: a test that froze the clock must also release it, or every later test in the run inherits the frozen clock. `frozenAt` and `travellingFrom` do this for you.


```kex
release()
```


## function `controlled?`

Returns `true` while `freeze` or `travel` is in effect.


```kex
controlled?()
```


## function `frozen?`

Returns `true` while `freeze` is in effect: not merely `travel`.


```kex
frozen?()
```


## function `leapYear?`

Public because the `make` blocks below live at file level and reach them by qualification; they are equally useful on their own.

Returns `true` when `year` is a leap year in the proleptic Gregorian calendar.


```kex
leapYear?(year)
```


## function `daysInMonth`

The number of days in a month.

Year first, matching `Date.of(year, month, day)` and every other date-shaped signature in this file.

A month outside 1..12 has no answer, so this is a Result rather than an Integer: the old version fell through its month tests and returned 28, which quietly turned `Time.daysInMonth(1, 2026)`: the arguments the wrong way round: into a plausible-looking wrong number.


```kex
daysInMonth(year, month)
```


## function `daysInValidMonth`

The number of days in a month, with the range check already done.

Every caller inside this file has a month it built or validated itself. Use `daysInMonth` for a month that came from outside.


```kex
daysInValidMonth(year, month)
```


## function `daysFromCivil`

The number of days from 1970-01-01 to a calendar date, negative before it.

Howard Hinnant's civil-calendar algorithms: exact across the whole proleptic Gregorian range, and they need only truncating integer division: the semantics Kex's `/` already has.


```kex
daysFromCivil(year, month, day)
```


## function `civilFromDays`

The calendar date a count of days since 1970-01-01 lands on. The inverse of `daysFromCivil`.


```kex
civilFromDays(epochDay)
```


## function `weekdayFromEpochDay`

The weekday a count of days since 1970-01-01 falls on.


```kex
weekdayFromEpochDay(epochDay)
```


## function `weekdayNumber`

The ISO number of a weekday: Monday is 1, Sunday is 7.

`weekday.number` is the readable way to ask.


```kex
weekdayNumber(@Monday)
```


## function `weekdayName`

The English name of a weekday.

`weekday.name` is the readable way to ask.


```kex
weekdayName(@Monday)
```


## make `Weekday`



## function `errorMessage`

Renders a `TimeError` as a sentence for the user.

A plain function rather than an `Errorable` implementation: a `message` method here joins the same BEAM dispatcher as ParseError's `message` FIELD and breaks it (spec/record_field_method_collision.kex).


```kex
errorMessage(@InvalidDate(y, m, d))
```


## function `formatDate`


```kex
formatDate(value)
```


## function `formatDateTime`


```kex
formatDateTime(value)
```


## function `formatTime`


```kex
formatTime(value)
```


## function `formatFraction`

Fractional seconds, in the 3/6/9-digit groupings ISO 8601 output conventionally uses, whichever is the shortest that loses nothing. A whole second renders no fraction at all, so `14:03:00` is unchanged.

Without this the nanosecond field was kept on the value and compared, but never rendered: `Time.parse("14:03:00.5")` and `Time.parse("14:03:00")` produced different values that printed identically, and every parse/format round-trip silently dropped sub-second precision.


```kex
formatFraction(nanosecond)
```


## function `formatOffset`

±HH:MM, the shape an ISO 8601 offset takes. UTC renders as "Z".


```kex
formatOffset(offset)
```


## function `withNanosecond`


```kex
withNanosecond(moment, nanosecond)
```


## function `floorDiv`

Kex's `/` truncates toward zero; instants before the epoch need the floor.


```kex
floorDiv(value, divisor)
```


## function `truncatedBy`


```kex
truncatedBy(seconds, unit)
```


## function `pad2`


```kex
pad2(value)
```


## function `padTo`

Left-pad with zeros to a fixed width. A value already that wide is left alone rather than truncated: losing digits would be worse than a field one character too long.


```kex
padTo(value, width)
```


## function `padYear`

Years keep four digits where they fit; ISO 8601 has no fixed spelling beyond that, so wider years render as-is.


```kex
padYear(value)
```


## function `digitsIn`

Digits, with the failure reported against the WHOLE input rather than the fragment that failed: `Time.parse("2:03 pm")` should complain about "2:03 pm", not about "03 pm".


```kex
digitsIn(fragment, whole)
```


## function `digitsToInteger`


```kex
digitsToInteger(text)
```


## function `parseFraction`

".5" is 500000000ns: the digits are padded out to nanosecond scale.


```kex
parseFraction(text, whole)
```


## function `splitOffset`

Splits "14:03:00+02:00" into its time and offset halves. A missing offset reads as UTC, matching what a zero offset formats back to.


```kex
splitOffset(text)
```


## module `Date`

Building calendar dates, and asking what today is.

## function `of`

Builds a validated calendar date.

The month and the day are both range-checked, and the day is checked against that month's actual length, so February 30th is an `Error`, and a `Date` you hold is always a real day. The record literal `Date { ... }` bypasses this, so prefer it for anything derived from input.


```kex
of(year, month, day)
```


## function `fromEpochDay`

The calendar date a count of days since 1970-01-01 lands on, negative before it.


```kex
fromEpochDay(day)
```


## function `parse`

Parses an ISO 8601 calendar date, `2026-07-30`.

The result is validated as well as parsed, so a well-formed but impossible date is `InvalidDate` rather than `InvalidFormat`.


```kex
parse(text)
```


## function `now`

Today's date, in this machine's zone.

`Date.today()` reads better in most code; `now` exists so every type in this file answers the same question the same way.


```kex
now()
```


## function `today`

Today's date, in this machine's zone.

Pinned by `Time.frozenAt` in a test, like everything else that reads the clock.


```kex
today()
```


## function `tomorrow`

The day after today, in this machine's zone.


```kex
tomorrow()
```


## function `yesterday`

The day before today, in this machine's zone.


```kex
yesterday()
```


## function `utcNow`

Today's date in UTC, whatever this machine's zone is.


```kex
utcNow()
```


## function `utcToday`

Today's date in UTC. The same as `Date.utcNow()`, under the name that reads better.


```kex
utcToday()
```


## module `DateTime`

Building instants, and asking what time it is now.

## function `of`

Combines a date, a time of day and a UTC offset into an instant.


```kex
of(date, time, offset)
```


## function `fromEpochSeconds`

The instant a count of seconds since the Unix epoch names, rendered at UTC or at the offset you give.

Declared before the two-argument form: the interpreter resolves an overloaded module function to its LAST definition regardless of arity, so a delegating overload has to come first or it recurses into itself.


```kex
fromEpochSeconds(count)
```


## function `parse`

Parses an ISO 8601 instant.

Accepts `2026-07-30T14:03:00`02:00`, the same with `Z`, or a bare civil datetime with no zone at all, which is read as UTC.


```kex
parse(text)
```


## function `now`

The current instant, in this machine's zone as it stands right now.

The offset is the one in effect at this instant, so it is right today. Named IANA zones are not modeled, so it cannot say what the offset WILL be for some future local time.


```kex
now()
```


## function `utcNow`

The current instant, at UTC.

The form to prefer when the value is stored, compared or transmitted: there is no zone to disagree about.


```kex
utcNow()
```


## function `epochNanos`

Nanoseconds since the Unix epoch, straight from the clock.

The rawest reading available, and the right one for measuring a short interval: no calendar work happens on the way.


```kex
epochNanos()
```


## make `Integer`

The plural spellings build a Duration; the singular ones from units.kex build a time Measure. `5.seconds` is an elapsed span, `5.sec` a measurement.



## make `Float`

The same `Duration` constructors on `Float`, for fractional spans: `1.5.hours`, `0.25.seconds`.



## make `Duration`


#### `+`

Adds two spans.

```kex
+(other)
```

**Returns**: `Duration` — the total

**Examples**

```kex
(90.minutes + 30.minutes).wholeHours   # => 2
```

#### `-`

Subtracts a span. The result may be negative.

```kex
-(other)
```

**Returns**: `Duration` — the difference

**Examples**

```kex
(1.hours - 90.minutes).negative?   # => true
```

#### `*`

Multiplies the span by a plain number.

`3 * 1.days` is not the same call because the receiver has to be the Duration, so it is spelled `1.days * 3`.

```kex
*(factor)
```

**Returns**: `Duration` — the scaled span

**Examples**

```kex
(90.minutes * 2).wholeHours   # => 3
```

#### `/`

Divides the span by a plain number.

```kex
/(divisor)
```

**Returns**: `Duration` — the scaled span

**Examples**

```kex
(90.minutes / 2).wholeMinutes   # => 45
```

#### `shorterThan?`

Returns `true` when this span is shorter than `other`.

Named for length rather than for order: `before?`/`after?` are about when something happened, and a Duration is not a point in time.

```kex
shorterThan?(other)
```

**Returns**: `Bool` — `true` when this span is shorter

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

#### `longerThan?`

Returns `true` when this span is longer than `other`.

```kex
longerThan?(other)
```

**Returns**: `Bool` — `true` when this span is longer

**Examples**

```kex
90.minutes.longerThan?(1.hours)   # => true
```

#### `compareTo`

Orders this span against another by length.

Delegates to `Number.compare` (algebra.kex), which orders the two Float second counts.

```kex
compareTo(other)
```

**Returns**: `Ordering` — `Less`, `Equal` or `Greater`

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

## function `zero`

A span of no time at all. Also the UTC offset.


```kex
zero()
```


## function `milliseconds`

A span of `count` milliseconds.


```kex
milliseconds(count)
```


## function `seconds`

A span of `count` seconds.


```kex
seconds(count)
```


## function `minutes`

A span of `count` minutes.


```kex
minutes(count)
```


## function `hours`

A span of `count` hours.


```kex
hours(count)
```


## function `days`

A span of `count` days, each a fixed 86400 seconds.


```kex
days(count)
```


## function `weeks`

A span of `count` weeks, each a fixed 604800 seconds.


```kex
weeks(count)
```


## function `utcOffset`

A whole-minute UTC offset, the only kind ISO 8601 can spell.

A negative hour or minute puts the whole offset west of UTC, so `utcOffset(-5, 30)` is five and a half hours behind UTC, not four and a half.


```kex
utcOffset(hours, minutes)
```


## module `Period`

Building calendar spans.

## function `zero`

A span of nothing.


```kex
zero()
```


## function `of`

A span of the given years, months and days together.


```kex
of(years, months, days)
```


## function `years`

A span of `count` calendar years.


```kex
years(count)
```


## function `months`

A span of `count` calendar months.


```kex
months(count)
```


## function `days`

A span of `count` days, as a calendar step.


```kex
days(count)
```


## function `weeks`

A span of `count` weeks, recorded as that many times seven days.


```kex
weeks(count)
```


## make `Period` implements Inspectable, Showable


#### `inspectValue`

Renders the period structurally, for debugging output.

```kex
inspectValue(colors)
```

**Returns**: `String` — the rendered period

#### `+`

Adds two calendar spans, field by field.

```kex
+(other)
```

**Returns**: `Period` — the total

**Examples**

```kex
(Period.of(1, 2, 3) + 1.years).iso   # => "P2Y2M3D"
```

#### `-`

Subtracts a calendar span, field by field. Fields may go negative.

```kex
-(other)
```

**Returns**: `Period` — the difference

**Examples**

```kex
(Period.of(1, 2, 3) - 1.years).iso   # => "P2M3D"
```

#### `*`

Multiplies every field by `factor`.

```kex
*(factor)
```

**Returns**: `Period` — the scaled span

**Examples**

```kex
(Period.of(1, 2, 3) * 2).iso   # => "P2Y4M6D"
```

## make `Date` implements Inspectable, Showable


#### `inspectValue`

Renders the date structurally, for debugging output.

```kex
inspectValue(colors)
```

**Returns**: `String` — the rendered date

#### `+`

Advances the date by a fixed span, whole days only.

A Duration with a sub-day remainder truncates toward zero, so `date ` 36.hours` advances exactly one day. Use a `Period` when the calendar should get a say.

```kex
+(span)
```

**Returns**: `Date` — the later date

**Examples**

```kex
(Date.of(2026, 7, 30).try ` 10.days).iso   # => "2026-08-09"
(Date.of(2026, 7, 30).try + 36.hours).iso  # => "2026-07-31"
```

#### `-`

Moves the date back by a fixed span, whole days only.

```kex
-(span)
```

**Returns**: `Date` — the earlier date

**Examples**

```kex
(Date.of(2026, 7, 30).try - 10.days).iso   # => "2026-07-20"
```

#### `addDays`

The date `count` days later. A negative count moves backwards.

```kex
addDays(count)
```

**Returns**: `Date` — the shifted date

**Examples**

```kex
Date.of(2026, 7, 30).try.addDays(1).iso    # => "2026-07-31"
Date.of(2026, 7, 30).try.addDays(-1).iso   # => "2026-07-29"
```

#### `addWeeks`

The date `count` weeks later. A negative count moves backwards.

```kex
addWeeks(count)
```

**Returns**: `Date` — the shifted date

**Examples**

```kex
Date.of(2026, 7, 30).try.addWeeks(2).iso   # => "2026-08-13"
```

#### `addMonths`

No `date.tomorrow`/`date.yesterday` methods: on BEAM a make-block method flattens onto the same name as the `Date.tomorrow()`/`Date.yesterday()` module functions above and one of the two has to win. The module functions win: `Date.tomorrow()` is the spelling people reach for, and `date.addDays(1)` already says the rest.

The date `count` calendar months later, with the day clamped into the target month.

One month after January 31st is the last day of February, not March 3rd. A negative count moves backwards.

```kex
addMonths(count)
```

**Returns**: `Date` — the shifted date

**Examples**

```kex
Date.of(2026, 1, 31).try.addMonths(1).iso    # => "2026-02-28"
Date.of(2026, 7, 30).try.addMonths(-1).iso   # => "2026-06-30"
```

#### `addYears`

The date `count` calendar years later, with the day clamped: February 29th plus one year is February 28th.

```kex
addYears(count)
```

**Returns**: `Date` — the shifted date

**Examples**

```kex
Date.of(2024, 2, 29).try.addYears(1).iso   # => "2025-02-28"
```

#### `daysUntil`

Whole days from this date to `other`, negative when `other` is earlier.

```kex
daysUntil(other)
```

**Returns**: `Integer` — the number of days

**Examples**

```kex
Date.of(2026, 7, 30).try.daysUntil(Date.of(2026, 8, 9).try)   # => 10
Date.of(2026, 8, 9).try.daysUntil(Date.of(2026, 7, 30).try)   # => -10
```

#### `until`

The span from this date to `other`, as a `Duration` of whole days.

```kex
until(other)
```

**Returns**: `Duration` — the elapsed span

**Examples**

```kex
Date.of(2026, 7, 30).try.until(Date.of(2026, 8, 9).try).wholeDays   # => 10
```

#### `monthsUntil`

Whole calendar months from this date to `other`, negative when `other` is earlier.

Truncated, not rounded: a partial month does not count, so January 15th to February 14th is 0 months.

The count is the exact inverse of `addMonths`, which is why the correction below asks `addMonths` rather than comparing day-of-month fields: January 31st plus one month IS February 28th, so January 31st to February 28th is one month, even though 28 < 31. Comparing the day fields answers 0 there and contradicts the addition this same file performs.

```kex
monthsUntil(other)
```

**Returns**: `Integer` — the number of whole months

**Examples**

```kex
Date.of(2026, 1, 15).try.monthsUntil(Date.of(2026, 2, 14).try)   # => 0
Date.of(2026, 1, 31).try.monthsUntil(Date.of(2026, 2, 28).try)   # => 1
```

#### `yearsUntil`

Whole calendar years from this date to `other`, negative when `other` is earlier. Truncated, like `monthsUntil`.

This is how to compute an age.

```kex
yearsUntil(other)
```

**Returns**: `Integer` — the number of whole years

**Examples**

```kex
Date.of(2020, 1, 1).try.yearsUntil(Date.of(2026, 7, 30).try)   # => 6
```
_Someone's age today_

```kex
born.yearsUntil(Date.today())
```

#### `before?`

Returns `true` when this date is earlier than `other`.

```kex
before?(other)
```

**Returns**: `Bool` — `true` when this date comes first

**Examples**

```kex
Date.of(2026, 7, 30).try.before?(Date.of(2026, 8, 1).try)   # => true
```

#### `after?`

Returns `true` when this date is later than `other`.

```kex
after?(other)
```

**Returns**: `Bool` — `true` when this date comes second

**Examples**

```kex
Date.of(2026, 8, 1).try.after?(Date.of(2026, 7, 30).try)   # => true
```

#### `compareTo`

Orders this date against another.

```kex
compareTo(other)
```

**Returns**: `Ordering` — `Less`, `Equal` or `Greater`

**Examples**

```kex
Date.of(2026, 7, 30).try.compareTo(Date.of(2026, 8, 1).try)   # => Less
```
_Sorting dates_

```kex
dates.sort { |a, b| a.compareTo(b) == Less }
```

#### `at`

This date at a given time of day and offset, as a `DateTime`.

```kex
at(time, offset)
```

**Returns**: `DateTime` — the instant

**Examples**

```kex
Date.of(2026, 7, 30).try.at(Time.of(9, 0, 0).try, Duration.zero()).iso
# => "2026-07-30T09:00:00Z"
```

## make `Time` implements Inspectable, Showable


#### `inspectValue`

Renders the time structurally, for debugging output.

```kex
inspectValue(colors)
```

**Returns**: `String` — the rendered time

#### `before?`

Returns `true` when this time of day is earlier than `other`.

```kex
before?(other)
```

**Returns**: `Bool` — `true` when this time comes first

**Examples**

```kex
Time.of(14, 3, 0).try.before?(Time.of(15, 0, 0).try)   # => true
```

#### `after?`

Returns `true` when this time of day is later than `other`.

```kex
after?(other)
```

**Returns**: `Bool` — `true` when this time comes second

**Examples**

```kex
Time.of(15, 0, 0).try.after?(Time.of(14, 3, 0).try)   # => true
```

#### `+`

Advances the time of day by a span, wrapping within the day.

A Time has no date to carry into, so 23:00 ` 2.hours is 01:00. Reach for `DateTime` when the day rolling over is something you need to see.

The nanosecond field rides along untouched: `wholeSeconds` truncates the span, so a sub-second Duration shifts nothing.

```kex
+(span)
```

**Returns**: `Time` — the later time of day

**Examples**

```kex
(Time.of(14, 3, 0).try ` 2.hours).iso    # => "16:03:00"
(Time.of(23, 0, 0).try + 2.hours).iso    # => "01:00:00"
```

#### `-`

Moves the time of day back by a span, wrapping within the day.

```kex
-(span)
```

**Returns**: `Time` — the earlier time of day

**Examples**

```kex
(Time.midnight() - 1.seconds).iso   # => "23:59:59"
```

#### `addSeconds`

The time of day `count` seconds later, wrapping within the day.

```kex
addSeconds(count)
```

**Returns**: `Time` — the shifted time of day

**Examples**

```kex
Time.of(14, 3, 0).try.addSeconds(60).iso   # => "14:04:00"
```

#### `addMinutes`

The time of day `count` minutes later, wrapping within the day.

```kex
addMinutes(count)
```

**Returns**: `Time` — the shifted time of day

**Examples**

```kex
Time.of(14, 3, 0).try.addMinutes(30).iso   # => "14:33:00"
```

#### `addHours`

The time of day `count` hours later, wrapping within the day.

```kex
addHours(count)
```

**Returns**: `Time` — the shifted time of day

**Examples**

```kex
Time.of(23, 0, 0).try.addHours(2).iso   # => "01:00:00"
```

#### `until`

Elapsed time from this time of day to `other`, within the same day.

Negative when `other` is earlier. Sub-second precision is kept.

```kex
until(other)
```

**Returns**: `Duration` — the elapsed span

**Examples**

```kex
Time.of(14, 3, 0).try.until(Time.of(15, 3, 0).try).wholeMinutes   # => 60
```

#### `compareTo`

Orders this time of day against another, nanoseconds included.

```kex
compareTo(other)
```

**Returns**: `Ordering` — `Less`, `Equal` or `Greater`

**Examples**

```kex
Time.of(14, 3, 0).try.compareTo(Time.of(15, 0, 0).try)   # => Less
```

## make `DateTime` implements Inspectable, Showable


#### `inspectValue`

Renders the instant structurally, for debugging output.

```kex
inspectValue(colors)
```

**Returns**: `String` — the rendered instant

#### `at`

The same instant, rendered at another offset.

Nothing moves: the wall clock changes because the offset does, and `epochSeconds` is unchanged.

```kex
at(offset)
```

**Returns**: `DateTime` — the same instant, at that offset

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try
  .at(Duration.utcOffset(-5, 0)).iso
# => "2026-07-30T07:03:00-05:00"
```

#### `+`

Advances the instant by a fixed span, keeping its offset.

```kex
+(span)
```

**Returns**: `DateTime` — the later instant

**Examples**

```kex
(DateTime.parse("2026-07-30T14:03:00Z").try + 90.minutes).iso
# => "2026-07-30T15:33:00Z"
```

#### `-`

Moves the instant back by a fixed span, keeping its offset.

```kex
-(span)
```

**Returns**: `DateTime` — the earlier instant

**Examples**

```kex
(DateTime.utcNow() - 24.hours).iso   # yesterday, same wall clock
```

#### `addDays`

The instant `count` days later, keeping the wall clock and the offset.

```kex
addDays(count)
```

**Returns**: `DateTime` — the shifted instant

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00Z").try.addDays(1).iso
# => "2026-07-31T14:03:00Z"
```

#### `addWeeks`

The instant `count` weeks later, keeping the wall clock and the offset.

```kex
addWeeks(count)
```

**Returns**: `DateTime` — the shifted instant

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00Z").try.addWeeks(1).iso
# => "2026-08-06T14:03:00Z"
```

#### `addMonths`

The instant `count` calendar months later, with the day clamped into the target month.

```kex
addMonths(count)
```

**Returns**: `DateTime` — the shifted instant

**Examples**

```kex
DateTime.parse("2026-01-31T09:00:00Z").try.addMonths(1).iso
# => "2026-02-28T09:00:00Z"
```

#### `addYears`

The instant `count` calendar years later, with the day clamped.

```kex
addYears(count)
```

**Returns**: `DateTime` — the shifted instant

**Examples**

```kex
DateTime.parse("2024-02-29T09:00:00Z").try.addYears(1).iso
# => "2025-02-28T09:00:00Z"
```

#### `until`

Elapsed time from this instant to `other`, negative when `other` is earlier. Sub-second precision is kept.

```kex
until(other)
```

**Returns**: `Duration` — the elapsed span

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

Returns `true` when this instant is earlier than `other`, whatever offsets they are written at.

```kex
before?(other)
```

**Returns**: `Bool` — `true` when this instant comes first

**Examples**

```kex
DateTime.parse("2026-07-30T14:03:00+02:00").try
  .before?(DateTime.parse("2026-07-31T00:00:00Z").try)
# => true
```

#### `after?`

Returns `true` when this instant is later than `other`.

```kex
after?(other)
```

**Returns**: `Bool` — `true` when this instant comes second

**Examples**

```kex
DateTime.utcNow().after?(started)   # => true
```

#### `compareTo`

Orders this instant against another, by instant rather than by wall clock, so 12:00Z and 14:00`02:00 compare `Equal`.

Named `compareTo` rather than `compare`: a make-block `compare` is shadowed by the builtin comparison dispatch and fails at runtime on both backends.

```kex
compareTo(other)
```

**Returns**: `Ordering` — `Less`, `Equal` or `Greater`

**Examples**

```kex
DateTime.parse("2026-07-30T12:00:00Z").try
  .compareTo(DateTime.parse("2026-07-30T14:00:00`02:00").try)
# => Equal
```
_Sorting events by when they happened_

```kex
events.sort { |a, b| a.at.compareTo(b.at) == Less }
```
