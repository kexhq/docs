---
package: prelude
version: "0.4.0-alpha.2"
source: control/retry.kex
title: Control.Retry
entities:
  - { kind: module, name: "Control.Retry" }
---

# Control.Retry

## module `Control.Retry`

### `fixed`

```kex
fixed(maximumAttempts: Integer, delay: Duration) -> Policy
```

Builds a constant-delay retry policy.

**Parameters**

  - `maximumAttempts` — total calls including the first
  - `delay` — delay before each subsequent call

**Returns**: the retry schedule

**Examples**

_+Retry.fixed(3, 100.milliseconds)+._

```kex

```

### `exponential`

```kex
exponential : Integer -> Duration -> Duration -> Policy
```

Builds a doubling backoff capped at `maximumDelay`.

**Parameters**

  - `maximumAttempts` — total calls including the first
  - `initialDelay` — delay after the first failure
  - `maximumDelay` — upper bound for each delay

**Returns**: the retry schedule

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
