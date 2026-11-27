---
id: "guide-0-4-0-beta-4-kex-vs-ruby"
title: "Kex vs Ruby"
description: "Familiar syntax with different rules for mutation, dispatch, and effects."
path: "/guide/0.4.0/kex-vs-ruby/"
draft: false
template: "page"
---
If you know Ruby, Kex's blocks, `?` names, and chained calls will look familiar. Try reading the examples below as small translations. The syntax may be similar, but a Kex `let` binding, `!` call, and `foul` function have specific rules.

This comparison targets Kex 0.4.0 and ordinary Ruby behavior. External Ruby type-checking tools can add checks, but Ruby itself gives objects types while variable names are not statically restricted to one type. [Ruby language comparison](https://www.ruby-lang.org/en/documentation/ruby-from-other-languages/to-ruby-from-c-and-cpp/)

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
let result = values.filter { |n| n.even? }.map { |n| n * 10 }
assert(result == [20, 40])
```

Both examples produce `[20, 40]`. Kex binds an unchanged local with `let` and uses `filter` for this selection. You can also pass a named function with `~name` or use receiver shorthand such as `&.count`.

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

In Ruby, `earlier` sees `[1, 2, 3]` because both names refer to the same array. In Kex, `earlier` remains `[1, 2]`: `push!` rebinds the mutable `items` variable to a new list. Calling `push` without `!` returns a list but does not rebind `items`. [Ruby assignment and references](https://www.ruby-lang.org/en/documentation/faq/4/)

Ruby's `!` is a naming convention whose meaning depends on the method. In Kex, the suffix on this call requests rebinding of a mutable receiver.

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

`customer.visit` returns a new record with one visit, while `customer` still has zero. `@name` reads the receiver's `name` field, and `New` builds the updated value. Constructors and constants can live in a module with the record's name; traits describe behavior shared by several types.

When translating a class, decide where its data, constructors, and shared behavior belong. Inherited behavior, generated methods, and object identity may need a new design rather than a line-by-line translation.

## Effects and errors are visible

A Ruby method may print or read a file without changing its declaration. In Kex, mark the function that performs IO `foul` and keep formatting as a pure `let` function. That makes it clear which part of the program depends on the outside world.

A missing lookup often produces `None` or a result failure. Handle the wrapper explicitly with a match, transformation, or deliberate default. Ruby's `nil`, safe navigation, exception conventions, and bang methods are not interchangeable with Kex optional values or `.try` recovery.

For an existing Ruby application, inventory its gems, Rails components, native extensions, and metaprogramming before planning a port. Similar syntax helps with reading an example; it does not bring those dependencies into Kex.

Continue with [records](../records/), [effects](../effects/), [errors](../errors/), and [blocks](../blocks/).
