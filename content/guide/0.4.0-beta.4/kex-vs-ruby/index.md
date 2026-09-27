---
id: "guide-0-4-0-beta-4-kex-vs-ruby"
title: "Kex vs Ruby"
description: "Familiar syntax with different rules for mutation, dispatch, and effects."
path: "/guide/0.4.0-beta.4/kex-vs-ruby/"
draft: false
template: "page"
---
Kex will look familiar to a Ruby programmer: `do ... end`, trailing blocks, predicate names ending in `?`, and chains of collection operations. The important adjustment is that Kex uses immutable values, checked types, and explicit effectful functions. Read familiar punctuation according to Kex's rules rather than assuming Ruby semantics.

This comparison targets Kex 0.4.0-beta.4 and ordinary Ruby behavior. External Ruby type-checking tools can add checks, but Ruby itself gives objects types while variable names are not statically restricted to one type. [Ruby language comparison](https://www.ruby-lang.org/en/documentation/ruby-from-other-languages/to-ruby-from-c-and-cpp/)

## At a glance

| Idea | Ruby | Kex |
| --- | --- | --- |
| Function-like declaration | `def` defines a method | `let` defines a pure function; `foul` permits effects |
| Data and behavior | Classes, objects, modules, and mixins | Records, modules, `make`, and traits |
| Collection transformation | `map`, `select`, blocks | `map`, `filter`, blocks |
| Mutable data | Many objects can change in place | Values remain immutable; `var` permits rebinding |
| Bang suffix | A naming convention with method-specific behavior | Reassignment syntax for a mutable receiver |
| Missing value | Often `nil` | Often `Optional<A>` with `Just` or `None` |
| Positional arguments | Parentheses are often optional | Use parentheses |

Ruby methods and their receivers are part of its object model. Kex's `value.operation(arg)` can resolve a free function through UFCS or a receiver method in `make`; it does not imply Ruby's class lookup or monkey-patching semantics. [Ruby methods](https://docs.ruby-lang.org/en/4.0/syntax/methods_rdoc.html)

## Familiar collection code

Ruby:

```ruby
values = [1, 2, 3, 4]
result = values.select { |n| n.even? }.map { |n| n * 10 }
raise "unexpected result" unless result == [20, 40]
```

Kex:

```kex
let values = [1, 2, 3, 4]
let result = values.filter { |n| n % 2 == 0 }.map { |n| n * 10 }
assert(result == [20, 40])
```

The block shape is almost identical. Kex binds an unchanged local with `let`, and uses `filter` for this selection. You can also pass a named function using `~name` or use receiver shorthand such as `&.count`.

## Mutation is the major trap

Ruby variables can refer to the same mutable array:

```ruby
items = [1, 2]
earlier = items
items.push(3)
raise "expected shared array" unless earlier == [1, 2, 3]
```

Kex's superficially similar code preserves the earlier value:

```kex
foul demonstrateRebinding() do
  var items = [1, 2]
  let earlier = items
  items.push!(3)
  assert(items == [1, 2, 3])
  assert(earlier == [1, 2])
end
demonstrateRebinding()
```

`push!` here means rebind `items` to the result of `items.push(3)`. It requires `var`. Without the bang, Kex's `push` returns a new list; ignoring that result does not change the old one. Ruby assignment and method arguments can share references to mutable objects, which explains the different alias behavior. [Ruby assignment and references](https://www.ruby-lang.org/en/documentation/faq/4/)

Ruby's bang suffix does not universally mean mutation: its interpretation belongs to the particular API. Do not transfer that naming convention to Kex's syntactic rebinding rule.

## From objects to records and methods

```kex
record Customer do
  name : String
  visits : Integer = 0
end

make Customer do
  let greeting -> String = "Hello, ${@name}"
  let visit -> Customer = New { visits: @visits + 1 }
end

let customer = Customer { name: "Ada" }
let returning = customer.visit
assert(customer.visits == 0)
assert(returning.visits == 1)
assert(returning.greeting == "Hello, Ada")
```

`@name` resembles a Ruby instance-variable read, but here it abbreviates the record receiver's field. `New` returns an updated record. It does not mutate an object behind a reference. Type-level constructors and constants belong in a module of the record's name; shared contracts belong in traits.

This is a design translation, not a class-to-record text substitution. Revisit inherited behavior, dynamic method generation, callbacks that mutate captured state, and object identity assumptions.

## Effects and errors are visible

A Ruby method may print or read a file without changing its declaration. A Kex function doing that work must be `foul`; pure formatting can remain `let`. Put IO in a small outer layer rather than marking every function foul to resemble an existing Ruby object.

A missing lookup often produces `None` or a result failure. Handle the wrapper explicitly with a match, transformation, or deliberate default. Ruby's `nil`, safe navigation, exception conventions, and bang methods are not interchangeable with Kex optional values or `.try` recovery.

Kex is also not a Ruby execution environment. Gems, Rails applications, native extensions, and Ruby metaprogramming APIs require separate integration or replacement decisions. Similar-looking syntax does not establish ecosystem compatibility or comparable runtime performance.

Continue with [records](../records/), [effects](../effects/), [errors](../errors/), and [blocks](../blocks/).
