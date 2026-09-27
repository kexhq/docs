---
id: "guide-0-4-0-beta-4-time"
title: "Time and units"
description: "Work with civil dates, elapsed durations, and physical measurements."
path: "/guide/0.4.0-beta.4/time/"
draft: false
template: "page"
---
Kex distinguishes calendar values from elapsed spans and measured quantities. Choose the representation that matches the operation rather than treating every time-like value as an integer.

## Civil dates and times

```kex
let due = Date.of(2026, 9, 27).try
assert(due.iso == "2026-09-27")
assert((due + 2.days).iso == "2026-09-29")
let instant = DateTime.parse("2026-09-27T14:00:00+02:00").try
assert(instant.utc.iso == "2026-09-27T12:00:00Z")
```

`Date` has a calendar day without a time or zone. `Time` has a time of day without a date or zone. `DateTime` combines them with a fixed UTC offset. Constructors and parsers return results because not every set of fields is valid.

A fixed offset is not a named time zone with future daylight-saving rules. Do not use a present offset to predict future local-time transitions. Reading the current clock, such as `DateTime.now()`, is effectful.

## Durations and measures

`5.seconds` is a `Duration`, suitable for elapsed spans and APIs that request durations. `5.sec` is a `Measure` of time, suitable for dimensional arithmetic. They are different types. Some process APIs take integer milliseconds instead, so follow each signature instead of assuming a universal timeout type.

```kex
let interval = 2.5.sec
assert(interval.kind == :time)
assert(interval.canonical == 2.5)
```

Time measures store their canonical value in seconds. Physical unit constructors are available through `Units.SI`, and information units through `Units.Data`.

```kex
using Units.SI
let distance = 100.meter
let speed = distance / 10.sec
assert(distance.canonical == 100.0)
assert(speed.canonical == 10.0)
```

A measurement's canonical magnitude and kind are distinct from how it is displayed. Conversion to a selected display unit must be dimensionally compatible; a failure should not be hidden by inventing a unitless fallback.

Use typed units at boundaries where mixing milliseconds, seconds, bytes, or kilobytes would otherwise be easy. See the Units, Date, Time, DateTime, and Dimensions reference entries for arithmetic and formatting options.
