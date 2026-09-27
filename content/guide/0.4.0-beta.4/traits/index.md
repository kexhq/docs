---
id: "guide-0-4-0-beta-4-traits"
title: "Traits"
description: "Define contracts and reuse behavior across types."
path: "/guide/0.4.0-beta.4/traits/"
draft: false
template: "page"
---
A trait declares behavior that several types share. Required methods have signatures; methods with bodies provide defaults. A `make` block declares an implementation.

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
```

`This` in a trait signature denotes the implementing type. `this` in a default body is the receiver value. The compiler checks that required methods exist with compatible signatures. A type can implement multiple traits and override a default by providing its own method.

## Choose a meaningful contract

A useful trait captures a small set of operations with clear behavior. For example, `Comparable` asks for a comparison returning `Less`, `Equal`, or `Greater`, which sorting and extrema can use. A boolean less-than result alone cannot distinguish equality from greater-than.

Likewise, `Readable` and `Writable` describe handle operations. A function that only writes can accept `Writable`, allowing files and standard output to share the same helper without pretending they are the same concrete record.

## Collection contracts

The standard library implements collection behavior through `Foldable` and `Enumerable`. Lists, ranges, strings, and maps share traversal operations, while their element and result meanings still differ. A string mapping characters into numbers gives a list; a string-specific operation can preserve a string.

Streams and feeds expose similar method names but have different consumption semantics. Do not assume that every object with `.map` is an eager, reusable collection.

## Keep effects in the contract

An implementation must respect the trait's effect boundary. A pure operation cannot acquire IO merely because one implementing type wants to log or read a file. Keep formatting pure and perform output separately, or declare an effectful contract when effects are the purpose of the operation.

Use [capabilities](../effects/) when you want a replaceable implementation for an effectful service in a lexical region, such as a clock or filesystem.
