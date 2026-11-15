---
id: "50ab8bb24650cc588a168caf3b79ce602e18baa6d79476030b8c5a82a230c238"
title: "Optional"
path: "/guide/0.4.0/types/optional/"
draft: false
template: "page"
---
Some computations might not be able to return with any valid value. Therefore most language has created a notion of a `NULL`, `nil`, `null` or even `nullptr` value. This is then could be used as a stand-in for missing values. [This is now considered harmful and should be avoided.](https://en.wikipedia.org/wiki/Null_pointer#History)

## Optional values

Thus, Kex has no such value. Unfortunately, showing that a value is missing is still needed in a lot of places, for this reason Kex uses the `Optional<T>` generic type or `T?` for short.

It is defined by the standard library in this way:

```kex
type Optional<T> = Just(T) | None
```

For example a list might not have a first elment, therefore we have to show that:

```kex
# In List:

first : [X] -> X?
first([])       = None
first([x | xs]) = Just(x)
```

So, our program won't crash when we try to get the first element of an empty list:

```kex
main do
  let nums = [1, 2, 3, 4, 5]
  let empty = []

  IO.printLine(nums.first)
  IO.printLine(empty.first)
end
```

```output filename="OUTPUT"
1

```

`printLine` won't show `None` values, but `inspect` will. This is because, we usually don't want to show values which doesn't exist. However, `inspect` will help us by printing the exact internal shape, including its type and that the value is wrapped:

```kex
main do
  let nums = [1, 2, 3, 4, 5]
  let empty = []

  IO.inspect(nums.first)
  IO.inspect(empty.first)
end
```

```output filename="OUTPUT"
Just(1) : Optional<Integer>
None : Optional
```

Unfortunately, this also means that the compiler will not allow the same oprations on an `Integer?` as an `Integer`, since it won't be able to tell if it will have a valid value at runtime. But, this feature makes them safe to use in our programs.

```kex
main do
  let nums = [1, 2, 3, 4, 5]
  let ns = [10, 9, 3]

  IO.printLine(nums.first + ns.first) # Error: `+` is not defined
                                      # for Integer? and Integer?
end
```

### Unwrapping via pattern matching

To read back the value of an optional we have quite a few solutions. The first is to pattern match on the `Optional` constructors:

```kex
addFirsts : Integer? -> Integer? -> Integer
let addFirsts(Just(a), Just(b)) = a + b
let addFirsts(_, _)             = 0

main do
  let nums = [1, 2, 3, 4, 5]
  let ns = [10, 9, 3]

  IO.printLine(addFirsts(nums.first, ns.first))
end
```

```output filename="OUTPUT"
11
```

### Unwrapping via `if let`

`if let` is a special case of `if`. It assigns a binding if the pattern is matching:

```kex
let firstOf(list: [Integer]) -> Integer do
  if let Just(f) = list.first
    return f
  end
  return 0
end

main do
  let nums = [1, 2, 3, 4, 5]
  let ns = [10, 9, 3]

  IO.printLine(firstOf(nums) + firstOf(ns))
end
```

```output filename="OUTPUT"
11
```

`else` works the same was as you would expect, but it doesn't make this example simpler, we are already early-returning:

```kex
let firstOf(list: [Integer]) -> Integer do
  if let Just(f) = list.first
    return f
  else
    return 0
  end
end
```

### Unwrapping via `try`

The last way to unwrap an `Optional` is to use `try`. This is not a function, even though it looks like it. It is a language construct:

```kex
main do
  let nums = [1, 2, 3, 4, 5]
  let ns = [10, 9, 3]

  IO.printLine(nums.first.try + ns.first.try)
end
```

```output filename="OUTPUT"
11
```

As you can see this is the easiest so far. And this is kinda the most dangerous af the three. With the list being defined it won't cause any problems. Although, this will:

```kex
main do
  let nums = [1, 2, 3, 4, 5]
  let ns = []

  IO.printLine(nums.first.try + ns.first.try)
end
```

```output filename="OUTPUT"
<Runtime error>
```

But, this is only true for `main`, putting it into a function looks like this:

```kex
let addFirstOf(f: [Integer], s: [Integer]) do
  return f.first.try + s.first.try  # Error: `.try` can fail, and `addFirstOf` declares             no result and `return`s: declare it, as `Integer?` or `Integer or! E`, or handle the failure with `trying` or a `rescue`
end

main do
  let nums = [1, 2, 3, 4, 5]
  let ns = []

  IO.printLine(addFirstOf(nums, ns))
end
```

This compiler error tells us a lot of things. Of course the most important one is that this operation can fail and we defined no protection against it.

## Protecting against failures

The easiest protection would be adding  a `rescue`:

```kex
let addFirstOf(f: [Integer], s: [Integer]) do
  return f.first.try + s.first.try

rescue |e|
  return 0
end

main do
  let nums = [1, 2, 3, 4, 5]
  let ns = []

  IO.printLine(addFirstOf(nums, ns))
end
```

The `rescue` caught the issue at runtime and returned from the function with a `0` instead.

For this example this could be further simplified to as we don't really care about the exact issue:

```kex
let addFirstOf(f: [Integer], s: [Integer]) do
  return f.first.try + s.first.try

  rescue return 0
end

main do
  let nums = [1, 2, 3, 4, 5]
  let ns = []

  IO.printLine(addFirstOf(nums, ns))
end
```
