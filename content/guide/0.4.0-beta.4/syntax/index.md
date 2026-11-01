---
id: "guide-0-4-0-beta-4-syntax"
title: "Syntax and control flow"
description: "Bindings, expressions, branches, loops, and punctuation."
path: "/guide/0.4.0-beta.4/syntax/"
draft: false
template: "page"
---
As a convention most source files' extension is `.kex`, while templates are `.ket` (Kex template), while test file names end with `.spec.kex`.

Every Kex program contains a special block called `main` which signifies the entry point of the program:

```kex filename="hello.kex"
main do
  IO.printLine("Hello, world!")
end
```

## Bindings and expressions

```kex filename="immutable.kex"
main do
  let x = 10
end
```

In the example above `let` binds the value `10`  to the binding called `x`. `let` bindings are always immutable, reassigning them is an error:

```kex filename="error_immutable.kex"
main do
  let x = 10
  x = 20       # ERROR: Cannot assign to immutable binding: x
  let x = 11   # ERROR: Cannot redeclare immutable binding: x
end
```

Immutability allows the compiler to optimize code generation and helps the programmer to avoid accidental variable changes. However, lot of algorithms are not easy or 

### Mutable bindings

To create mutable bindings, actual variables use the `var` keyword:

```kex filename="mutable.kex"
main do
  var y = 10
  y = 20

  IO.printLine(y) # Prints: 20

  y = y + 10
  IO.printLine(y) # Prints: 30
end
```

| Output |
| --- |
| > 20 >  > 30 |

Redeclarations are not  allowed, even via `var`, also bindings must be declared either mutable or immutable, but never both:

```kex filename="error_decl.kex"
main do
  var y = 10
  var y = 20      # ERROR: redeclaration
  var y = "hello" # ERROR: redeclaration with a different type
  
  let y = 0       # ERROR: redeclared, was var

  a = 2           # ERROR: Undefined variable: `a`
end
```

> [!TIP]
> **Always prefer immutable datastructures over mutable ones.** Immutability helps eliminate bugs in the code, since the source of data is more predictable (changes cannot be made from unknown places, only the source).

### Comparisions

`<`, `>`, `==` and such operators allow comparisions to be made between values. Each of them evaulates to either `true` or `false`. These [booleans](https://en.wikipedia.org/wiki/Boolean_data_type) then could then be used for making decision in control structures.

| Spelling | Meaning |
| --- | --- |
| `x < y` | Evaluates to `true` if `x` is **smaller** than `y` |
| `x > y` | Evaluates to `true` if `x` is **greater** than `y` |
| `x <= y` | Evaluates to `true` if `x` is **smaller or equal to **`y` |
| `x >= y` | Evaluates to `true` if `x` is **greater or equal to** `y` |
| `x == y` | Evaluates to `true` if `x` is the **same** as `y` |
| `x != y` | Evaluates to `true` if `x` is **different** to `y` |

Boolean values also come with their own operators:

| Spelling | Meaning |
| --- | --- |
| `x && y` | Evaluates to `true` if **both** `x`  and `y` is `true` |
| `x \|\| y` | Evaluates to `true` if **either**  `x` or `y` is `true` |
| `!x` | Evaluates to `true` if `x` is `false`, or `false` if `x` is `true`. (Always the **opposite**) |

This operators allows the creation of complex expression, which can be embedded into each other, if needed. `()` are used to define evaluation order.

> [!NOTE]
> "Evaluation order" is called precedence and later chapters will expand on it more.

```kex filename="bool.kex"
main do
  let a = 1
  let b = 2
  let c = false
 
  let r = (a < b) && (a != b) || (c || true)
  IO.printLine(r)
end
```

| Output |
| --- |
| > true |

> [!IMPORTANT]
> **Operators don't have to evaluate their operands in every case.**
>
> If the left side of `||` evaluates to `true`, there is no need to also check its right side, because it only needs either of them to be `true`.
>
> This is called [short-circuit evaluation](https://en.wikipedia.org/wiki/Short-circuit_evaluation) and allows the compiler to remove unnecessary computation in cases where that computation could not affect the end result logically:
>
> ```kex filename="wont_print.kex"
> foul print do
>   IO.printLine("This will never be seen")
>   true
> end
>
> main do
>   let x = true || print # Output will be empty
> end
> ```

## Branches

### If ... else

Branches are defined via the keyword `if`

```kex filename="if.kex"
main do
  let n = 5

  if n == 5
    IO.printLine("is 5")
  end
end
```

| Output |
| --- |
| > is 5 |

While the optional `else` branch runs if the condition doesn't hold:

```kex filename="if.kex"
main do
  let n = 5

  if n == 0
    IO.printLine("is zero")
  else
    IO.printLine("non-zero")
  end
end
```

| Output |
| --- |
| > non-zero |

### Elif

For multiple conditions `elif` can be used:

```kex
main do
  let n = 5

  let x = if n < 0
    "negative"
  elif n == 0
    "zero"
  else
    "positive"
  end

  IO.printLine(x)
end
```

| Output |
| --- |
| > positive |

This is possible, because `if` always returns the last expression's value of the successfully evaulated branch, `positive` in the above example.

### Shortened condition

There is a shortened version of the conditional statement:

```kex
main do
  let n = -2
  
  let r = n >= 0 then "positive" else "negative"
  IO.printLine(r) # "negative"
end
```

| Output |
| --- |
| > negative |

> [!NOTE]
> In other languages this is done by the [ternary conditional operator](https://en.wikipedia.org/wiki/Ternary_conditional_operator) `?:`, which is absent in `Kex`. `then`/`else` seemed much more readable, especially when using predicate function, since those end with `?`:
>
> ```kex
> let remainingQuotaFor(file: WebUpload, user: User) do
>   user.canUpload? then user.fileQuota - file.size else user.fileQuota
> end
> ```

### Trailing if

If can be placed after the condition: 

```kex
let canUpload?(file: WebUpload, user: User) do
  return true if user.canUpload?

  return false
end
```

## Loops

### While

Use collection methods when transforming a collection. For an explicitly stateful algorithm, `while` and `loop` support `break` and `next`:

```kex
main do
  let n = 5

  var i = 1
  var j = 1
  while i <= n do
    j = j * i
    i += 1
  end

  IO.printLine(j)
end
```

| Output |
| --- |
| > 120 |

Keyword `break` can be used to escape from the loop:

```kex
main do
  let n = 100

  var i = 1
  while i <= n do
    break if i.modulo(5( == 0

    i = i + 1
  end

  IO.printLine(i)
end
```

| Output |
| --- |
| > 5 |

`next` skips the rest of the current iteration:

```kex
main do
  var sum = 0
  var k = 0
  while k < 10 do
    k = k + 1
    next if k.modulo(2) == 0
    sum = sum + k
  end

  IO.printLine(sum)
end
```

### Loop without condition

Sometimes, especially when handling events, it makes sense to create loops without conditions. You could either use `while true do ... end` or the much more expressive `loop`, `break` and `next` works exactly the same:

```kex filename="loop_fact.kex"
main do
  let n = 5

  var i = 1
  var j = 1
  loop do
    j = j * i
    i += 1

    break if i == n
  end

  IO.printLine(j)
end
```

Continue with [Values and collections](../values/).
