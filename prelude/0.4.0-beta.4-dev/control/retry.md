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

## module `Control.Retry.Retry`

`run` calls the block immediately. `Ok` stops; `Error` waits and retries. When the schedule runs out, it returns the last error unchanged. Use `again` and `done` when your application needs to choose what to retry.

HTTP 429 and 503 responses are `Ok(response)`, so retrying those statuses requires an explicit decision. For writes, make sure repeating the request is safe, for example by using an idempotency key. Set request timeouts separately: the schedule limits sleep, not time spent inside the operation.

## record `Schedule`

Timing and attempt limits for `run`.

Defaults: three attempts, starting with a 100 ms wait, doubling up to 5 seconds, with 20% jitter. All fields are optional. A schedule holds settings. Reusing it starts each run from attempt one.

* `attempts`: maximum executions, including the first; default 3. * `delay`: initial base wait; default 100 milliseconds. * `backoff`: base-delay multiplier; default 2.0, or 1.0 for fixed waits. * `maximumDelay`: cap on each actual wait, including jitter; default 5 seconds. * `jitter`: symmetric proportional variation; default 0.2, or 0.0 to disable. * `maximumTotalDelay`: cumulative sleep allowance; default `None`.   Operation execution time is excluded. A wait that exceeds the remaining   allowance ends the run without sleeping or calling the operation again.

**Fields**

  - `attempts` : Integer (optional)
  - `delay` : Duration (optional)
  - `backoff` : Float (optional)
  - `maximumDelay` : Duration (optional)
  - `jitter` : Float (optional)
  - `maximumTotalDelay` : Duration? (optional)

## type `Decision<X>`

Whether to retry, together with the last result. `Done(value)` means the block stopped deliberately. `Again(value)` returned by `run` means the schedule was exhausted before completion. The value inside can be any application result, including an `Error`.



**Variants**

  - `Again(X)`
  - `Done(X)`

## function `again`

Retry this operation if the schedule has room for another attempt.


```kex
again(value) : X -> Decision<X>
```


## function `done`

Stop now. The supplied value may be a success or a permanent failure.


```kex
done(value) : X -> Decision<X>
```


## record `Info<X>`

Progress passed to `onRetry` before the next wait.

The callback runs only when another attempt is allowed. It does not run for the first call, a successful result, `done`, or exhaustion. Durations count scheduled sleep; they exclude time spent in the operation.

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

Call the block until it succeeds, returns `done`, or runs out of attempts or sleep time.

The first attempt is immediate. Every later attempt follows one sleep. There is no sleep after success or the final error. Named timing options override the corresponding schedule field for this execution only.

Return a `Result` from the block for automatic retries: `Ok` stops and `Error` retries. If no more retries are allowed, `run` returns the last error.

Return `done(value)` or `again(value)` to make the decision yourself. The final `Done` means the block chose to stop; `Again` means it wanted another try but the schedule ran out. Use one return form throughout the block. Runtime faults propagate; they are not retried.

Out-of-range settings are adjusted: attempts below one become one, negative durations become zero, backoff below one becomes one, jitter and random samples are clamped to 0..1. Non-finite Float settings are unsupported.

`Done(Error(...))` means the application stopped on a permanent error. `Again(Ok(response))` means an unacceptable HTTP status persisted until exhaustion. HTTP status classification and Retry-After handling are the application's responsibility; `run` has no HTTP-specific behavior.

The testing hooks are independent: replacing sleep keeps normal random sampling, and replacing randomness keeps real sleep. A random sample of 0 selects the lower jitter bound, 0.5 the base, and 1 the upper bound. With zero jitter no random sample is needed. lint:allow parameter-count — named options make each setting independent


```kex
run : Block<X> -> Schedule -> Integer -> Duration -> Float -> Duration -> Float -> Duration? -> (Duration -> Void) -> Block<Float> -> (Info<X> -> Void) -> X
```

