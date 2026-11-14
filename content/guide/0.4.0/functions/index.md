---
id: "guide-0-4-0-beta-4-functions"
title: "Functions and blocks"
description: "Declarations, UFCS, higher-order functions, and closures."
path: "/guide/0.4.0/functions/"
draft: false
template: "page"
---
Functions are one of the most important building block of the language. It allows computations to be  organized into reusable values. Functions can also receive parameters, which can change the computation.

## Syntax

```kex
let double(x: Integer) = x * 2

main do
  IO.printLine(double(2))  # x is substituted to 2 => 2 * 2 => 4
  IO.printLine(double(3))  # x is substituted to 3 => 3 * 2 => 6
end
```

```output filename="OUTPUT"
4
6
```

Short pure functions are defined very similarly to normal bindings via `let`. The same rules apply for the name as for other value bindings, other than that **uppercase names are invalid.**

Here the return type was not declared, but since the compiler knew both `x`'s and `2`'s type (both being `Integer`), it was able to infer that  a multiplication between them would also yield an `Integer`.

Most functions include multiple computations and might not fit into a single line. In those cases `do ... end` can be used, see the previous `solveQuadratic` example:

```kex
let solveQuadratic(a: Number, b: Number, c: Number) -> (Number, Number) do
  let root = Math.sqrt(b^2 - 4*a*c)
  let pos = (-b + root) / 2*a
  let neg = (-b - root) / 2*a
  return (neg, pos)
end

main do
  # 2x^2 - 5x + 3 = 0:
  let (n, p) = solveQuadratic(2, -5, 3)
  IO.printLine(n)
  IO.printLine(p)
end
```

```output filename="OUTPUT"
4.0
6.0
```

The return type comes after the arrow `->` , `(Number, Number)` tuple. The `return` keyword stops the evaulation of the function and immidiately returns with `(neg, pos)`.

If `return` is omitted, the function will return with its last evaluated value, so this definition is the same as above:

```kex
let solveQuadratic(a: Number, b: Number, c: Number) -> (Number, Number) do
  let root = Math.sqrt(b^2 - 4*a*c)
  let pos = (-b + root) / 2*a
  let neg = (-b - root) / 2*a
  (neg, pos)
end
```

### Separate declarations

Typing declarations could be moved outside of the function's definition:

```kex
beerBottles : Integer -> String
let beerBottles(nr) = "${nr} bottles of beer on the wall"

main do
  IO.printLine(beerBottles(99))
end
```

```output filename="OUTPUT"
99 bottles of beer on the wall
```

This is equivalent to the previous cases:

```kex
let beerBottles(nr: Integer) -> String = "${nr} bottles of beer on the wall"

main do
  IO.printLine(beerBottles(99))
end
```

```output filename="OUTPUT"
99 bottles of beer on the wall
```

The `Integer -> String` type declaration is read as "the function takes an `Integer` and makes it into a `String`".

```kex
bottlesOf : Integer -> String -> String
let bottlesOf(nr, something) = "${nr} bottles of ${something} on the wall"

main do
  IO.printLine(bottlesOf(99, "plinka"))
end
```

```output filename="OUTPUT"
99 bottles of plinka on the wall
```

The function's last parameters can define default arguments:

```kex
bottlesOf : Integer -> String -> String
let bottlesOf(nr, something = "beer") = "${nr} bottles of ${something} on the wall"

main do
  IO.printLine(bottlesOf(99, "plinka"))
  IO.printLine(bottlesOf(99))
end
```

```output filename="OUTPUT"
99 bottles of plinka on the wall
99 bottles of beer on the wall
```

## Multiple function bodies

The separate type declaration comes very useful when we specialize functions:

```kex
beerBottles : Integer -> String
let beerBottles(0)  = "nothing left on the wall"
let beerBottles(nr) = "${nr} bottles of beer on the wall"

main do
  IO.printLine(beerBottles(99))
  IO.printLine(beerBottles(0))
end
```

```output filename="OUTPUT"
99 bottles of beer on the wall
nothing left on the wall
```

This mechanism works similarly to the previously introduced `match` keyword, and in most cases can completely replace it.

In this example `commandNoMatch`  and `commandWithMatch` do exactly the same things:

```kex
commandNoMatch : String -> Integer -> Integer
let commandNoMatch("double", n) = n * 2
let commandNoMatch("pow", n)    = n * n
let commandNoMatch("div", n)    = n / 2
let commandNoMatch(_, _)        = -1

let commandWithMatch(cmd: String, n: Integer) -> Integer do
  return match cmd do     # return is still optional here (last value)
    "double" => n * 2
    "pow"    => n * n
    "div"    => n / 2
    _        => -1
  end
end

let check(cmd: String, n: Integer) do
  let cnm = commandNoMatch(cmd, n)
  let cwm = commandWithMatch(cmd, n)
  cnm == cwm               # no return keyword, last value, still works
end

main do
  # Since `==` returns with Bool, the compiler can is infer that Bool will
  # be the return value of `check`
  IO.printLine(check("double", 10))
  IO.printLine(check("pow", 2))
  IO.printLine(check("div", 18))
  IO.printLine(check("wrong", 0))
end
```

```output filename="OUTPUT"
true
true
true
true
```

Choosing between them is a matter of style. For short functions the `match`-less solution is usually simpler and easier to read. Both examples use `_` when we don't care about the values. 

### Recursive calls

The previous example showed that functions can call other functions, which is extremely powerfull. Moreover, a function can call itself, which we call [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)):

```kex filename="fact.kex"
factorial : Integer -> Integer
let factorial(1) = 1
let factorial(n) = n * factorial(n - 1)

main do
  IO.printLine(factorial(4))    # => 24  = 4 * 3 * 2 * 1
  IO.printLine(factorial(5))    # => 120 = 5 * 4 * 3 * 2 * 1
end
```

```output filename="OUTPUT"
24
120
```

Even multiple times:

```kex filename="fib.kex"
# Fibonacci sequence:
fib : Integer -> Integer
let fib(0) = 0
let fib(1) = 1
let fib(n) = fib(n - 1) + fib(n - 2)

main do
  IO.printLine(fib(4))
  IO.printLine(fib(5))
end
```

```output filename="OUTPUT"
3
5
```

> [!CAUTION]
> Recursions are really powerful, but great care should be taken when you use it. If stop conditions are not properly defined the function might never return and could cause a hang or crash. Also negative cases are not properly handled by the cases above.
>
> Sometimes there are even simpler solutions, which might be even faster or shorter:
>
> ```kex filename="simplefact.kex"
> fact : Integer -> Integer
> let fact(n) = (2..n).product  # product over range (2..n)
>
> main do
>   IO.printLine(fib(4))
>   IO.printLine(fib(5))
> end
> ```

## Side-effects

The examples so far had no side-effects. In this context we call any observable effect a side-effects, which is other then the primary effect of returning a value. All the above examples showed pure functions, which just transforms one value into an other.

**Kex will refuse the usage of effectful functions in pure ones.** This example won't compile:

```kex
let fact(n: Integer) -> Integer do
  let f = (2..n).product
  IO.printLine("${n}! = ${f}")  # ERROR: Cannot call foul function 'IO.printLine'
                                # from pure context
  return f
end
```

`IO.printLine` looks harmless (and it kinda is), but it technically it causes the side-effect of printing to the screen, which is very different from taking a number and returning a number (which it also does).

Kex wants to clearly separate pure functions from impure ones, so when users see pure functions they can be sure that the functions they are working with does no "spooky action at a distance". Examples of impure side-effects include:

- Writing to the screen
- Accessing the keyboard in any way
- Network calls
- File operations
- Modifying someone else's memory (including any global state)

### Effect boundary

The entry point `main` is the usual effect boundary for small programs. This means that `main` can do any side-effect pure functions can't. So, the fixed example, might look familiar:

```kex
let fact(n: Integer) -> Integer do
  return (2..n).product
end

main do
  let n = 4
  IO.printLine("${n}! = {fact(n)}")  # can call both pure and impure functions
end
```

## Functions with side-effects

The impure `main` is very useful, however not being able to put code doing side-effects outside of `main` would be very hard.

Most useful programs do print to the console, work over the network, do file management. There are some programming languages which managed to build complex solutions to manage this from pure contexts (like [Haskell](https://en.wikipedia.org/wiki/Haskell)), but Kex chose another route.

Impure function, which are allowed to do operations yielding side-effect are defined via the `foul` keyword. It shows to the user that this function might not just transform values or calculate computations:

```kex
foul fact(n: Integer) -> Integer do
  let f = (2..n).product
  IO.printLine("${n}! = ${f}")      # correct, no error
  return f
end

main do
  (1..10).each do |n|
    fact(n)
  end
end
```

```output filename="OUTPUT"
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120
6! = 720
7! = 5040
8! = 40320
9! = 362880
10! = 3628800
```

`foul` functions can call both pure and impure functions, so the above could be separated into pure and impure parts:

```kex
# `fact` is now pure again
let fact(n: Integer) = (2..n).product

foul showFact(n: Integer) do
  let f = fact(n)    # calling a pure function without any issue
  IO.printLine("${n}! = ${f}")
end

main do
  # Same output as the original
  (1..10).each do |n|
    showFact(n)
  end
end
```

> [!TIP]
> Always prefer pure functions if possible. Pure functions always produce the same result, it is guaranteed that no spooky action would be done by it. It is easier to test, reuse and run concurrently.

## Blocks and lambdas

Just like functions, blocks are defined between either `do` ... `end`, or `{` `}` (for one liners). And just like function these can also receive parameters.

```kex
main do
  let oneliner = (1..100).filter { |x| x.dividesBy?(2) }
  oneliner.each do |y|
    IO.printLine(y) if y < 10
  end
end
```

```output filename="OUTPUT"
2
4
6
8
```

Both `x` and `y` are parameters of the block. `filter` goes through the range one element at a time and calls the block with the current element. The element is passed as `x` and if it divides by 2 without any remainder, it will be returned in a new list of `filter`. `each` does something similar, but it has no return value, it just allows the block it calls to do something with the passed value as `y`.

### Blocks as lambdas

Blocks also allow the creation of lambda functions. These are functions which has no name, which is very useful, since these can be easily passed to other functions (like `map` here):

```kex
main do
  let double = { |x| x * 2 }
  IO.printLine((1..10).map(double))
end
```

```output filename="OUTPUT"
[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
```

### Higher-order functions

Functions like `map`, `filter`, `reject` and `each` are usually called as [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function), since these operate over other functions. This instance shows a functions which calls any function it got passed twice:

```kex
let runTwiceFor(n: Number, fn: (Number -> Number)) do
  fn(fn(n))
end

main do
  let double = { |x| x * 2 }
  IO.printLine(runTwiceFor(3, double))
  IO.printLine(runTwiceFor(3, { |x| x + 1 }))
end
```

```output filename="OUTPUT"
12
5
```

When passing a block parantheses are optional and the usual syntax can be applied:

```kex
let runTwiceFor(n: Number, fn: (Number -> Number)) do
  fn(fn(n))
end

main do
  let t = runTwiceFor 5 do |x|
    x * 2
  end
  IO.printLine(t)
end
```

```output filename="OUTPUT"
20
```

Of course you can pass named functions just as easily:

```kex
let runTwiceFor(n: Number, fn: (Number -> Number)) do
  fn(fn(n))
end

let double(n) = n * 2

main do
  IO.printLine(runTwiceFor(3, double))
end
```

```output filename="OUTPUT"
12
```

## Uniform Function Call Syntax and chaining

One of the most useful features of functions in Kex that the first parameter could be moved out from the parameter list when calling. This is usually referred to as [UFCS (Uniform Function Call Syntax)](https://en.wikipedia.org/wiki/Uniform_function_call_syntax):

```kex
let fact(n: Integer) = (2..n).product

main do
  let factorials = (1..10).map { |n| n.fact }  # same as fact(n)
  IO.printLine(factorials)
end
```

```output filename="OUTPUT"
[1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800]
```

Some of the code in `main` looks the same as it would look in [Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)), although semantically it is completely different. Neither the range `(1..10)`  or `n` are objects and neither `map` or `fact` is a method defined for them. All of them work because of UFCS.

This allows natural function chaining without classes or objects, shown before:

```kex
main do
  let odds = (1..10).map { |n| n * n }.filter { |n| n.odd? }
  IO.printLine(odds)
end
```

```output filename="OUTPUT"
[1, 9, 25, 49, 81]
```

### Block shorthand syntax

When a block just calls another function via UFCS in a block, it's call can be greatly simplified via:

```kex
main do
  let odds = (1..10).map { |n| n * n }.filter(&.odd?) # same as the above
  IO.printLine(odds)
end
```

The `&` will work as the parameter substitute.

## Currying and partial application

As it was shown above the `Integer -> Integer` syntax means that we have a function which will transform its `Integer` input into an `Integer` output:

```kex
double : Integer -> Integer
let double(x) = x * 2
```

It could be an interesting question why we get an `Integer -> Integer -> Integer` type declaration, when we add another parameter to the function:

```kex
addAndDouble : Integer -> Integer -> Integer
let addAndDouble(a, x) = x * 2 + a

main do
  IO.printLine(addAndDouble(1, 3))
end
```

```output filename="OUTPUT"
7
```

This is declaration tells us that we could create an `Integer -> Integer` function from an `Integer -> Integer -> Integer` function if we fix its first parameter:

```kex
addAndDouble : Integer -> Integer -> Integer
let addAndDouble(a, x) = x * 2 + a

main do
  IO.printLine(addAndDouble(1, 3))
  let double = ~addAndDouble(0)
  IO.printLine(double(2))  # works the same way as our previous `double`
end
```

```output filename="OUTPUT"
7
6
```

We got back our original `double` function and it will be typed as `Integer -> Integer`.

This is called partial application or currying and is done by the `~` unary operator. As described above it allows as to create function from functions, just by fixing one or none of their argument:

```kex
add : Integer -> Integer -> Integer
let add(a, b) = a + b

let plusOne = ~add(1)
let plusTen = ~add(10)

main do
  let oneMore = (1..5).map(plusOne)
  let tenMore = (1..5).map(plusTen)

  IO.printLine(oneMore)
  IO.printLine(tenMore)
end
```

```output filename="OUTPUT"
[2, 3, 4, 5, 6]
[11, 12, 13, 14, 15]
```

Even operators are allowed to be partially applied:

```kex
main do
  let doubles = (1..5).map(~(*)(2))
end
```

```output filename="OUTPUT"
[2, 4, 6, 8, 10]
```

`~(*)(2)` is the same as our `double` function a few examples back.

`~` even allows us to pass binary operators, passed as a function:

```kex
main do
  let sumOf10 = (1..10).reduce(0, ~(+))
  IO.printLine(sumOf10)
end
```

```output filename="OUTPUT"
55
```

Captured arguments fill parameters from left to right. `_` can be used to leave a particular position open:

```kex
main do
  let minus5 = (1..10).map(~(-)(_, 5))
  IO.printLine(minus5)
end
```

```output filename="OUTPUT"
[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
```
