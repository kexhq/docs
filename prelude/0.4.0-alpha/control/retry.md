---
package: prelude
version: "0.4.0-alpha"
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

## record `Policy`

A bounded retry schedule. Attempts includes the initial call. Delays are immutable `Duration` values and never exceed `maximumDelay`.

**Fields**

  - `maximumAttempts` : Integer
  - `initialDelay` : Duration
  - `multiplier` : Float
  - `maximumDelay` : Duration
  - `maximumElapsed` : Duration? (optional)
  - `jitterFraction` : Float (optional)

## type `Predicate<E>`

Decides whether an application error is eligible for another attempt.



**Variants**

  - _(abstract)_

## type `Sleeper`

Performs one scheduled delay. Supplying this callback makes retry tests deterministic without sleeping.



**Variants**

  - _(abstract)_

## function `fixed`

Builds a constant-delay retry policy.

Fixed delays are predictable and useful for a local resource expected to become ready shortly. For many clients sharing a remote dependency, prefer exponential backoff with jitter to avoid synchronized retry bursts.


```kex
fixed(maximumAttempts, delay) : Integer -> Duration -> Policy
```


## function `exponential`

Builds a doubling backoff capped at `maximumDelay`.

The first retry waits `initialDelay`; later delays double until they reach the cap. Add jitter for production network traffic.


```kex
exponential : Integer -> Duration -> Duration -> Policy
```


## make `Policy`


#### `withMaximumElapsed`

Returns the same schedule with a bound on total scheduled sleep time.

The operation's own execution time is not counted; use operation-specific deadlines for that. A retry whose next delay would exceed this bound is not started.

```kex
withMaximumElapsed(maximumElapsed)
```

**Returns**: `Policy` — a copied policy with the elapsed bound

**Examples**

_`Retry.fixed(5, 1.seconds).withMaximumElapsed(2.seconds)`._

```kex

```

#### `withJitter`

Returns the same schedule with symmetric bounded jitter. A fraction of `0.25` selects each actual delay from 75% through 125% of its scheduled value. Fractions are clamped to `0.0..1.0`.

Jitter prevents many workers that failed together from retrying together. It changes delay timing, never the number of attempts or the backoff cap.

```kex
withJitter(fraction)
```

**Returns**: `Policy` — a copied policy with bounded jitter

**Examples**

_Spreading retries by up to 20 percent_

```kex
Retry.exponential(4, 1.seconds, 10.seconds).withJitter(0.2)
```

## function `run`

Runs `operation` until it succeeds or exhausts the policy.

The last application error is returned unchanged. This helper performs no network-specific classification: callers decide what operation to wrap.


```kex
run(policy, operation) : Policy -> Block<Result<X, E>> -> Result<X, E>
run(policy, operation) : Policy -> Predicate<E> -> Block<Result<X, E>> -> Result<X, E>
```


## function `runWith`

Runs with injected error classification and sleeping.

This is the deterministic testing seam: a fake sleeper can record durations or advance a virtual clock. Production callers normally use `Retry.run`.


```kex
runWith : Policy -> Predicate<E> -> Sleeper -> Block<Result<X, E>> -> Result<X, E>
```


## function `runWithRandom`

Runs with injected sleeping and a random source returning a value in `0.0..1.0`. Out-of-range test values are clamped. Production `run` uses a cryptographically secure backend source; this overload makes jitter specs deterministic.


```kex
runWithRandom : Policy -> Predicate<E> -> Sleeper -> Block<Float> -> Block<Result<X, E>> -> Result<X, E>
```


## function `attempt`


```kex
attempt(policy, predicate, sleeper, random, operation, number, delay, elapsed)
```


## module `Control.Retry.Retry`

The imported public namespace: `using Control.Retry` then `Retry.run(...)`.

## function `fixed`

Public imported alias of `Control.Retry.fixed`.


```kex
fixed(maximumAttempts, delay) : Integer -> Duration -> Policy
```


## function `exponential`

Public imported alias of `Control.Retry.exponential`.


```kex
exponential : Integer -> Duration -> Duration -> Policy
```


## function `run`

Public imported alias of `Control.Retry.run`.


```kex
run(policy, operation) : Policy -> Block<Result<X, E>> -> Result<X, E>
run(policy, operation) : Policy -> Predicate<E> -> Block<Result<X, E>> -> Result<X, E>
```


## function `runWith`

Deterministic seam with an injected sleeper, primarily for specifications.


```kex
runWith : Policy -> Predicate<E> -> Sleeper -> Block<Result<X, E>> -> Result<X, E>
```


## function `runWithRandom`

Deterministic seam with injected sleeping and random sampling.


```kex
runWithRandom : Policy -> Predicate<E> -> Sleeper -> Block<Float> -> Block<Result<X, E>> -> Result<X, E>
```

