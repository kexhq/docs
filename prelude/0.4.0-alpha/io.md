---
package: prelude
version: "0.4.0-alpha"
source: io.kex
title: IO
entities:
  - { kind: module, name: "IO" }
---

# IO

## module `IO`

Console input and output.

`IO` is a capability: every function in it touches the outside world, so it can only be called from `foul` code (or from `main`). Reading a line and printing a line are the two workhorses; `inspect` is the debugging tool that can be dropped into the middle of a chain without changing its value.

  main do     IO.print("name? ")     let name = IO.getLine.or("world")     IO.printLine("hello, ${name.trim}")   end

## constant `printLine`

Writes `msg` to stdout followed by a newline.

Any `Showable` value is accepted, not just strings — numbers, lists, maps and records print through their own `show` implementation. Called with no argument it prints an empty line.



## constant `print`

Writes `msg` to stdout without a trailing newline.

Use it to build a line from several pieces, or to write a prompt that the cursor should stay on.



## function `inspect`

Writes a colored, structured rendering of `val` to stderr and returns `val` unchanged.

Because it returns its argument, `inspect` can be spliced into the middle of a chain to see what is flowing through it, then removed again without touching the surrounding code. It writes to stderr, so it does not disturb a program whose stdout is piped somewhere. The type checker treats it as pure, so it is allowed inside pure functions.

Use `inspected` instead when you want the rendering as a `String` rather than written out.


```kex
inspect(val) : A -> A
```


## constant `getLine`

Reads one line from stdin, without the trailing newline.

Returns `None` at end of input, which is what makes it usable as a loop condition: the `None` is the end of the stream, not an error.



## constant `get`

Reads a single character from stdin.

Returns `None` at end of input. Note that the result is a one-character `String`, not a `Char`.



## constant `printError`

Writes `msg` to stderr followed by a newline.

Diagnostics belong on stderr so that a program's real output can be piped or redirected on its own. Unlike a raised error, this only prints — it does not stop the program.



## function `warn`

Writes `msg` to stderr. Identical to `printError`, named for the case where the message is a warning rather than a failure.


```kex
warn(msg) : Showable -> Void
```


## function `warning`

Writes `msg` to stderr. The long spelling of `warn`.


```kex
warning(msg) : Showable -> Void
```


## constant `out`

The three standard streams, as ordinary handle VALUES.

`IO.printLine(x)` and `IO.out.printLine(x)` are the same call: the convenience spelling stays, and the handle behind it is now something a program can name, pass and substitute. That is what `Mock.IO` cannot do — it is one global switch, so output from one library cannot go to a buffer while another's goes to the terminal, and a library cannot ACCEPT a sink (kexhq/kex#139).

Typestate says what each one permits: writing to `IO.in`, or reading from `IO.out`, is a compile error, exactly as it is for a file opened `Read`.

These three are PURE, so they are not part of the capability interface a stand-in must implement — naming a device performs no effect, writing THROUGH it does, and the handle methods are the `foul` ones. That also draws the seam between the two ways to redirect output: `with IO = ...` replaces the CALLS, so it does not touch a handle obtained here, while `Mock.IO` replaces the DEVICE (a group leader, kexhq/kex#141) and so captures `IO.out.printLine(x)` and `IO.printLine(x)` alike.

  report(IO.out, results)   report(IO.error, warnings)   report(FS.File.open("report.txt", Write).try, results)



## constant `error`

Standard error, as a handle. The sink `IO.printError` and `IO.warn` write to, reachable as a value.



## constant `in`

Standard input, as a handle. The source `IO.getLine` and `IO.get` read from, reachable as a value.

  firstLine(IO.in)


