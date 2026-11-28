---
package: prelude
version: "0.4.0-rc.4-dev"
source: control/retry.kex
title: Control.Retry
entities:
  - { kind: module, name: "Control.Retry" }
---

# Control.Retry

## module `Control.Retry`

Retries an operation that returns an error, with a delay between attempts.

**Examples**

_Retry a request and handle the final result_

```kex
using Control.Retry
using Net.HTTP

let result = Retry.run(attempts: 5) do
  HTTP.get("https://api.example.com/inventory")
end
match result do
  Ok(response) => IO.printLine(response.status.code)
  Error(error) => IO.printLine(error.message)
end
```

_Fixed delays: three waits of 250 milliseconds_

```kex
let schedule = Retry.Schedule {
  attempts: 4, delay: 250.millisecond, backoff: 1.0,
  maximumDelay: 250.millisecond, jitter: 0.0
}
Retry.run(schedule: schedule) do
  Error("not ready")
end
# => Error("not ready"), after four calls and 750 ms of sleep
```

_Exponential delays: 200, 400, 800, 1600 milliseconds_

```kex
let schedule = Retry.Schedule {
  attempts: 5, delay: 200.millisecond, backoff: 2.0,
  maximumDelay: 5.second, jitter: 0.0
}
Retry.run(schedule: schedule) do
  Error("busy")
end
# => Error("busy"), after five calls and three seconds of sleep
```

_Capped delays: 500 ms, 1 s, 2 s, 2 s, 2 s_

```kex
Retry.Schedule {
  attempts: 6, delay: 500.millisecond, backoff: 2.0,
  maximumDelay: 2.second, jitter: 0.0
}
```

_Use one schedule for two requests_

```kex
using Net.HTTP
let schedule = Retry.Schedule { attempts: 5 }
let inventory = Retry.run(schedule: schedule) do
  HTTP.get("https://api.example.com/inventory")
end
let orders = Retry.run(schedule: schedule) do
  HTTP.get("https://api.example.com/orders")
end
# Each request gets up to five attempts, independently.
```

_Set retry options directly_

```kex
Retry.run(attempts: 5, delay: 200.millisecond, jitter: 0.0) do
  Ok("ready")
end
# => Ok("ready")
```

_Limit the time spent sleeping_

```kex
Retry.run(
  attempts: 5, delay: 1.second, backoff: 2.0,
  jitter: 0.0, maximumTotalDelay: Just(2.second)
) do
  Error("busy")
end
# => Error("busy"), two calls and one second of sleep
```

_Test jitter without waiting_

```kex
Retry.run(
  attempts: 2, delay: 4.second, jitter: 0.25,
  sleeper: { |wait| Assert.equal(wait, 3.second) },
  random: { 0.0 }
) do
  Error("temporary")
end
# => Error("temporary"), two calls and one fake sleep
```

_Report progress_

```kex
using Net.HTTP
Retry.run(attempts: 5, onRetry: { |info|
  let progress = "retrying ${info.nextAttempt}/${info.maximumAttempts}"
  IO.printLine("${progress} in ${info.delay.seconds} seconds")
}) do
  HTTP.get("https://api.example.com/inventory")
end
```

_Retry temporary HTTP failures and selected statuses_

```kex
using Net
using Net.HTTP
let schedule = Retry.Schedule { attempts: 5 }
let outcome = Retry.run(schedule: schedule) do
  let result = HTTP.get("https://api.example.com/inventory")
  match result do
    Error(error) => if error.kind == Timeout || error.kind == Connect
      Retry.again(result)
    else
      Retry.done(result)
    end
    Ok(response) => if [429, 502, 503, 504].contains?(response.status.code)
      Retry.again(result)
    else
      Retry.done(result)
    end
  end
end
match outcome do
  Retry.Done(result) => IO.printLine(result)
  Retry.Again(last) => IO.printLine("retry budget exhausted: ${last}")
end
```



## module `Control.Retry.Retry`

Running an operation until it succeeds or a `Schedule` runs out.

`run` calls the block at once. An `Ok` result is returned; an `Error` is retried after a wait, and when the schedule runs out the last error is returned as it is. To choose yourself what to retry, return `again` or `done` from the block.

An HTTP 429 or 503 response is `Ok(response)`, so retrying on a status needs `again`. Only retry a write when repeating it is harmless, for example with an idempotency key. The schedule limits the time spent sleeping, not the time spent in the operation, so give requests their own timeouts.

### `again`

```kex
again(value: X) -> Decision<X>
```

Returns `Again(value)`, asking `run` to try again if the schedule allows.

**Parameters**

  - `value` — the result, which `run` returns if the schedule runs out

**Returns**: `Again(value)`

### `done`

```kex
done(value: X) -> Decision<X>
```

Returns `Done(value)`, telling `run` to stop with `value`, whether that is a success or a failure not worth retrying.

**Parameters**

  - `value` — the final result

**Returns**: `Done(value)`

### `run` (foul)

```kex
run(operation: Block<X>, schedule: Schedule = …, attempts: Integer = …, delay: Duration = …, backoff: Float = …, maximumDelay: Duration = …, jitter: Float = …, maximumTotalDelay: Duration? = …, sleeper: (Duration -> Void) = …, random: Block<Float> = …, onRetry: (Info<X> -> Void) = …) -> X
```

Calls `operation` until it succeeds, returns `done`, or runs out of attempts or sleep time, and returns its last result.

The first call happens at once, and each later one after a wait. Named timing options override that field of `schedule` for this run only.

When the block returns a `Result`, `Ok` stops and `Error` is retried. When it returns `done(value)` or `again(value)`, it decides itself. Use one of the two forms throughout the block. An error raised inside the block is not caught or retried.

Settings out of range are adjusted, not rejected: attempts below 1 become 1, negative durations zero, a backoff below 1 becomes 1, and jitter and the random samples are clamped to 0..1.

`Done(Error(...))` means the block gave up on an error not worth retrying. `Again(Ok(response))` means a response the block rejected, such as a 503, kept coming until the schedule ran out. `run` knows nothing about HTTP: deciding which statuses to retry and honouring `Retry-After` are up to the block.

`sleeper` and `random` are for tests, and replacing one leaves the other real. A sample of 0 picks the shortest jittered wait, 0.5 the unjittered one, and 1 the longest. With zero jitter `random` is not called. lint:allow parameter-count — named options make each setting independent

**Parameters**

  - `operation` — called once per attempt; returns a `Result` or a `Decision`
  - `schedule` — the settings; defaults to `Schedule {}`
  - `attempts` — total attempts; defaults to the schedule field
  - `delay` — initial wait; defaults to the schedule field
  - `backoff` — delay multiplier; defaults to the schedule field
  - `maximumDelay` — sleep cap; defaults to the schedule field
  - `jitter` — variation fraction; defaults to the schedule field
  - `maximumTotalDelay` — sleep budget; defaults to the field
  - `sleeper` — waits between attempts; defaults to `Task.sleep`
  - `random` — returns a sample in 0..1 for jitter; defaults to a secure random source
  - `onRetry` — called before each wait; defaults to doing nothing

**Returns**: the first `Ok` or `Done`, or the last `Error` or `Again` when the schedule runs out

## record `Schedule`

The attempt limit and the waits `run` uses between attempts.

Every field has a default: three attempts, a first wait of 100 ms that doubles each time up to 5 seconds, and 20% jitter. A schedule only holds settings, so each `run` that uses it starts again from the first attempt.

**Fields**

  - `attempts` : [Integer](../number.md#make-integer) (optional)
  - `delay` : Duration (optional)
  - `backoff` : [Float](../number.md#make-float) (optional)
  - `maximumDelay` : Duration (optional)
  - `jitter` : [Float](../number.md#make-float) (optional)
  - `maximumTotalDelay` : Duration? (optional)



## type `Decision<X>`

A block's decision whether to retry, carrying its result.

From `run`, `Done(value)` means the block chose to stop, and `Again(value)` means it still wanted to retry when the schedule ran out. The value can be anything, including an `Error`.

**Variants**

  - `Again(X)`
  - `Done(X)`



## record `Info<X>`

What `run` passes to `onRetry` just before it waits for the next attempt.

`onRetry` is called only when another attempt will follow, never after a success, a `done`, or the last attempt. The durations count sleep only, not time spent in the operation.

**Fields**

  - `attempt` : [Integer](../number.md#make-integer)
  - `nextAttempt` : [Integer](../number.md#make-integer)
  - `maximumAttempts` : [Integer](../number.md#make-integer)
  - `remainingAttempts` : [Integer](../number.md#make-integer)
  - `delay` : Duration
  - `totalDelay` : Duration
  - `result` : X


