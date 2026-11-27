---
id: "guide-0-4-0-beta-4-traits"
title: "Traits"
description: "Define contracts and reuse behavior across types."
path: "/guide/0.4.0/traits/"
draft: false
template: "page"
---
A trait describes behavior that several types can provide. The next example asks for a label, then builds a decorated label from it:

```kex
trait HasLabel do
  label : () -> String
  let decorated -> String = "[${this.label}]"
end

record Project do
  name : String
end

make Project, implement: HasLabel do
  let label -> String = @name
end

let project = Project { name: "Guide" }
assert(project.label == "Guide")
assert(project.decorated == "[Guide]")
IO.printLine(project.decorated)
```

```output filename="OUTPUT"
[Guide]
```

`Project` supplies the required `label` method, so it also gets the default `decorated` method. A method with a signature but no body is required; a method with a body supplies a default. The compiler checks that implementations have compatible signatures. A type can implement several traits or override a default.

`This` in a trait signature denotes the implementing type. `this` in a default body is the receiver value.

## Choose a meaningful contract

The `HasLabel` trait asks for one operation and builds another from it. That is a useful size for a contract: a type can satisfy it without taking on unrelated behavior. For comparison, `Comparable` asks for `Less`, `Equal`, or `Greater`. Returning only a boolean for “less than” would leave equality and greater-than indistinguishable.

The same idea applies to IO handles. A function that only writes can accept `Writable`, whether the caller gives it a file or standard output. The function depends on the operation it needs instead of one concrete handle type.

## Collection contracts

Lists, ranges, strings, and maps all support some traversal operations through `Foldable` and `Enumerable`. Their results still depend on the collection. Mapping characters into numbers gives a list of numbers; a string-specific operation can instead preserve text.

Streams and feeds also expose names such as `.map`, but a feed is consumed as you read it. Shared method names do not make their consumption behavior the same.

## Keep effects in the contract

If a trait method is pure, its implementations must be pure too. A type cannot make `label` print to the screen just because it wants a log message. Return the label from the method and print it at an effectful boundary. If the service itself needs IO, declare that in its contract.

Use [capabilities](../effects/) when you want a replaceable implementation for an effectful service in a lexical region, such as a clock or filesystem.
