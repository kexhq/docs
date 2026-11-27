---
package: prelude
version: "0.4.0-rc.5-dev"
source: date.kex
title: Date
entities:
  - { kind: type, name: "Weekday" }
  - { kind: record, name: "Date" }
  - { kind: module, name: "Date" }
  - { kind: make, name: "Date" }
---

# Date

## type `Weekday`

The days of the week, in ISO order: Monday is day 1.

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
(due + 10.day).iso   # => "2026-08-09"
```

Build one with `Date.of`, which checks that the day exists. The record literal does not check.

See `Time` for the time of day, `DateTime` for an instant and `Period` for calendar spans.

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

Writes the date as a record, for debugging output.

**Parameters**

  - `colors` — whether to include ANSI color escapes

**Returns**: the rendered date

#### `showValue` (from Showable)

```kex
showValue -> String
```

Writes the date in ISO form, which is what interpolation and `IO.printLine` show.

**Returns**: the ISO 8601 date

**Examples**

```kex
"due ${Date.of(2026, 7, 30).try}"   # => "due 2026-07-30"
```

#### `epochDay`

```kex
epochDay -> Integer
```

Returns the number of days since 1970-01-01, negative before it.

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

Returns the day of the week this date falls on.

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

Returns the day's position in its year, counting January 1st as 1.

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

Returns the number of days in this date's month.

Unlike `Time.daysInMonth`, which takes any two integers, it needs no `Result`.

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

Adds the whole days of a `Duration` to the date.

Any part of a day is dropped, so +date + 36.hour+ moves one day. Add a `Period` to move by calendar months or years.

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

Subtracts the whole days of a `Duration` from the date.

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

Returns the date `count` days later. A negative count moves backwards.

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

Returns the date `count` weeks later. A negative count moves backwards.

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

Returns the date `count` calendar months later, with the day clamped to the length of that month.

One month after January 31st is the last day of February. A negative count moves backwards.

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

Returns the date `count` calendar years later. February 29th plus one year is February 28th.

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

Returns the first day of this date's month.

**Returns**: the first of the month

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfMonth.iso   # => "2026-07-01"
```

#### `endOfMonth`

```kex
endOfMonth -> Date
```

Returns the last day of this date's month.

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

Returns January 1st of this date's year.

**Returns**: the first of the year

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfYear.iso   # => "2026-01-01"
```

#### `endOfYear`

```kex
endOfYear -> Date
```

Returns December 31st of this date's year.

**Returns**: the last of the year

**Examples**

```kex
Date.of(2026, 7, 30).try.endOfYear.iso   # => "2026-12-31"
```

#### `startOfWeek`

```kex
startOfWeek -> Date
```

Returns the Monday of this date's week. Weeks run Monday to Sunday, as in ISO 8601.

**Returns**: the Monday of this week

**Examples**

```kex
Date.of(2026, 7, 30).try.startOfWeek.iso   # => "2026-07-27"
```

#### `endOfWeek`

```kex
endOfWeek -> Date
```

Returns the Sunday of this date's week.

**Returns**: the Sunday of this week

**Examples**

```kex
Date.of(2026, 7, 30).try.endOfWeek.iso   # => "2026-08-02"
```

#### `daysUntil`

```kex
daysUntil(other: Date) -> Integer
```

Returns the number of days from this date to `other`, negative when `other` is earlier.

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

Returns the span from this date to `other` as a `Duration` of whole days.

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

Returns the number of whole calendar months from this date to `other`, negative when `other` is earlier.

A partial month does not count, so January 15th to February 14th is 0. The count agrees with `addMonths`: January 31st plus one month is February 28th, so January 31st to February 28th is one month.

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

Returns the number of whole calendar years from this date to `other`, negative when `other` is earlier. A partial year does not count, so this gives a person's age.

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

Compares this date with `other`.

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

Returns the date as ISO 8601 text, such as `2026-07-30`.

**Returns**: the ISO 8601 date

**Examples**

```kex
Date.of(2026, 7, 30).try.iso   # => "2026-07-30"
```

#### `at`

```kex
at(time: Time, offset: Duration) -> DateTime
```

Returns the `DateTime` for this date at a time of day and UTC offset.

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

The pattern is checked during compilation. For a pattern known only at run time, `DateFormat.parse` says where it goes wrong, and `to(String, format)` returns `None` for a bad one.

Letters are fields, repeated for width. Quote letters meant literally, as in `'at'`, and write `''` for a quote itself. Anything else is written as it stands.

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

Checks a `Date.format` pattern during compilation and reports the first character that does not fit.

**Parameters**

  - `source` — the pattern

**Returns**: the problem found, if any

### `of`

```kex
of(year: Integer, month: Integer, day: Integer) -> Result<Date, TimeError>
```

Builds a calendar date, checking that the day exists.

The month must be 1 to 12 and the day must fit that month, so February 30th is an `InvalidDate` error. The record literal `Date { ... }` skips these checks; use `Date.of` for anything that comes from input.

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

Returns the date a number of days after 1970-01-01. A negative count gives a date before it.

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

Parses an ISO 8601 calendar date such as `2026-07-30`.

The year needs at least four digits, the month and day exactly two. Text of the wrong shape is `InvalidFormat`; a well-formed day that does not exist is `InvalidDate`.

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

Returns today's date in this machine's zone, the same as `Date.today()`.

It matches `Time.now()` and `DateTime.now()`; `Date.today()` usually reads better.

**Returns**: today's date

**Examples**

```kex
Date.now().iso   # => "2026-07-30"
```

### `today` (foul)

```kex
today -> Date
```

Returns today's date in this machine's zone.

A test can fix the date by replacing `Time.Clock`.

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

Returns the day after today, in this machine's zone.

**Returns**: tomorrow's date

**Examples**

```kex
Date.tomorrow().iso   # => "2026-07-31"
```

### `yesterday` (foul)

```kex
yesterday -> Date
```

Returns the day before today, in this machine's zone.

**Returns**: yesterday's date

**Examples**

```kex
Date.yesterday().iso   # => "2026-07-29"
```

### `utcNow` (foul)

```kex
utcNow -> Date
```

Returns today's date in UTC, the same as `Date.utcToday()`.

**Returns**: today's UTC date

**Examples**

```kex
Date.utcNow().iso   # => "2026-07-30"
```

### `utcToday` (foul)

```kex
utcToday -> Date
```

Returns today's date in UTC, whatever this machine's zone is.

**Returns**: today's UTC date

**Examples**

```kex
Date.utcToday().iso   # => "2026-07-30"
```
