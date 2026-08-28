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

## record `Policy`

A bounded retry schedule. Attempts includes the initial call. Delays are immutable `Duration` values and never exceed `maximumDelay`.

**Fields**

  - `maximumAttempts` : Integer
  - `initialDelay` : Duration
  - `multiplier` : Float
  - `maximumDelay` : Duration
  - `maximumElapsed` : Duration? (optional)

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


```kex
fixed(maximumAttempts, delay) : Integer -> Duration -> Policy
```


## function `exponential`

Builds a doubling backoff capped at `maximumDelay`.


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

_`Retry.fixed(5, Duration.seconds(1)).withMaximumElapsed(Duration.seconds(2))`._

```kex

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


## function `attempt`


```kex
attempt(policy, predicate, sleeper, operation, number, delay, elapsed)
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

