---
id: "guide-0-4-0-beta-4-time"
title: "Time and units"
description: "Work with civil dates, elapsed durations, and physical measurements."
path: "/guide/0.4.0/time/"
draft: false
template: "page"
---
A date on a calendar and a duration of two days answer different questions. Kex gives them different types, so you can choose the representation that matches the operation.

## Civil dates and times

```kex
let due = Date.of(2026, 9, 27).try
assert(due.iso == "2026-09-27")
assert((due + 2.days).iso == "2026-09-29")
let instant = DateTime.parse("2026-09-27T14:00:00+02:00").try
assert(instant.utc.iso == "2026-09-27T12:00:00Z")
IO.printLine(due.iso)
IO.printLine((due + 2.days).iso)
```

```output filename="OUTPUT"
2026-09-27
2026-09-29
```

Adding `2.days` moves the due date from September 27 to September 29. Parsing the `DateTime` keeps its instant and lets `.utc` display that instant at UTC. `Date` has no time or zone; `Time` has no date or zone; `DateTime` combines them with a fixed UTC offset. Constructors and parsers return results because some fields are invalid.

A fixed offset is not a named time zone with future daylight-saving rules. Do not use a present offset to predict future local-time transitions. Reading the current clock, such as `DateTime.now()`, is effectful.

## Durations and measures

There are two ways to express five seconds. `5.seconds` is a `Duration` for elapsed time. `5.sec` is a `Measure` that can participate in calculations with other physical quantities. The types are different; an API asking for integer milliseconds needs those instead.

```kex
let interval = 2.5.sec
assert(interval.kind == :time)
assert(interval.canonical == 2.5)
```

`2.5.sec` has kind `:time` and a canonical value of `2.5` seconds. Import `Units.SI` for physical units and `Units.Data` for information units:

```kex
using Units.SI
let distance = 100.meter
let speed = distance / 10.sec
assert(distance.canonical == 100.0)
assert(speed.canonical == 10.0)
```

The distance is 100 meters and the elapsed time is 10 seconds, so `speed.canonical` is `10.0`. A measurement also has a kind, which prevents converting a distance to an incompatible time unit. Choose a display unit deliberately when presenting the result.

Use typed units at boundaries where mixing milliseconds, seconds, bytes, or kilobytes would otherwise be easy. See the Units, Date, Time, DateTime, and Dimensions reference entries for arithmetic and formatting options.
