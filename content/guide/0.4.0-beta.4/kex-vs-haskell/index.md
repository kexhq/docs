---
id: "guide-0-4-0-beta-4-kex-vs-haskell"
title: "Kex vs Haskell"
description: "Translate functional ideas while accounting for evaluation and effect differences."
path: "/guide/0.4.0-beta.4/kex-vs-haskell/"
draft: false
template: "page"
---
Kex and Haskell both make immutable data, pure functions, pattern matching, and static type checking central to ordinary programming. The largest changes for a Haskell programmer are Kex's eager ordinary calls, explicit function capture, receiver-oriented syntax, and `foul` effect boundary.

This page targets Kex 0.4.0-beta.4 and the conventional Haskell language model. GHC extensions can add capabilities beyond the baseline described here. Haskell's defining features include non-strict evaluation and polymorphic static types. [Haskell language report](https://www.haskell.org/onlinereport/intro.html)

## At a glance

| Idea | Haskell | Kex |
| --- | --- | --- |
| Ordinary evaluation | Non-strict | Eager; explicit streams provide laziness |
| Function application | `add 2 3`; partial application is ordinary application | `add(2, 3)`; capture or partially apply with `~add(2)` |
| Absence | `Maybe a`: `Just a` or `Nothing` | `Optional<A>` or `A?`: `Just(A)` or `None` |
| Reported failure | Often `Either e a` | Commonly `Result<A, E>` |
| Effects | Actions represented by types such as `IO a` | Effectful functions declared with `foul` |
| Shared behavior | Type classes and instances | Traits and `make` implementations |
| Text | Prelude `String` is a character list | `String` and `[Char]` are distinct |

The resemblance between a type class and a trait is useful for orientation, but does not establish identical resolution rules or support for every GHC type-system extension. Haskell classes express constraints and instances; Kex's guide explains its own [trait contracts](../traits/) and receiver dispatch. [Haskell class tutorial](https://www.haskell.org/tutorial/classes.html)

## Transforming a collection

In Haskell:

```haskell
squaresOfEvens :: [Integer] -> [Integer]
squaresOfEvens xs = map (\n -> n * n) (filter even xs)

example :: [Integer]
example = squaresOfEvens [1, 2, 3, 4] -- [4, 16]
```

In Kex:

```kex
let squaresOfEvens(values: [Integer]) -> [Integer] do
  values.filter { |n| n % 2 == 0 }.map { |n| n * n }
end
assert(squaresOfEvens([1, 2, 3, 4]) == [4, 16])
```

The Kex chain reads in traversal order. UFCS lets the receiver supply the first argument; a dot does not mean an object is being mutated. The list pipeline is eager. For an unbounded sequence, choose a stream and bound consumption:

```kex
let naturals = Stream.Sequence(from: 0) { |n| n + 1 }
assert(naturals.map { |n| n * n }.take(4) == [0, 1, 4, 9])
```

Do not translate a productive Haskell infinite-list expression into an eagerly built Kex list. Conversely, explicit streams do not make all surrounding expressions lazy. Haskell's non-strict semantics are a language-wide distinction, not just a collection API. [Haskell function evaluation](https://www.haskell.org/tutorial/functions.html)

## Capturing and partially applying functions

Haskell's `map (add 10) values` corresponds to an explicit partial application in Kex:

```kex
let add(left: Integer, right: Integer) -> Integer = left + right
let addTen = ~add(10)
assert([1, 2].map(addTen) == [11, 12])
assert([1, 2].map(~add(10)) == [11, 12])
```

`~add` captures the function. Supplying arguments after the capture fixes them; `_` leaves an explicit argument position open. Ordinary Kex calls use their declared call shape. Do not assume omitting an argument always creates another function.

## Pure formatting and effectful output

Haskell distinguishes a pure result from an IO action:

```haskell
greeting :: String -> String
greeting name = "Hello, " ++ name

main :: IO ()
main = putStrLn (greeting "Ada")
```

Kex makes the boundary visible on the declaration:

```kex
let greeting(name: String) -> String = "Hello, ${name}"
foul printGreeting(name: String) -> Void = IO.printLine(greeting(name))
printGreeting("Ada")
```

A pure Kex function cannot call `printGreeting`; `main` and top-level executable expressions can. A foul call executes an effectful operation rather than returning an `IO<A>` action merely because it is foul. Kex's block syntax is also not Haskell's monadic `do` notation. [Haskell IO model](https://www.haskell.org/onlinereport/haskell2010/haskellch7.html)

## Data and migration choices

Kex sum types and `match` make Haskell-style domain modeling a natural starting point. Translate `Maybe` and `Either` deliberately: constructor names and the result type's parameter order differ. `.try` has failure propagation and rescue behavior; it is not an automatic translation of an `Either` computation.

Keep pure transformations pure, but revisit evaluation order, strictness, string representation, and resource lifetimes. Kex also permits local `var` reassignment and provides process-owned state; neither requires turning every immutable algorithm into a mutable one.

A migration still needs a dependency and tooling audit. Haskell libraries do not become Kex modules, and a Haskell concurrency abstraction does not automatically become a BEAM process. This comparison makes no throughput, memory-use, or compiler-performance claim.

Continue with [functions](../functions/), [types](../types/), [errors](../errors/), and [streams](../streams/).
