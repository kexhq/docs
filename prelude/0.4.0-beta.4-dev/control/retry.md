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

Runs bounded retries with a reusable schedule.

`Retry.run` executes the block immediately. An `Ok` stops the run; an `Error` schedules another attempt. When attempts or total sleep run out, the last error is returned unchanged. Runtime faults are not caught.

HTTP responses, including 429 and 503, are `Ok(response)`. Automatic retries handle request failures, not response statuses. Use `again` and `done` to classify responses or stop on permanent errors. Repeat writes only when the application makes them safe, for example with idempotency keys. A schedule bounds retry sleep, not the operation's execution time; configure request timeouts separately.

## module `Control.Retry.Retry`

Provides automatic error retries and explicit retry decisions.

## record `Schedule`

Describes the timing and limits of one execution of `run`.

All fields are optional. Defaults allow three attempts with exponential backoff from 100 milliseconds, capped at 5 seconds, with 20% jitter. Creating a schedule performs no work. It is immutable configuration: each run starts a fresh attempt count and delay sequence.

* `attempts`: maximum executions, including the first; default 3. * `delay`: initial base wait; default 100 milliseconds. * `backoff`: base-delay multiplier; default 2.0, or 1.0 for fixed waits. * `maximumDelay`: cap on each actual wait, including jitter; default 5 seconds. * `jitter`: symmetric proportional variation; default 0.2, or 0.0 to disable. * `maximumTotalDelay`: cumulative sleep allowance; default `None`.   Operation execution time is excluded. A wait that exceeds the remaining   allowance ends the run without sleeping or calling the operation again.

**Fields**

  - `attempts` : Integer (optional)
  - `delay` : Duration (optional)
  - `backoff` : Float (optional)
  - `maximumDelay` : Duration (optional)
  - `jitter` : Float (optional)
  - `maximumTotalDelay` : Duration? (optional)

## type `Decision<X>`

Carries an explicit decision and the last application value. `Done(value)` means the block stopped deliberately. `Again(value)` returned by `run` means the schedule was exhausted before completion. Neither form wraps the application value in an additional `Result`.



**Variants**

  - `Again(X)`
  - `Done(X)`

## function `again`

Requests another attempt if the schedule allows it.


```kex
again(value) : X -> Decision<X>
```


## function `done`

Stops immediately, even when the application value represents failure.


```kex
done(value) : X -> Decision<X>
```


## record `Info<X>`

Describes a retry that is about to wait and then execute another attempt.

Passed to `onRetry` only after the last outcome requests a retry and the schedule permits it. There is no notification for the initial call, success, explicit completion, or exhaustion. Reporting does not consume attempts. Durations describe scheduled sleep, not wall-clock elapsed time.

* `attempt`: the just-completed attempt, starting at 1. * `nextAttempt`: the attempt that follows the upcoming wait. * `maximumAttempts`: total permitted executions, including the first. * `remainingAttempts`: executions remaining, including the upcoming one. * `delay`: actual upcoming wait, after jitter and the delay cap. * `totalDelay`: sleep already performed, excluding the upcoming wait. * `result`: the last `Error` or `Again`, including its application payload.

**Fields**

  - `attempt` : Integer
  - `nextAttempt` : Integer
  - `maximumAttempts` : Integer
  - `remainingAttempts` : Integer
  - `delay` : Duration
  - `totalDelay` : Duration
  - `result` : X

## function `run`

Runs a fresh operation until it succeeds, stops, or exhausts its schedule.

The first attempt is immediate. Every later attempt follows one sleep. There is no sleep after success or the final error. Named timing options override the corresponding schedule field for this execution only.

An ordinary block returns `Result<X, E>`: `Ok` stops, `Error` retries, and exhaustion returns the last `Error` unchanged. An explicit block returns `Decision<X>`: `Done` stops, `Again` retries, and exhaustion returns the last `Again`. Match the returned decision to distinguish completion from exhaustion. Use one form consistently within a block.

Finite settings are normalized: attempts below one become one, negative durations become zero, backoff below one becomes one, jitter and random samples are clamped to 0..1. Non-finite Float settings are unsupported.

`Done(Error(...))` means the application stopped on a permanent error. `Again(Ok(response))` means an unacceptable HTTP status persisted until exhaustion. HTTP status classification and Retry-After handling are the application's responsibility; `run` has no HTTP-specific behavior.

The testing hooks are independent: replacing sleep keeps normal random sampling, and replacing randomness keeps real sleep. A random sample of 0 selects the lower jitter bound, 0.5 the base, and 1 the upper bound. With zero jitter no random sample is needed. lint:allow parameter-count — named options make each setting independent


```kex
run : Block<X> -> Schedule -> Integer -> Duration -> Float -> Duration -> Float -> Duration? -> (Duration -> Void) -> Block<Float> -> (Info<X> -> Void) -> X
```

