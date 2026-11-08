---
id: "guide-0-4-0-beta-4-values"
title: "Values and primitive types"
description: "Numbers, lists, tuples, maps, and collection transformations."
path: "/guide/0.4.0/values/"
draft: false
template: "page"
---
The point of the biding introduces before was to work with values. Kex uses static-typing, but for most literals it can infer the types from the literal values. For example the number `4` will be automatically types as `Integer`, however `4.1` will be `Float`, while a text value like `"four"`  receive the type of `String`. The next chapter will go into more details about types.

## Numbers

Plain integer literals use arbitrary-precision `Integer`. This means an `Integer` number could be as long as the memory allows, so users won't have to worry about [over or underfllows](https://en.wikipedia.org/wiki/Integer_overflow).

`Int` is a fixed-width 64 bit-long alias for `Int64`, so use it when you specifically want that representation. 

| Name (`T`) | Bit Size | Signedness | Minimum value (`T.MIN`) | Maximum value (`T.MAX`) |
| --- | --- | --- | --- | --- |
| `Int8` | 8 | Signed | -128 | 127 |
| `Int16` | 16 | Signed | -32 768 | 32 767 |
| `Int32` | 32 | Signed | -2 147 483 648 | 2 147 483 647 |
| `Int64` | 64 | Signed | -9 223 372 036 854 775 808 | 9 223 372 036 854 775 807 |
| `Int` | 64 | Signed | -9 223 372 036 854 775 808 | 9 223 372 036 854 775 807 |
| `Integer` | arbitrary | Signed | Arbitrary (depends on available memory) | Arbitrary (depends on available memory) |
| `Byte` | 8 | Unsigned | 0 | 255 |
| `UInt8` | 8 | Unsigned | 0 | 255 |
| `UInt16` | 16 | Unsigned | 0 | 65 535 |
| `UInt32` | 32 | Unsigned | 0 | 4 294 967 295 |
| `UInt64` | 64 | Unsigned | 0 | 18 446 744 073 709 551 615 |

Sized integer types include  , `Int16`,`Int32` and `Int64`. These are always signed, while `Uint8`,`UInt16`,`UInt32` and `UInt64` are unsigned (these cannot represent negative values. Integers can contain `_` as a number seprator at any point other then as the first character.

`Byte` represents an unsigned byte, with the exact same properties as `UInt8`. Plain floating literals use `Float`.

```kex
let population = 8_000_000_000  # Typed as Integer by default
let num = 42                    # Also an Integer
let neg = -34                   # Negative Integer
let ratio = 0.25                # Float
```

Integers also support different number systems:

```kex
let dec   = 42   # Integer in decimal
let hex   = 0x2A # 42, but in hexadecimal
let high8 = 0xFF # 255 (largets 8bit integer in hex)

let perm = 0o7   # Octal (base 8), 7 in decimal and hexadecimal, too
let oct  = 0o777 # 511 in decimal

let bits = 0b111  # 7 in decimal
let ten  = 0b1010 # 10
let all  = 0b1111_1111 # 255 in decimal (all bits in the byte is 1)
```

Hexadecimal numbers are prefixed via `0x`, while octal values are prefixed with `0o`, bits use `0b`. 

> [!NOTE]
> The octal prefix is differs from other C-style prefixes, because it might confuse some people. [JavaScript for example has deprecated ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Deprecated_octal_literal)0-prefixed octal numbers and also use the `0o` style.

By default all numbers are printed out in their decimal form, no matter how they were defined:

```kex
main do
  IO.printLine(10)
  IO.printLine(0b1010)
  IO.printLine(0o12)
  IO.printLine(0bA)
end
```

```output filename="OUTPUT"
10
10
10
10
```

The function `to` can first convert the number to the required format as a `String` :

```kex
main do
  IO.printLine(10)
  IO.printLine(0b1010.to(String)) # decimal by default
  IO.printLine(192.to(String, radix: 2)) # 2-base system (binary)
  IO.printLine(555.to(String, radix: 8)) # Octal
end
```

```output filename="OUTPUT"
10
10
11000000
1053
```

### Floating-point numbers

| Name (`T`) | Bit Size | Signedness | Minimum value (`T.MIN`) | Maximum value (`T.MAX`) |
| --- | --- | --- | --- | --- |
| `Float32` | 32 | Signed | -3.4028234663852886e38 | 3.4028234663852886e38 |
| `Float64` | 64 | Signed | -1.7976931348623157e308 | 1.7976931348623157e308 |

Floating-point values are used to represent a subset of real numbers:

```kex
let prec  = 0.45       # Typed as Float by default
let num   = 42.454846  
let large = 4.23e10    # 42300000000.0 in scientific format
let small = 1.1E-7     # 110 billionths also in scientific format
```

The last two examples are formatted  in the [scientific notation or E notation](https://en.wikipedia.org/wiki/Scientific_notation). For instance `4.23e10`  is  4.23 × 10¹⁰ or just `42 300 000 000`.

Doing mixed mathematical operations on both integers and floating point values result in the whole expression being converted into a floating-point value:

```kex
main do
  let n = 15 * 4.232 - 8  # Float
  IO.printLine(n)
end
```

```output filename="OUTPUT"
55.480000000000004
```

Converting a floating-point value to integer is possible, however it will drop everything after the `.`.

```kex
main do
  let x = 4.232.to(Integer).try  # Integer
  let n = 15 * x - 8             # Also Integer
  IO.printLine(n)
end
```

`to` is a runtime conversion function and might fail, so after it ran we also have to unwrap its value via `try`. Next chapters will talk more about `Optional` and `Result` types.

> [!CAUTION]
> Due to [representational](https://en.wikipedia.org/wiki/IEEE_754) limitations, avoid comparing floating-point numbers via `==`. For example:
>
> ```kex
> main do
>   let x = 1.0 / 49            # 0.02040816326530612
>   IO.printLine(x * 49 == 1.0) # false (0.9999999999999999 == 1.0)
> end
> ```
>
> However, by mere coincidence (internal rounding) this works:
>
> ```kex
> main do
>   let x = 10.0 / 3            # 3.3333333333333335
>   IO.printLine(3 * x == 10.0) # true (10.0 == 10.0)
> end
> ```

### Number type

Most algorithms doesn't care if the underlying type is an `Integer` or `Float`. They just work on "numbers". So, Kex ships with a type hierarchy where both `Integer` and `Float` descends from the type `Number`:

```kex
# Quadratic equation solver
let solveQuadratic(a: Number, b: Number, c: Number) -> (Number, Number) do
  let root = Math.sqrt(b^2 - 4*a*c)
  let pos = (-b + root) / 2 * a
  let neg = (-b - root) / 2 * a
  return (neg, pos)
end

main do
  # Integers as inputs
  let ai = 2
  let bi = -5
  let ci = 3
  # 2x^2 - 5x + 3 = 0:
  let qi = solveQuadratic(ai, bi, ci)
  IO.printLine(qi)  

  # Floating-point numbers as inputs
  let af = 1.22
  let bf = 3.34
  let cf = 2.28
  let qf = solveQuadratic(af, bf, cf)
  IO.printLine(qf)
end
```

```output filename="OUTPUT"
(4.0, 6.0)
(-2.141636845692876, -1.9331631543071237)
```

In the example above `solveQuadratic`  is a function with number parameters `a`, `b` and `c`, while returning the resulting `Number` tuple.

The beauty of the above solution that the function doesn't have to know about its inputs types, other than that they are numbers. Therefore number operations would work on them. Documenation later will explain functions and tuples in more detail.

## Booleans

Boolean values can only represent either `true` or `false`. This is what relational operators return as their values.

```kex
let yes = true
let no = false

let smaller = 2 < 3   # true
let larger  = 2 > 3   # false
let equal   = 2 == 2  # true

let and = yes && smaller         # true
let or  = no || larger || equal  # true
let not = !no                    # true
```

The previous page contained a list of relation and logical operators.

## Characters and strings

Most programs don't just operate over numbers and logic. For handling text Kex provides the types `Char` and `String`

### Strings

Strings is basically a representation of text:

```kex
main do
  let hello = "Hello, world"  # String
  IO.printLine(hello)
end
```

```output filename="OUTPUT"
Hello world
```

One of the most useful `String` feature is [interpolation](https://en.wikipedia.org/wiki/String_interpolation), which is the substitution of other values into a string:

```kex
main do
  let name  = "Adam"             # String
  let hello = "Hello, ${name}!"  # Also String
  IO.printLine(hello)

  let age = 23
  IO.printLine("You are ${age} years old.")
end
```

```output filename="OUTPUT"
Hello Adam!
You are 23 years old.
```

Strings can have an arbitrary length, only constrained by the available memory. In literals, strings are defined between either `""` or \`\` for multiline strings:

```kex
main do
  let comment  = "// Hello world program in C:"
  let cprogram = `
    #include <stdio.h>
    
    int main(int argc, char *argv[]) {
      printf("Hello, world!")
    }
  `

  IO.printLine(comment)
  IO.printLine(cprogram)
end
```

```output filename="OUTPUT"
// Hello world program in C:
#include <stdio.h>

int main(int argc, char *argv[]) {
  printf("Hello, world!")
}
```

There are multiple differences between `""` and multiline strings. The first, is that as their name suggests, multiline strings can spread accross multiple lines in the source prgoram, without termination or escaping.

The other big difference, is by-default multiline strings doesn't support interpolation. The `$` prefix has to be used for interpolation:

```kex
main do
  let comment  = "// Hello world program in C:"
  let name     = "Adam"
  # See that the $`` form is used here:
  let cprogram = $`
    #include <stdio.h>
    
    int main(int argc, char *argv[]) {
      printf("Hello, ${name}!")
    }
  `

  IO.printLine(comment)
  IO.printLine(cprogram)
end
```

```output filename="OUTPUT"
// Hello world program in C:
#include <stdio.h>

int main(int argc, char *argv[]) {
  printf("Hello, Adam!")
}
```

The last big difference is that you can use `""` and `''` without escaping in multiline strings, this makes them very useful for single line strings as well:

```kex
main do
  IO.printLine("This is a problem: \"Must be escaped\"")
  IO.printLine(`While here: "No escape is needed" or '\'`)
end
```

```output filename="OUTPUT"
This is a problem: "Must be escaped"
While here: "No escape is needed" or '\'
```

This is can be very useful when generating other programs as shown above.

Several functions and even operators are available for handling texts:

```kex
main do
  # Concatenation via '+'
  let hello = "Hello"
  let mid   = ", "
  let world = "world!"
  IO.printLine(hello + mid + world)

  # Interpolation ${}
  let msgs = 2
  IO.printLine("You have ${msgs} messages.")

  # Reversion
  IO.printLine("hello".reverse)

  let ch = "hello"[1]  # Just('e') : Char?
  let olla = "ollá"    # String
  let ah = olla.get(3) # Just('á') : Char?
  IO.printLine(ah)
end
```

```output filename="OUTPUT"
Hello, world!
You have 2 messages.
olleh
á
```

The standard library contains many string manipulation functions, some of them will be demonstrated in detail later. 

`+` allows [concatenation](https://en.wikipedia.org/wiki/Concatenation) (adding strings together), while `${}` allows [string interpolation](https://en.wikipedia.org/wiki/String_interpolation) (substituting values into text).

In the above example `ch` and `ah` are characters, `ch` is the 2nd (indexing starts from 0, instead of 1), while `ah` is the 3rd. Both are wrapped in the constructor `Just`, which will be explained later.

> [!NOTE]
> Internally comparisions between integers are done by comparing each of their characters to each other one by one. This means that comparing shorter strings will be faster then longer ones.
>
> This means that for internal, technical text it is much better to use atoms, which are described at the end of this page.

### Chars

Every string is made up of individual characters.  As the example showed, indexing via `[]` or the `get` function can be used to access these elements. Everything in **Kex**, including these starts counting from 0.

For literals `''` are used for defining a character:

```kex
let ch = 'h'     # Char
```

The function `chars` can be used over the strings to get back its characters:

```kex
main do
  let hello = "hello"     # String
  let chrs  = hello.chars # ['h', 'e', 'l', 'l', 'o'] : [Char]
  IO.printLine(chrs)
end
```

```output filename="OUTPUT"
[h, e, l, l, o]
```

The opposite angle also works. Strings could be created from characters:

```kex
main do
  let hello = ['h', 'e', 'l', 'l', 'o']  # [Char]
  let s = hello.join                     # "hello" : String
  IO.printLine(s)
end
```

```output filename="OUTPUT"
hello
```

As shown above characters contain Unicode chacters, instead of individual bytes. This makes them suitable to work with languages requiring more letters then [ASCII](https://en.wikipedia.org/wiki/Ascii) could provide.

```kex
main do
  let hello = "здравствуйте"
  IO.printLine(hello.count)
  IO.printLine(hello.chars)
  IO.printLine(hello[9])
end
```

```output filename="OUTPUT"
12
[з, д, р, а, в, с, т, в, у, й, т, е]
й
```

## Atoms

Atoms are similar to strings, they are more useful as internal technical identifiers. Kex inherited them from Erlang, where they were used for all kinds of things.

To define one, use the prefix `:`:

```kex
let short = :hello             # Atom
let long  = :this_is_an_atom   # Atom
let any   = :"this has spaces" # Atom
```

What makes atoms great is that comparision between them is very quick. Internally they are represented via numbers, so the virtual machine doesn't have to compare them character by character.
