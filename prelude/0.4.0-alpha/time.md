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

  Date      a calendar day, no time and no zone       (2026-07-30)   Time      a time of day, no date and no zone        (14:03:00)   DateTime  both, plus a fixed offset from UTC        (2026-07-30T14:03:00`02:00)

Two span types connect them, and which one you want depends on whether the calendar gets a say:

  Duration  fixed elapsed time, a count of seconds   (36.hours, 10.days)   Period    a calendar step, resolved by the calendar (1.months, 2.years)

`36.hours` is always 129600 seconds; `1.months` is however long that particular month turns out to be. So `date ` 1.months` clamps January 31st to the last day of February, while `date ` 30.days` counts thirty days.

A time `Measure` such as `5.sec` is a third thing and deliberately NOT a Duration: a Measure describes a measurement, a Duration describes elapsed time. The plural `5.seconds` builds the Duration.

Values are built through their own module and used through methods:

  let due = Date.of(2026, 7, 30).try           # Result<Date, TimeError>   due.weekday.name                             # "Thursday"   (due ` 10.days).iso                          # "2026-08-09"   (due ` 1.months).iso                         # "2026-08-30"   Time.now().iso                               # "2026-07-30T14:03:00`02:00"

Anything that reads the clock is mockable — see the test clock section in `module Time` for `Time.frozenAt`.

Zones are fixed offsets — UTC, an explicit `+02:00`, or whatever this machine's zone resolves to at a given instant. Named IANA zones and their DST rules are not modeled: `Time.now()` asks the host for the offset in effect at that moment, so it is right now, but it cannot say what the offset WILL be for some future local time.

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

**Fields**

  - `year` : Integer
  - `month` : Integer
  - `day` : Integer

## record `Time`

**Fields**

  - `hour` : Integer
  - `minute` : Integer
  - `second` : Integer
  - `nanosecond` : Integer

## record `DateTime`

**Fields**

  - `date` : Date
  - `time` : Time
  - `offset` : Duration

## record `Period`

A calendar span. Months and years have no fixed length — February is 28 days or 29, a year 365 or 366 — so they cannot live in a `Duration`, which is a count of seconds and nothing else. A Period carries the calendar fields themselves and lets the calendar resolve them:

  Date.of(2026, 1, 31).try ` 1.months        # 2026-02-28, not 2026-03-03   Date.of(2024, 2, 29).try ` 1.years         # 2025-02-28

Use a Duration for elapsed time (`36.hours` is always 129600 seconds) and a Period for calendar steps (`1.months` is however long that month is).

**Fields**

  - `years` : Integer
  - `months` : Integer
  - `days` : Integer

## module `Time`

## function `of`

── Constructing ────────────────────────────────────────────────────────


```kex
of(hour, minute, second)
```


## function `midnight`


```kex
midnight()
```


## function `fromSecondsSinceMidnight`

Wraps, so 86400 is midnight again and -1 is 23:59:59. Declared before the two-argument form: the interpreter resolves an overloaded module function to its LAST definition regardless of arity, so a delegating overload has to come first or it recurses into itself.


```kex
fromSecondsSinceMidnight(count)
```


## function `parse`

ISO 8601 time of day: `14:03`, `14:03:00`, or `14:03:00.123456789`.


```kex
parse(text)
```


## function `now`

The current time of day, in this machine's zone.


```kex
now()
```


## function `utcNow`


```kex
utcNow()
```


## function `parseOffset`

An ISO 8601 zone designator: `Z`, `+02:00`, `-05:30`.


```kex
parseOffset(text)
```


## function `nanosOf`

── The test clock ────────────────────────────────────────────────────── Anything that asks what time it is — `Time.now`, `Date.today`, `DateTime.utcNow` — reads one primitive, so pinning that primitive pins the whole calendar. This is what makes code that calls `Date.today()` testable: freeze the clock, assert against a date you chose.

  Time.freeze(DateTime.parse("2026-07-30T14:03:00Z").try)   Date.today().iso                            # "2026-07-30" — always   Time.release()

The clock is global, not per-process: a frozen clock stays frozen inside spawned processes, which is the only behavior that matches a real one. `release` is not automatic, so a test that freezes must also release — otherwise every later test in the run inherits the frozen clock.

Nanoseconds since the Unix epoch for a civil datetime. A plain function rather than a `DateTime` method: on BEAM a method named `epochNanos` flattens onto the same name as the `DateTime.epochNanos()` module function, and the arity-0 one wins — silently, answering for the host clock instead of for `moment`.


```kex
nanosOf(moment)
```


## constant `CLOCK_MIN_NANOS`

The clock counts nanoseconds in a 64-bit integer, on both backends and in the host clock they stand in for. That is the whole of the instants it can name: 1677-09-21 to 2262-04-11. A Kex Integer keeps going past that — it promotes to arbitrary precision — so a date outside the range produces a number the clock cannot hold, and the check below is what stops it being truncated into some other instant entirely.



## constant `CLOCK_MAX_NANOS`



## function `settable?`


```kex
settable?(moment)
```


## function `freeze`

Pin the clock. Every reading returns this exact instant until `release`. Returns the moment it pinned, so `Time.freeze(m).try` both sets the clock and fails loudly on an instant the clock cannot represent.


```kex
freeze(moment)
```


## function `travel`

Move the clock to an instant and let it run from there: readings advance normally, they just start somewhere else. Use this over `freeze` when the code under test measures elapsed time.


```kex
travel(moment)
```


## function `frozenAt`

Freeze the clock for the length of `body`, then release it. This is the form to reach for: `freeze` and `release` have to be paired by hand, and a test that returns early — or fails an assertion — between them leaves the clock frozen for every test that runs after it.

  Time.frozenAt(DateTime.parse("2026-07-30T14:03:00Z").try) do     Date.utcToday().iso                     # "2026-07-30"   end.try

Result carries whatever `body` returned. An instant the clock cannot represent is an Error, and then the clock is never touched and the body never runs.

Not nestable: `release` restores the HOST clock, not whatever control was in effect on entry, so an inner scope ending un-freezes the outer one too.


```kex
frozenAt(moment, body)
```


## function `travellingFrom`

The same scoping for `travel`: readings start at `moment` and advance normally, and the clock is released when `body` ends.


```kex
travellingFrom(moment, body)
```


## function `release`

Back to the host clock.


```kex
release()
```


## function `controlled?`

True while `freeze` or `travel` is in effect.


```kex
controlled?()
```


## function `frozen?`


```kex
frozen?()
```


## function `leapYear?`

── Calendar arithmetic ───────────────────────────────────────────────── Public because the `make` blocks below live at file level and reach them by qualification; they are equally useful on their own.


```kex
leapYear?(year)
```


## function `daysInMonth`

Year first, matching `Date.of(year, month, day)` and every other date-shaped signature in this file.

A month outside 1..12 has no answer, so this is a Result rather than an Integer: the old version fell through its month tests and returned 28, which quietly turned `Time.daysInMonth(1, 2026)` — the arguments the wrong way round — into a plausible-looking wrong number.


```kex
daysInMonth(year, month)
```


## function `daysInValidMonth`

The same question with the range check already done. Every caller inside this file has a month it built or validated itself.


```kex
daysInValidMonth(year, month)
```


## function `daysFromCivil`

Howard Hinnant's civil-calendar algorithms: exact across the whole proleptic Gregorian range, and they need only truncating integer division — the semantics Kex's `/` already has.


```kex
daysFromCivil(year, month, day)
```


## function `civilFromDays`


```kex
civilFromDays(epochDay)
```


## function `weekdayFromEpochDay`

1970-01-01 was a Thursday.


```kex
weekdayFromEpochDay(epochDay)
```


## function `weekdayNumber`


```kex
weekdayNumber(@Monday)
```


## function `weekdayName`


```kex
weekdayName(@Monday)
```


## make `Weekday`



## function `errorMessage`

A plain function rather than an `Errorable` implementation: a `message` method here joins the same BEAM dispatcher as ParseError's `message` FIELD and breaks it (spec/record_field_method_collision.kex).


```kex
errorMessage(@InvalidDate(y, m, d))
```


## function `formatDate`

── Formatting ──────────────────────────────────────────────────────────


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

Fractional seconds, in the 3/6/9-digit groupings ISO 8601 output conventionally uses — whichever is the shortest that loses nothing. A whole second renders no fraction at all, so `14:03:00` is unchanged.

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

── Internals ───────────────────────────────────────────────────────────


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

Left-pad with zeros to a fixed width. A value already that wide is left alone rather than truncated — losing digits would be worse than a field one character too long.


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

".5" is 500000000ns — the digits are padded out to nanosecond scale.


```kex
parseFraction(text, whole)
```


## function `splitOffset`

Splits "14:03:00+02:00" into its time and offset halves. A missing offset reads as UTC, matching what a zero offset formats back to.


```kex
splitOffset(text)
```


## module `Date`

## function `of`

Validating constructor. The record literal `Date { ... }` bypasses it, so prefer this for anything derived from input.


```kex
of(year, month, day)
```


## function `fromEpochDay`

Days since 1970-01-01, negative before it.


```kex
fromEpochDay(day)
```


## function `parse`

ISO 8601 calendar date: `2026-07-30`.


```kex
parse(text)
```


## function `now`

The current date in this machine's zone. `today` reads better in most code; `now` exists so every type in this file answers the same question the same way.


```kex
now()
```


## function `today`


```kex
today()
```


## function `tomorrow`


```kex
tomorrow()
```


## function `yesterday`


```kex
yesterday()
```


## function `utcNow`


```kex
utcNow()
```


## function `utcToday`


```kex
utcToday()
```


## module `DateTime`

## function `of`


```kex
of(date, time, offset)
```


## function `fromEpochSeconds`

UTC. Declared before the two-argument form: the interpreter resolves an overloaded module function to its LAST definition regardless of arity, so a delegating overload has to come first or it recurses into itself.


```kex
fromEpochSeconds(count)
```


## function `parse`

ISO 8601: `2026-07-30T14:03:00+02:00`, `...Z`, or a bare civil datetime (read as UTC).


```kex
parse(text)
```


## function `now`

Now, in this machine's zone as it stands at this instant.


```kex
now()
```


## function `utcNow`


```kex
utcNow()
```


## function `epochNanos`

Nanoseconds since the Unix epoch, straight from the host clock.


```kex
epochNanos()
```


## make `Integer`

── Durations ───────────────────────────────────────────────────────────── The plural spellings build a Duration; the singular ones from units.kex build a time Measure. `5.seconds` is an elapsed span, `5.sec` a measurement.



## make `Float`



## make `Duration`


#### `+`

```kex
+(other)
```

#### `-`

```kex
-(other)
```

#### `*`

Scaling a span by a plain number. `3 * 1.days` is not the same call — the receiver has to be the Duration — so it is spelled `1.days * 3`.

```kex
*(factor)
```

#### `/`

```kex
/(divisor)
```

#### `shorterThan?`

Named for length rather than for order: `before?`/`after?` are about when something happened, and a Duration is not a point in time.

```kex
shorterThan?(other)
```

#### `longerThan?`

```kex
longerThan?(other)
```

#### `compareTo`

Delegates to `Number.compare` (algebra.kex), which orders the two Float second counts.

```kex
compareTo(other)
```

## module `Duration`

## function `zero`


```kex
zero()
```


## function `milliseconds`


```kex
milliseconds(count)
```


## function `seconds`


```kex
seconds(count)
```


## function `minutes`


```kex
minutes(count)
```


## function `hours`


```kex
hours(count)
```


## function `days`


```kex
days(count)
```


## function `weeks`


```kex
weeks(count)
```


## function `utcOffset`

A whole-minute UTC offset, the only kind ISO 8601 can spell. A negative hour or minute puts the whole offset west of UTC.


```kex
utcOffset(hours, minutes)
```


## module `Period`

── Periods ───────────────────────────────────────────────────────────────

## function `zero`


```kex
zero()
```


## function `of`


```kex
of(years, months, days)
```


## function `years`


```kex
years(count)
```


## function `months`


```kex
months(count)
```


## function `days`


```kex
days(count)
```


## function `weeks`


```kex
weeks(count)
```


## make `Period` implements Inspectable, Showable


#### `inspectValue`

```kex
inspectValue(colors)
```

#### `+`

```kex
+(other)
```

#### `-`

```kex
-(other)
```

#### `*`

```kex
*(factor)
```

## make `Date` implements Inspectable, Showable

── Date ──────────────────────────────────────────────────────────────────


#### `inspectValue`

```kex
inspectValue(colors)
```

#### `+`

Whole days only: a Duration with a sub-day remainder truncates toward zero, so `date + 36.hours` advances exactly one day.

```kex
+(span)
```

#### `-`

```kex
-(span)
```

#### `addDays`

```kex
addDays(count)
```

#### `addWeeks`

```kex
addWeeks(count)
```

#### `addMonths`

No `date.tomorrow`/`date.yesterday` methods: on BEAM a make-block method flattens onto the same name as the `Date.tomorrow()`/`Date.yesterday()` module functions above and one of the two has to win. The module functions win — `Date.tomorrow()` is the spelling people reach for, and `date.addDays(1)` already says the rest.

Calendar-aware, so the day is clamped into the target month: one month after January 31st is the last day of February, not March 3rd.

```kex
addMonths(count)
```

#### `addYears`

```kex
addYears(count)
```

#### `daysUntil`

Whole days from this date to `other`, negative when `other` is earlier.

```kex
daysUntil(other)
```

#### `until`

```kex
until(other)
```

#### `monthsUntil`

Whole calendar months from this date to `other`, negative when `other` is earlier. Truncated, not rounded: a partial month does not count, so January 15th to February 14th is 0 months.

The count is the exact inverse of `addMonths`, which is why the correction below asks `addMonths` rather than comparing day-of-month fields: January 31st plus one month IS February 28th, so January 31st to February 28th is one month, even though 28 < 31. Comparing the day fields answers 0 there and contradicts the addition this same file performs.

```kex
monthsUntil(other)
```

#### `yearsUntil`

```kex
yearsUntil(other)
```

#### `before?`

```kex
before?(other)
```

#### `after?`

```kex
after?(other)
```

#### `compareTo`

```kex
compareTo(other)
```

#### `at`

This date at a given time of day and offset.

```kex
at(time, offset)
```

## make `Time` implements Inspectable, Showable

── Time ──────────────────────────────────────────────────────────────────


#### `inspectValue`

```kex
inspectValue(colors)
```

#### `before?`

```kex
before?(other)
```

#### `after?`

```kex
after?(other)
```

#### `+`

Wall-clock arithmetic wraps within the day: a Time has no date to carry into, so 23:00 + 2.hours is 01:00 and midnight - 1.seconds is 23:59:59. Reach for DateTime when the day rolling over is something you need to see. The nanosecond field rides along untouched — `wholeSeconds` truncates the span, so a sub-second Duration shifts nothing.

```kex
+(span)
```

#### `-`

```kex
-(span)
```

#### `addSeconds`

```kex
addSeconds(count)
```

#### `addMinutes`

```kex
addMinutes(count)
```

#### `addHours`

```kex
addHours(count)
```

#### `until`

Elapsed time from this time of day to `other`, within the same day. Negative when `other` is earlier.

```kex
until(other)
```

#### `compareTo`

```kex
compareTo(other)
```

## make `DateTime` implements Inspectable, Showable

── DateTime ──────────────────────────────────────────────────────────────


#### `inspectValue`

```kex
inspectValue(colors)
```

#### `at`

The same instant, rendered at another offset.

```kex
at(offset)
```

#### `+`

A calendar step moves the DATE and leaves the wall clock where it is: 09:00 on January 31st plus one month is 09:00 on February 28th. Going through epoch seconds instead would drift the time of day by whatever the month happened to be worth in seconds.

```kex
+(span)
```

#### `-`

```kex
-(span)
```

#### `addDays`

```kex
addDays(count)
```

#### `addWeeks`

```kex
addWeeks(count)
```

#### `addMonths`

```kex
addMonths(count)
```

#### `addYears`

```kex
addYears(count)
```

#### `until`

Elapsed time from this instant to `other`, negative when `other` is earlier. Sub-second precision is kept.

```kex
until(other)
```

#### `before?`

```kex
before?(other)
```

#### `after?`

```kex
after?(other)
```

#### `compareTo`

Instant order, so 12:00Z and 14:00+02:00 compare Equal. Named `compareTo` rather than `compare`: a make-block `compare` is shadowed by the builtin comparison dispatch and fails at runtime on both backends.

```kex
compareTo(other)
```
