---
id: "guide-0-4-0-beta-4-types"
title: "Types"
description: "Inference, annotations, generics, aliases, and nominal distinctions."
path: "/guide/0.4.0/types/"
draft: false
template: "page"
---
Kex is a statically typed language. This means that before running a program its typing is checked and if it is wrong, building or interpreting the code itself will be refused. The good news is, that it can infer many types from the values you write, so you do not have to annotate every binding.

Annotation is still highly advised, especially for functions and constructs which is exposed publicly. We call these the contract of a program or library. The [Values chapter](../values/) already introduced the primitive types; here you will combine and create types.

## Typing syntax summary

You have already seen names such as `Integer` and `String`. Square brackets, parentheses, and arrows describe how those types are modified:

| Type | Meaning |  |  |
| --- | --- | --- | --- |
| `String`, `Integer`, `Char`, etc | The type itself holding one ordinary value |  |  |
| `[String]` | List of strings |  |  |
| `(String, Integer)` | Two-element tuple, holding a `String` and an `Integer` |  |  |
| `String?` | Either holding a `String` or not, [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) for `Optional<String>` |  |  |
| `Integer or String` | Result of a computation, either an `Integer` or a `String` . [Syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) of `Either<Integer, String>` |  |  |
| `Integer or! String` | Result of a computation, either an `Integer` when successful or string error holding the error. [Syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) of `Result<Integer, String>` |  |  |
| `Integer -> String` | Function which transforms an `Integer` to a `String` |  |  |
| \`MarkedAt(Integer) \\ | Unmarked \\ | Unknown\` | A choise between `MarkedAt(Integer)` or `Unmarked` or `Unknown` |
| `Process<Message>` | Process handle accepting `Message` values |  |  |

This chapter will show you how each of these work and how you can even build your own ones.

## Creating types

`Kex` makes it possible to create new types or alias a type with a new name. Both use the `type` keyword:

```kex filename="myint.kex"
type MyInt = Integer

let guaranteedRandom -> MyInt do
  return 4   # selected via standard dice roll, just a normal `Integer`
end

main do
  IO.printLine(guaranteedRandom)  # => 4
end
```

In `myint.kex` the type `MyInt` could be used anywhere where `Integer` could be used. This is more useful where we want to show that a function's contract don't intend to work with every possible value just a subset of values, without raising type checking errors.

The type `FilePath` is a good example for this, it is basically just a `String`:

```kex filename="stdlib"
# Under the FS module in the standard library:

type FilePath = String
```

Then every function where a file's path is required uses this type to show that it won't work with arbitrary text:

```kex filename="stdlib"
# Under FS.File modules:
# Rename a file
rename : FilePath -> FilePath -> Result<Void, FileError>
```

Anyone reading this type declaration would notice, that `FilePath` is probably a bit more special than a simple string, so care must be taken how it is used:

```kex
# Runtime error, no such file "just some stuff here":
FS.File.rename("just some stuff here", "") 

# Correct if we have draft.txt:
FS.File.rename("draft.txt", "final.txt")

# Correct if we have src/hello.kex:
FS.File.rename("src/hello.kex", "src/hey.kex")
```

As you can see we did nothing special on the calling side, we are still passing "normal" strings. The compiler would have no way to check if these files exist in any way before actually running the program, so aliasing is more of a decorative helper than an enforcable rule.

Declarations help to sell the intent, while still getting the benefits or normal strings:

```kex filename="works_but_discouraged.kex"
main do
  let path : FilePath = "src/"  # optional declaration
  FS.File.rename(path + "hello.kex", path + "hey.kex") # discouraged, but works
end
```

The above version works, since `+` works with `String` so we don't have to reimplement it for `FilePath`. Although, something  there exists to handle operating system-level differences (`/` vs `\` mostly):

```kex filename="works_but_discouraged.kex"
main do
  let sourcePath = "src"
  let helloPath = FS.Path.join(sourcePath, "hello.kex") # "src/hello.kex" on Unix-like
  let heyPath = FS.Path.join(sourcePath, "hello.kex")   # and also returns `FilePath` 
  
  FS.File.rename(helloPath, heyPath)
end
```

## Sum types

Aliasing has a limited use. It still only allows us, to use built-in types with another name. Sometimes we want to describe a choise between values and types with our type. A [sum type](https://en.wikipedia.org/wiki/Sum_type) describes this:

```kex filename="unsure.kex"
type UnsureBool = True | False | Maybe
```

The definition creates the `UnsureBool` type which values can either be `True`, `False` or `Maybe`.

The `True`, `False` and `Maybe` values are often called as constructors as they construct a type when you use them:

```kex filename="unsure.kex"
and : UnsureBool -> UnsureBool -> UnsureBool
let and(a, b) do
    return True if a == True && b == True
    return False if a == False || b == False

    return Maybe
end

main do
    IO.printLine(True.and(True))
    IO.printLine(True.and(False))
    IO.printLine(Maybe.and(False))
    IO.printLine(Maybe.and(True))
end
```

```output filename="OUTPUT"
True
False
False
Maybe
```

As you can see, we kinda reimplemented `Bool` with a twist, the language can naturally use `True` and `False`, like `true` and `false` in `Bool`.

This can be useful, when we want to make a choice typed. One example is the `Weekday` type from prelude:

```kex filename="unsure.kex"
type UnsureBool = True | False | Maybe

let doIHaveToGetUp(day: Weekday) -> UnsureBool do
  return False if day == Monday        # hating on Mondays

  if day == Saturday || day == Sunday  # maybe?
    return Maybe
  end

  return True                          # have to
end

main do
  IO.printLine(Date.today.weekday.doIHaveToGetUp) # depends on when you run it :)
end
```

The above example makes it easier to the reader that they work with abstract values, not simple integers or strings. And the descision and how it's made is simpler to understand. This is why sum types are also categorized under [Abstract Data Types](https://en.wikipedia.org/wiki/Abstract_data_type).

`Date.today` gets the current `Date` while the `weekday` function returns with the day of the week in an easy-to-read sum type:

```kex filename="stdlib"
# Under `Date` in the standard library:
type Weekday = Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday

weekday : Date -> Weekday

# defined as `foul` (reads the calendar)
today : Date
```

Unfortunately, this would be illegal:

```kex filename="invalid_bool.kex"
type Bool = true | false  # Error: Expected type expression (Bool also already exists)
```

Contructors have to start with a capital letter, but you can still think about `true` and `false` as constructors or `Bool`.

You can also create types which only have one constructor:

```kex
type HowMany = | One

let simpleOne() = One
```

This is useful if the definition is not done curently, but we already have to start filling in the types. For the next constructor the `|` gets into place:

```kex
type HowMany = One | Two
```

> [!NOTE]
> The `|` moves to the start of the constructor to help the compiler distinguish it from type aliasing.

Types can be also used via `|`:

```kex
type SystemId = String | Integer

let oldId -> SystemId do
  # stored as a String:
  return "old-${id}"
end

let newId -> SystemId do
  return id # Integer
end
```

## Parametric types

Sum types are great, but their use is still limiting if you can't put other data next to it. Type parameters allow constructors to carry data:

```kex filename="marking.kex"
type Marking = MarkedAt(Integer) | MarkedUntil(Integer) | Unmarked
```

Then we can embed data into their constructors while creating the type. This function creates a `Marking` from an index and a marking character:

```kex filename="marking.kex"
markedAtFor : Integer -> Char -> Marking
let markedAtFor(i, '<') = MarkedAt(i)
let markedAtFor(i, '>') = MarkedUntil(i)
let markedAtFor(_, _)   = Unmarked
```

The constructors then could be used in pattern matching to read back data from them:

```kex filename="marking.kex"
nearestOf : Marking -> Marking -> Marking
let nearestOf(Unmarked, m) = m
let nearestOf(m, Unmarked) = m
let nearestOf(a, b)        = markAt(a) < markAt(b) then a else b

markAt : Marking -> Integer
let markAt(MarkedAt(x))    = x
let markAt(MarkedUntil(x)) = x
let markAt(Unmarked)       = -1
```

This makes the `Marking` agnostic of what it marks. It only symbolizes a start, end or unmarked 

Then we can apply the functions, so at the end we can get the symbolic results:

```kex filename="marking.kex"
let markOf(text: String, ch: Char, from: Integer) -> Marking do
  if let Just(mark) = text.drop(from).indexOf(ch) # this will be explained later
    return markedAtFor(from + mark, ch)
  end

  return Unmarked
end

let markingsOf(text: String, from: Integer) -> [Marking] do
  let ms = markOf(text, '<', from)  # returns with MarkedAt(x)
  let em = markOf(text, '>', from)  # returns with MarkedUntil(x)
  let mark = nearestOf(ms, em)

  return [] if mark == Unmarked
  return [mark] + markingsOf(text, markAt(mark) + 1)
end

main do
  let text = "hello, <we> have a <lot> of marking around <<h>ere>"
  IO.printLine(markingsOf(text, 0))
end
```

```output filename="OUTPUT"
[MarkedAt(7), MarkedUntil(10), MarkedAt(19), MarkedUntil(23), MarkedAt(43), MarkedAt(44), MarkedUntil(46), MarkedUntil(50)]
```

## Generic types

We now know how to parameterize other types. The only problem is that we still have to know the concrete types of the parameters. This is usually a bigger problem than it seems. The `marking.kex` example above was easy, since the indecies would only really make sense as integers.

There are a number of types which work with other types in a way where the parameter's types are irrelevant.

The way to write these is to use Kex's generic type parameters. These are always one capital letter, like `A`,`B` or more usually `T`, `K`, `V`. The parameter is then written between `<` and `>` next to the target type. Then the constructors can receive them:

```kex
type Unsure<T> = True | False | Maybe(T)
```

Compound types like list, is already generic:

```kex filename="stdlib"
# In List:
count : [X] -> Integer
```

So, when lists are being used, its function definitions doesn't have to care about the exact type it stores:

```kex
main do
  let nums = [1, 2, 3, 4, 5]           # [Integer]
  let texts = ["hello", "world", "!"]  # [String]

  # count is generic:
  IO.printLine(nums.count)
  IO.printLine(texts.count)
end
```

```output filename="OUTPUT"
5
3
```

### Specializing types

Even more new types could be created from these generic types, by specializing them:

```kex
type UnsureText = Unsure<String>

let doIHaveToGetUp(day: Weekday) -> UnsureText do
  return False if day == Monday

  if day == Saturday
    return Maybe("But, I would rather sleep")
  end

  if day == Sunday
    return Maybe("But, I have to prepare")
  end

  return True
end

main do
  IO.printLine(Date.today.weekday.doIHaveToGetUp) # depends on when you run it :)
end
```

```output filename="EXAMPLE OUTPUT"
Maybe(But, I have to prepare)
```

Or use it for something else:

```kex
type UnsureInt = Unsure<Integer>

random? : Integer -> UnsureInt
let random?(4) = True  # totally random (via dice roll)
let random?(n) = Maybe(n)
```

End of course the same works for containers:

```kex
type StringList = [String]

let countWords(list: StringList) = list.map(&.count)

main do
  IO.printLine(countWords(["these", "are", "just", "some", "words"]))
end
```

```output filename="OUTPUT"
[5, 3, 4, 4, 5]
```

## Distinct types

We have already seen that types can be aliased to add a second name to them:

```kex filename="stdlib"
# Under the FS module in the standard library:

type FilePath = String
```

The biggest advantage is also the biggest disadvantage of this solution. Namely, that the new type does and works exactly the same as the type it alised:

```kex filename="stdlib"
main do
  let src : FilePath = "src/"
  let fname : FilePath = "\\\yolo"
  IO.printLine(src + fname) # no issue
end
```

The `+` operator will just add them together without validating that these are paths and should have been concatinated as such. For paths the easy-of-use is more important than the typing rigor, especially since that is how it is done in most other languages.

However, this might not be acceptable for other problems. Let's think about this:

```kex
type UserId = String
type AccountId = Integer
type BookingId = Integer
```

And let's say we have defined functions on these:

```kex
foul currentUserId -> UserId do
  # ... gets the current user ...
end

foul currentAccountId -> AccountId do
  # ... gets the current account ...
end

foul closeBookingOf(uid: UserId, bId: BookingId, accountId: AccountId) do
  # ...
end
```

And the function is used as such:

```kex
foul handleBookings do
  bookings.each do |bid|
    closeBookingOf(currentUserId, bid, currentAccountId)
  end
end
```

Let's say someone or something "fixes" the order of the parameters:

```kex
foul closeBookingOf(uid: UserId, accountId: AccountId, bId: BookingId) do
  # ...
end
```

If `handleBookings` not get refactored as well to pass the `bid` and `currentAccountId` the other way around, we will have a silent failure. We are now passing booking identifiers as accounts and vica-versa without any warning.

Kex intends to avoid any silent failures and for this reason introduced distinct types:

```kex
distinct type UserId = String
distinct type AccountId = Integer
distinct type BookingId = Integer
```

Calling with the wrong identifier is now an error:

```kex
# Mock them for now:
let currentUserId    -> UserId     = "uid_a12b".as(UserId)
let currentAccountId -> AccountId  = 1000.as(AccountId)
let bookings         : [BookingId] = (10_000..10_050).items.map(&.as(BookingId))

foul closeBookingOf(uid: UserId, accountId: AccountId, bId: BookingId) do
  IO.printLine("Closing booking (${bId}), for user [${uid}] in ${accountId})")
  # ...
end

foul handleBookings do
  bookings.each do |bid|
    closeBookingOf(currentUserId, bid, currentAccountId) # Error: `closeBookingOf` 
                           # expects argument 2 to be AccountId, but got BookingId
  end
end
```

Fixing `closeBookingOf` now works, makes this work:

```kex
foul closeBookingOf(uid: UserId, accountId: AccountId, bId: BookingId) do
  IO.printLine("Closing booking (${bId}), for user [${uid}] in ${accountId})")
  # ...
end

foul handleBookings do
  bookings.each do |bid|
    closeBookingOf(currentUserId, currentAccountId, bid) # order fixed
  end
end

main do
  handleBookings
end
```

```output filename="OUTPUT"
Closing booking (10000), for user [uid_a12b] in 1000)
Closing booking (10001), for user [uid_a12b] in 1000)
Closing booking (10002), for user [uid_a12b] in 1000)
Closing booking (10003), for user [uid_a12b] in 1000)
Closing booking (10004), for user [uid_a12b] in 1000)
Closing booking (10005), for user [uid_a12b] in 1000)
Closing booking (10006), for user [uid_a12b] in 1000)
Closing booking (10007), for user [uid_a12b] in 1000)
# ...
```

The `distinct` keyword before the type made the alias a totally distinct type which is now incompatible with both the type it is aliasing and all other type that type was alias as. This way both `AccountId` and `BookingId` is unmixible with each other and even with `Integer`.

This unfortunately means that we now can't just pass an integer to them. Integer literals are now completely different to these, so we have to use `as` to convert them in compile time:

```kex
let currentUserId    -> UserId    = "uid_a12b".as(UserId)
let currentAccountId -> AccountId = 1000.as(AccountId)
let bookings        : [BookingId] = (10_000..10_050).items.map(&.as(BookingId))
```

We still have to be careful when and how we use it, but it is much more explicit then letting them coerce automatically.

For `as` to work the compiler has to be able to check if the types are compatible. Attempting a conversion between completely disjoint types is a compile error:

```kex
main do
  let id = "bid_1234".as(BookingId) # Error: Cannot convert String to BookingId with `.as`
end
```

> [!TIP]
> Prefer distinct types over type alises if their alised types is too similar and mixing them could cause silent failures.
