---
id: "guide-0-4-0-beta-4-syntax"
title: "Syntax and control flow"
description: "Bindings, expressions, branches, loops, and punctuation."
path: "/guide/0.4.0-beta.4/syntax/"
draft: false
template: "page"
---
Kex source files end in `.kex`. Newlines normally separate statements; `#` starts a comment. Function calls use parentheses around positional arguments. A trailing block can use `{ ... }` or `do ... end`.

## Bindings and expressions

```kex
foul demonstrateSyntax1() do
  let name = "Ada"
  var visits = 1
  visits = visits + 1
  assert("Hello, ${name}" == "Hello, Ada")
  assert(visits == 2)
end
demonstrateSyntax1()
```

`let` binds a value or defines a function. `var` permits reassignment. Types are usually inferred; add an annotation when it makes an interface or intent clearer.

A block-bodied function returns its last expression. `return` exits it early. `main do ... end` marks program entry; top-level executable expressions also run in an effectful context. Prefer an explicit `main` for an application.

## Branches produce values

```kex
let label(n: Integer) -> String do
  if n < 0
    "negative"
  elif n == 0
    "zero"
  else
    "positive"
  end
end

let size = 8 > 5 then "large" else "small"
assert(label(-1) == "negative")
assert(size == "large")
```

Use `condition then a else b` for a short expression. A multiline `if` uses a newline before its body; the compact expression form uses `then`. Keep the style consistent within a file, and make branch result types compatible.

A trailing condition is convenient for a guard:

```kex
let safeLabel(n: Integer) -> String do
  return "out of range" if n > 100
  label(n)
end
assert(safeLabel(101) == "out of range")
```

## Loops

Use collection methods when transforming a collection. For an explicitly stateful algorithm, `while` and `loop` support `break` and `next`:

```kex
foul demonstrateSyntax2() do
  var total = 0
  var index = 0
  while index < 5 do
    index = index + 1
    next if index == 3
    total = total + index
  end
  assert(total == 12)

  var attempts = 0
  loop do
    attempts = attempts + 1
    break if attempts == 2
  end
  assert(attempts == 2)
end
demonstrateSyntax2()
```

`next` skips the rest of the current iteration; `break` leaves the loop. Both need an enclosing loop. `loop` and `while` use `do ... end`.

## Reading the punctuation

| Spelling | Meaning |
| --- | --- |
| `: Integer` | Type annotation |
| `-> String` | Function result type |
| `pattern => expression` | Pattern-matching arm |
| `name: value` | Named argument or record field |
| `:ready` | Atom value |
| `A?` | Optional type |
| `empty?` | Predicate name |
| `!condition` | Boolean negation |
| `items.push!(x)` | Rebind a mutable receiver to the call result |
| `~function` | Capture a named function |
| `&.field` | A one-argument block reading its receiver |
| `@field` | Current receiver's field inside `make` or `serving` |

Arithmetic uses `+`, `-`, `*`, `/`, and `%`; comparisons use `==`, `!=`, `<`, `<=`, `>`, and `>=`. `&&` and `||` short-circuit. Parenthesize an expression when precedence would make a reader pause. Kex has a fixed operator vocabulary; fluent calls provide pipelines.

Continue with [Values and collections](../values/).
