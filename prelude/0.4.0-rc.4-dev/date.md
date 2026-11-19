---
package: prelude
version: "0.4.0-rc.4-dev"
source: date.kex
title: Date
entities:
  - { kind: type, name: "Weekday" }
  - { kind: record, name: "Date" }
  - { kind: module, name: "Date" }
  - { kind: make, name: "Date" }
---

# Date

Calendar days. A `Date` is a year, a month and a day, with no time and no zone; `Weekday` names its day of the week. The time of day is in time.kex, the instant in date_time.kex, and calendar spans in period.kex.

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

### Defined in other modules

  - [Time](time.md#make-weekday): [`number`](time.md#weekday-number), [`name`](time.md#weekday-name), [`weekend?`](time.md#weekday-weekend?)

## record `Date`

A calendar day: a year, a month and a day, with no time and no zone.

```kex
let due = Date.of(2026, 7, 30).try
due.iso              # => "2026-07-30"
due.weekday.name     # => "Thursday"
(due + 10.day).iso  # => "2026-08-09"
```

Build one with `Date.of`, which validates, rather than with the record literal, which does not.

**Fields**

  - `year` : [Integer](number.md#make-integer)
  - `month` : [Integer](number.md#make-integer)
  - `day` : [Integer](number.md#make-integer)

Implements [`Inspectable`](kex.md#trait-inspectable), [`Showable`](kex.md#trait-showable).

### Functions

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
showValue -> String
```

Renders the date in ISO form, so interpolation and `IO.printLine` show `2026-07-30`.

**Returns**: the ISO 8601 date

**Examples**

```kex
"due ${Date.of(2026, 7, 30).try}"   # => "due 2026-07-30"
```

#### `epochDay`

```kex
epochDay -> Integer
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
weekday -> Weekday
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
dayOfYear -> Integer
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
leapYear? -> Bool
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
daysInMonth -> Integer
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

A Duration with a sub-day remainder truncates toward zero, so +date + 36.hour+ advances exactly one day. Use a `Period` when the calendar should get a say.

**Parameters**

  - `span` — the elapsed span to add

**Returns**: the later date

**Examples**

```kex
(Date.of(2026, 7, 30).try + 10.day).iso   # => "2026-08-09"
(Date.of(2026, 7, 30).try + 36.hour).iso  # => "2026-07-31"
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
(Date.of(2026, 7, 30).try - 10.day).iso   # => "2026-07-20"
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

No `date.tomorrow`/`date.yesterday` functions: on BEAM a make-block function flattens onto the same name as the `Date.tomorrow()`/`Date.yesterday()` module functions above and one of the two has to win. The module functions win: `Date.tomorrow()` is the spelling people reach for, and `date.addDays(1)` already says the rest.

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
startOfMonth -> Date
```

The first day of this date's month.

**Returns**: the first of the month

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfMonth.iso   # => "2026-07-01"
```

#### `endOfMonth`

```kex
endOfMonth -> Date
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
startOfYear -> Date
```

January 1st of this date's year.

**Returns**: the first of the year

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfYear.iso   # => "2026-01-01"
```

#### `endOfYear`

```kex
endOfYear -> Date
```

December 31st of this date's year.

**Returns**: the last of the year

**Examples**

```kex
Date.of(2026, 7, 30).try.endOfYear.iso   # => "2026-12-31"
```

#### `startOfWeek`

```kex
startOfWeek -> Date
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
endOfWeek -> Date
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
iso -> String
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

### Defined in other modules

  - [DateFormat](date_format.md#make-date): [`to`](date_format.md#date-to)

## module `Date`

Building calendar dates, and asking what today is.

### `format`

```kex
format(parts: [String], values: [Any]) -> DateFormat
```

Builds a `DateFormat` from a CLDR pattern, for `to(String, format)` on a `Date`, a `Time` or a `DateTime`.

A pattern that does not fit makes `to(String, format)` answer `None`; `DateFormat.parse` says where it goes wrong, and `validateFormat` is the companion check for the tagged literal. Letters are fields, repeated for width; quote literal letters, as in `'at'`, and write `''` for a quote itself. Anything else is written as it stands.

- `yyyy` the year, `yy` its last two digits
- `M` / `MM` the month number, `MMM` / `MMMM` its short / full name
- `d` / `dd` the day of the month
- `EEE` / `EEEE` the short / full weekday name
- `H` / `HH` the hour 0-23, `h` / `hh` the hour 1-12, `a` AM or PM
- `m` / `mm` minutes, `s` / `ss` seconds, `S` up to `SSSSSSSSS` the
  fraction of a second
- `XXX` the offset as `-05:00`, or `Z` for UTC; `xxx` the same without `Z`
  (`XX` / `xx` write `-0500`, and one letter writes `-05`)

Names come from the culture passed to `to(String, format, culture:)`, English without one.

**Parameters**

  - `parts` — the literal pieces of the tagged literal
  - `values` — the interpolated values

**Returns**: the format

**Examples**

```kex
let d = Date.of(2026, 11, 7).try
d.to(String, Date.format`yyyy-MM-dd`)        # => Just("2026-11-07")
d.to(String, Date.format`EEE, d MMM yyyy`)   # => Just("Sat, 7 Nov 2026")
d.to(String, Date.format`d MMMM yyyy`, culture: Culture.of("HU_HU").or(Culture.DEFAULT))
# => Just("7 november 2026")
```

### `validateFormat`

```kex
validateFormat(source: String) -> [TaggedValidation.Issue]
```

Checks a `Date.format` pattern during compilation, pointing at the first character that does not fit.

**Parameters**

  - `source` — the pattern

**Returns**: the problem found, if any

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

### `now` (foul)

```kex
now -> Date
```

Today's date, in this machine's zone. The same as `Date.today()`.

`Date.today()` reads better in most code; `now` exists so every type in this file answers the same question the same way: `Date.now()`, `Time.now()` and `DateTime.now()`.

**Returns**: today's date

**Examples**

```kex
Date.now().iso   # => "2026-07-30"
```

### `today` (foul)

```kex
today -> Date
```

Today's date, in this machine's zone.

Pinned by replacing `Time.Clock` in a test, like everything else that reads the clock.

**Returns**: today's date

**Examples**

```kex
Date.today().iso   # => "2026-07-30"
```

_Testing code that depends on today_

```kex
with Time.Clock = Mock.Clock { at: DateTime.parse("2026-07-30T00:00:00Z").try } do
  Assert.equal(Date.today().iso, "2026-07-30")
end
```

### `tomorrow` (foul)

```kex
tomorrow -> Date
```

The day after today, in this machine's zone.

**Returns**: tomorrow's date

**Examples**

```kex
Date.tomorrow().iso   # => "2026-07-31"
```

### `yesterday` (foul)

```kex
yesterday -> Date
```

The day before today, in this machine's zone.

**Returns**: yesterday's date

**Examples**

```kex
Date.yesterday().iso   # => "2026-07-29"
```

### `utcNow` (foul)

```kex
utcNow -> Date
```

Today's date in UTC, whatever this machine's zone is. The same as `Date.utcToday()`, under the name every type in this file shares.

**Returns**: today's UTC date

**Examples**

```kex
Date.utcNow().iso   # => "2026-07-30"
```

### `utcToday` (foul)

```kex
utcToday -> Date
```

Today's date in UTC, whatever this machine's zone is.

**Returns**: today's UTC date

**Examples**

```kex
Date.utcToday().iso   # => "2026-07-30"
```
