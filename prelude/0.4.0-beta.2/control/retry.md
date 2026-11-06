---
package: prelude
version: "0.4.0-beta.2"
source: control/retry.kex
title: Control.Retry
entities:
  - { kind: module, name: "Control.Retry" }
---

# Control.Retry

## module `Control.Retry`

Bounded retries for operations whose failures can be classified by the application.

A retry is never automatically safe just because an error was temporary. The caller owns the operation and, where necessary, a predicate that excludes permanent failures and non-idempotent work. Policies bound attempts, delay, and optionally total sleep so a dependency cannot stall the program forever.

```kex
using Control.Retry

let policy = Retry.exponential(4, 100.milliseconds, 2.seconds)
  .withJitter(0.2)
Retry.run(policy, ~retryable?) do
  client.get("https://api.example.com/inventory")
end
```

### `fixed`

```kex
fixed(maximumAttempts: Integer, delay: Duration) -> Policy
```

Builds a constant-delay retry policy.

Fixed delays are predictable and useful for a local resource expected to become ready shortly. For many clients sharing a remote dependency, prefer exponential backoff with jitter to avoid synchronized retry bursts.

**Parameters**

  - `maximumAttempts` — total calls including the first
  - `delay` — delay before each subsequent call

**Returns**: the retry schedule

**Examples**

_Waiting briefly for a local test server to start_

```kex
let policy = Retry.fixed(5, 50.milliseconds)
```

### `exponential`

```kex
exponential : Integer -> Duration -> Duration -> Policy
```

Builds a doubling backoff capped at `maximumDelay`.

The first retry waits `initialDelay`; later delays double until they reach the cap. Add jitter for production network traffic.

**Parameters**

  - `maximumAttempts` — total calls including the first
  - `initialDelay` — delay after the first failure
  - `maximumDelay` — upper bound for each delay

**Returns**: the retry schedule

**Examples**

_Backing off calls to a busy upstream service_

```kex
Retry.exponential(5, 200.milliseconds, 5.seconds).withJitter(0.25)
```

### `run`

```kex
run(policy: Policy, operation: Block<Result<X, E>>) -> Result<X, E>
run(policy: Policy, operation: Predicate<E>) -> Block<Result<X, E>> -> Result<X, E>
```

Runs `operation` until it succeeds or exhausts the policy.

The last application error is returned unchanged. This helper performs no network-specific classification: callers decide what operation to wrap.

**Parameters**

  - `policy` — the bounded schedule
  - `operation` — a fresh attempt

**Returns**: the first success or final failure

**Examples**

_Retrying an idempotent health check_

```kex
Retry.run(Retry.fixed(3, 250.milliseconds)) do
  HTTP.get("https://service.example.com/health")
end
```

### `runWith`

```kex
runWith : Policy -> Predicate<E> -> Sleeper -> Block<Result<X, E>> -> Result<X, E>
```

Runs with injected error classification and sleeping.

This is the deterministic testing seam: a fake sleeper can record durations or advance a virtual clock. Production callers normally use `Retry.run`.

**Parameters**

  - `policy` — the bounded schedule
  - `predicate` — whether an error may be retried
  - `sleeper` — performs or records each scheduled delay
  - `operation` — a fresh attempt

**Returns**: the first success or final failure

### `runWithRandom`

```kex
runWithRandom : Policy -> Predicate<E> -> Sleeper -> Block<Float> -> Block<Result<X, E>> -> Result<X, E>
```

Runs with injected sleeping and a random source returning a value in `0.0..1.0`. Out-of-range test values are clamped. Production `run` uses a cryptographically secure backend source; this overload makes jitter specs deterministic.

### `attempt`

```kex
attempt(policy: Policy, predicate: Predicate<E>, sleeper: Sleeper, random: Block<Float>, operation: Block<Result<X, E>>, number: Integer, delay: Duration, elapsed: Duration) -> Result<X, E>
```

## record `Policy`

A bounded retry schedule. Attempts includes the initial call. Delays are immutable `Duration` values and never exceed `maximumDelay`.

**Fields**

  - `maximumAttempts` : [Integer](../number.md#make-integer)
  - `initialDelay` : [Duration](../units.md#record-duration)
  - `multiplier` : [Float](../number.md#make-float)
  - `maximumDelay` : [Duration](../units.md#record-duration)
  - `maximumElapsed` : [Duration](../units.md#record-duration)? (optional)
  - `jitterFraction` : [Float](../number.md#make-float) (optional)

### Methods

#### `withMaximumElapsed`

```kex
withMaximumElapsed(maximumElapsed: Duration) -> Policy
```

Returns the same schedule with a bound on total scheduled sleep time.

The operation's own execution time is not counted; use operation-specific deadlines for that. A retry whose next delay would exceed this bound is not started.

**Parameters**

  - `maximumElapsed` — maximum cumulative scheduled delay

**Returns**: a copied policy with the elapsed bound

**Examples**

_+Retry.fixed(5, 1.seconds).withMaximumElapsed(2.seconds)+._

```kex

```

#### `withJitter`

```kex
withJitter(fraction: Float) -> Policy
```

Returns the same schedule with symmetric bounded jitter. A fraction of `0.25` selects each actual delay from 75% through 125% of its scheduled value. Fractions are clamped to `0.0..1.0`.

Jitter prevents many workers that failed together from retrying together. It changes delay timing, never the number of attempts or the backoff cap.

**Parameters**

  - `fraction` — maximum proportional variation on either side

**Returns**: a copied policy with bounded jitter

**Examples**

_Spreading retries by up to 20 percent_

```kex
Retry.exponential(4, 1.seconds, 10.seconds).withJitter(0.2)
```

## type `Predicate<E>`

Decides whether an application error is eligible for another attempt.



## type `Sleeper`

Performs one scheduled delay. Supplying this callback makes retry tests deterministic without sleeping.



## module `Control.Retry.Retry`

The imported public namespace: `using Control.Retry` then `Retry.run(...)`.

### `fixed`

```kex
fixed(maximumAttempts: Integer, delay: Duration) -> Policy
```

Public imported alias of `Control.Retry.fixed`.

### `exponential`

```kex
exponential : Integer -> Duration -> Duration -> Policy
```

Public imported alias of `Control.Retry.exponential`.

### `run`

```kex
run(policy: Policy, operation: Block<Result<X, E>>) -> Result<X, E>
run(policy: Policy, operation: Predicate<E>) -> Block<Result<X, E>> -> Result<X, E>
```

Public imported alias of `Control.Retry.run`.

### `runWith`

```kex
runWith : Policy -> Predicate<E> -> Sleeper -> Block<Result<X, E>> -> Result<X, E>
```

Deterministic seam with an injected sleeper, primarily for specifications.

### `runWithRandom`

```kex
runWithRandom : Policy -> Predicate<E> -> Sleeper -> Block<Float> -> Block<Result<X, E>> -> Result<X, E>
```

Deterministic seam with injected sleeping and random sampling.
