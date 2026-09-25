---
package: prelude
version: "0.4.0-beta.4-dev"
source: control/retry.kex
title: Control.Retry
entities:
  - { kind: module, name: "Control.Retry" }
---

# Control.Retry

## module `Control.Retry`

Retry an operation after it returns an error.

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
  attempts: 4, delay: 250.milliseconds, backoff: 1.0,
  maximumDelay: 250.milliseconds, jitter: 0.0
}
Retry.run(schedule: schedule) do
  Error("not ready")
end
# => Error("not ready"), after four calls and 750 ms of sleep
```

_Exponential delays: 200, 400, 800, 1600 milliseconds_

```kex
let schedule = Retry.Schedule {
  attempts: 5, delay: 200.milliseconds, backoff: 2.0,
  maximumDelay: 5.seconds, jitter: 0.0
}
Retry.run(schedule: schedule) do
  Error("busy")
end
# => Error("busy"), after five calls and three seconds of sleep
```

_Capped delays: 500 ms, 1 s, 2 s, 2 s, 2 s_

```kex
Retry.Schedule {
  attempts: 6, delay: 500.milliseconds, backoff: 2.0,
  maximumDelay: 2.seconds, jitter: 0.0
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
Retry.run(attempts: 5, delay: 200.milliseconds, jitter: 0.0) do
  Ok("ready")
end
# => Ok("ready")
```

_Limit the time spent sleeping_

```kex
Retry.run(
  attempts: 5, delay: 1.seconds, backoff: 2.0,
  jitter: 0.0, maximumTotalDelay: Just(2.seconds)
) do
  Error("busy")
end
# => Error("busy"), two calls and one second of sleep
```

_Test jitter without waiting_

```kex
Retry.run(
  attempts: 2, delay: 4.seconds, jitter: 0.25,
  sleeper: { |wait| Assert.equal(wait, 3.seconds) },
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
  Done(result) => IO.printLine(result)
  Again(last) => IO.printLine("retry budget exhausted: ${last}")
end
```



## module `Control.Retry.Retry`

`run` calls the block immediately. `Ok` stops; `Error` waits and retries. When the schedule runs out, it returns the last error unchanged. Use `again` and `done` when your application needs to choose what to retry.

HTTP 429 and 503 responses are `Ok(response)`, so retrying those statuses requires an explicit decision. For writes, make sure repeating the request is safe, for example by using an idempotency key. Set request timeouts separately: the schedule limits sleep, not time spent inside the operation.

### `again`

```kex
again(value: X) -> Decision<X>
```

Retry this operation if the schedule has room for another attempt.

**Parameters**

  - `value` — the last outcome, retained if the schedule is exhausted

**Returns**: `Again(value)`

### `done`

```kex
done(value: X) -> Decision<X>
```

Stop now. The supplied value may be a success or a permanent failure.

**Parameters**

  - `value` — the final application outcome

**Returns**: `Done(value)`

### `run`

```kex
run : Block<X> -> Schedule -> Integer -> Duration -> Float -> Duration -> Float -> Duration? -> (Duration -> Void) -> Block<Float> -> (Info<X> -> Void) -> X
```

Call the block until it succeeds, returns `done`, or runs out of attempts or sleep time.

The first attempt is immediate. Every later attempt follows one sleep. There is no sleep after success or the final error. Named timing options override the corresponding schedule field for this execution only.

Return a `Result` from the block for automatic retries: `Ok` stops and `Error` retries. If no more retries are allowed, `run` returns the last error.

Return `done(value)` or `again(value)` to make the decision yourself. The final `Done` means the block chose to stop; `Again` means it wanted another try but the schedule ran out. Use one return form throughout the block. Runtime faults propagate; they are not retried.

Out-of-range settings are adjusted: attempts below one become one, negative durations become zero, backoff below one becomes one, jitter and random samples are clamped to 0..1. Non-finite Float settings are unsupported.

`Done(Error(...))` means the application stopped on a permanent error. `Again(Ok(response))` means an unacceptable HTTP status persisted until exhaustion. HTTP status classification and Retry-After handling are the application's responsibility; `run` has no HTTP-specific behavior.

The testing hooks are independent: replacing sleep keeps normal random sampling, and replacing randomness keeps real sleep. A random sample of 0 selects the lower jitter bound, 0.5 the base, and 1 the upper bound. With zero jitter no random sample is needed. lint:allow parameter-count — named options make each setting independent

**Parameters**

  - `operation` — called again for each attempt; returns Result or Decision
  - `schedule` — reusable settings; defaults to `Schedule {}`
  - `attempts` — total attempts; defaults to the schedule field
  - `delay` — initial wait; defaults to the schedule field
  - `backoff` — delay multiplier; defaults to the schedule field
  - `maximumDelay` — sleep cap; defaults to the schedule field
  - `jitter` — variation fraction; defaults to the schedule field
  - `maximumTotalDelay` — sleep budget; defaults to the field
  - `sleeper` — defaults to real `Task.sleep`
  - `random` — defaults to secure backend sampling in 0..1
  - `onRetry` — reports an allowed retry; defaults to no action

**Returns**: first Ok/Done, or last Error/Again when retries run out

## record `Schedule`

Timing and attempt limits for `run`.

Defaults: three attempts, starting with a 100 ms wait, doubling up to 5 seconds, with 20% jitter. All fields are optional. A schedule holds settings. Reusing it starts each run from attempt one.

* `attempts`: maximum executions, including the first; default 3. * `delay`: initial base wait; default 100 milliseconds. * `backoff`: base-delay multiplier; default 2.0, or 1.0 for fixed waits. * `maximumDelay`: cap on each actual wait, including jitter; default 5 seconds. * `jitter`: symmetric proportional variation; default 0.2, or 0.0 to disable. * `maximumTotalDelay`: cumulative sleep allowance; default `None`.   Operation execution time is excluded. A wait that exceeds the remaining   allowance ends the run without sleeping or calling the operation again.

**Fields**

  - `attempts` : [Integer](../number.md#make-integer) (optional)
  - `delay` : [Duration](../units.md#record-duration) (optional)
  - `backoff` : [Float](../number.md#make-float) (optional)
  - `maximumDelay` : [Duration](../units.md#record-duration) (optional)
  - `jitter` : [Float](../number.md#make-float) (optional)
  - `maximumTotalDelay` : [Duration](../units.md#record-duration)? (optional)



## type `Decision<X>`

Whether to retry, together with the last result. `Done(value)` means the block stopped deliberately. `Again(value)` returned by `run` means the schedule was exhausted before completion. The value inside can be any application result, including an `Error`.

**Variants**

  - `Again(X)`
  - `Done(X)`



## record `Info<X>`

Progress passed to `onRetry` before the next wait.

The callback runs only when another attempt is allowed. It does not run for the first call, a successful result, `done`, or exhaustion. Durations count scheduled sleep; they exclude time spent in the operation.

* `attempt`: the just-completed attempt, starting at 1. * `nextAttempt`: the attempt that follows the upcoming wait. * `maximumAttempts`: total permitted executions, including the first. * `remainingAttempts`: executions remaining, including the upcoming one. * `delay`: actual upcoming wait, after jitter and the delay cap. * `totalDelay`: sleep already performed, excluding the upcoming wait. * `result`: the last `Error` or `Again`, including its application payload.

**Fields**

  - `attempt` : [Integer](../number.md#make-integer)
  - `nextAttempt` : [Integer](../number.md#make-integer)
  - `maximumAttempts` : [Integer](../number.md#make-integer)
  - `remainingAttempts` : [Integer](../number.md#make-integer)
  - `delay` : [Duration](../units.md#record-duration)
  - `totalDelay` : [Duration](../units.md#record-duration)
  - `result` : X


