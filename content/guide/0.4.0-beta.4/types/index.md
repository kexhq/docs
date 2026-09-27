---
id: "guide-0-4-0-beta-4-types"
title: "Types"
description: "Inference, annotations, generics, aliases, and nominal distinctions."
path: "/guide/0.4.0-beta.4/types/"
draft: false
template: "page"
---
Kex checks types before running a program. Inference keeps local code light; annotations make boundaries explicit and improve diagnostics when an implementation changes.

## Read a type

| Type | Meaning |
| --- | --- |
| `[String]` | List of strings |
| `(String, Integer)` | Two-element tuple |
| `String?` | `Optional<String>` |
| `Result<Integer, String>` | Integer success or string error |
| `Integer -> String` | Function from an integer to a string |
| `Process<Message>` | Process handle accepting Message values |

Single-letter names such as `A`, `B`, `K`, and `V` denote generic type variables. Give concrete types multi-letter names.

```kex
let identity(value: A) -> A = value
let title: String = identity("Kex")
let count: Integer = identity(3)
assert(title == "Kex")
assert(count == 3)
```

Generics describe a relationship: the result of `identity` has the same type as its argument. `Any` loses that relationship. Prefer a generic parameter when the relationship matters, and a concrete or sum type when the alternatives are known.

## Aliases and sum types

```kex
type Names = [String]
type Delivery = Queued | Sent(String) | Failed(String)
let names: Names = ["Ada", "Grace"]
let delivery: Delivery = Sent("message-123")
assert(names.count == 2)
assert(delivery == Sent("message-123"))
```

An alias gives an existing shape a name. A sum type introduces named alternatives, optionally with payloads. Model business states with alternatives that carry exactly the data each state needs, then handle them with a `match`.

## Distinct types

A distinct type separates values that share a representation but should not be interchangeable:

```kex
distinct type CustomerId = Integer
distinct type InvoiceId = Integer
let customer = 42.as(CustomerId)
let invoice = 42.as(InvoiceId)
let customerNumber: Integer = customer.as(Integer)
assert(customerNumber == 42)
```

The distinction is checked statically and erased at runtime. `.as(...)` is an explicit representation conversion; it does not validate an identifier against a database or enforce a business invariant. Define a validating constructor returning `Result` when construction itself can fail.

Use `.to(Target)` for fallible value conversion: `"42".to(Integer)` is `Just(42)`, whereas invalid numeric text gives `None`.

## Type information

```kex
assert(Type.of(42).name == "Integer")
assert("42".to(Integer) == Just(42))
assert("unknown".to(Integer) == None)
```

`Type.of` uses static information where available and runtime information otherwise. Runtime inspection can lose generic or distinct-type information. It is useful for diagnostics, but should not replace a checked data model.

When a type error appears, inspect the first error at its source. A mismatch inside a callback can cause several later errors in the surrounding chain. Add annotations at that boundary before changing unrelated code or disabling checking.
