---
package: prelude
version: "0.4.0-rc.5-dev"
source: evaluator.kex
title: Evaluator
entities:
  - { kind: module, name: "Evaluator" }
---

# Evaluator

## module `Evaluator`

Runs Kex source code at run time, in a sandbox.

Use it for code your program is given, such as a formula in a config file or a filter a user typed. Each call gets a fresh evaluator that cannot see the caller's variables, and the code can reach only what `EvaluatorOptions` allows. Step and depth limits stop a runaway program.

```kex
using Evaluator

Evaluator.runExpression("1 + 2")           # => Ok(3)
Evaluator.runExpression("[3,1,2].sort")    # => Ok([1, 2, 3])
```

Nothing here is in scope until `using Evaluator`. It works only under the tree-walk interpreter (`kex -R`).

### `run`

```kex
run(source: String) -> Result<Any, String>
run(source: String, opts: EvaluatorOptions) -> Result<Any, String>
```

Evaluates a whole Kex program and returns its result.

The source may declare functions, records and a `main`, as a file would, and the result is what `main` returns. A runtime error, a call the sandbox does not allow, or running past a limit comes back as an `Error` with a message. Source that does not parse currently returns `Ok(None)`.

**Parameters**

  - `source` — the Kex program to run
  - `opts` — what the sandbox allows; omitted for the defaults

**Returns**: the program's result, or why it failed

**Examples**

```kex
Evaluator.run("main do 1 + 1 end")   # => Ok(2)
```

_Running a user-supplied script with a tighter budget_

```kex
Evaluator.run(script, EvaluatorOptions {
  allow: [:Math, :List],
  maxSteps: 10_000
})
```

### `runExpression`

```kex
runExpression(source: String) -> Result<Any, String>
runExpression(source: String, opts: EvaluatorOptions) -> Result<Any, String>
```

Evaluates a single Kex expression and returns its value.

Use it when the input is a formula: there is no `main` to write. Source that does not parse currently returns `Ok(None)`.

**Parameters**

  - `source` — the Kex expression to evaluate
  - `opts` — what the sandbox allows; omitted for the defaults

**Returns**: the value, or why it failed

**Examples**

```kex
Evaluator.runExpression("1 + 2")          # => Ok(3)
Evaluator.runExpression("[3,1,2].sort")   # => Ok([1, 2, 3])
Evaluator.runExpression("nope()")
# => Error("Runtime error: <eval>:2:1: runtime error: undefined function: nope")
```

_Evaluating a formula from a config file_

```kex
Evaluator.runExpression(formula).or(0)
```

## record `EvaluatorOptions`

What evaluated code may call, and how long it may run.

By default it gets pure computation over the common data types, with no filesystem, network or processes. Narrow `allow` or lower the limits for less trusted source.

**Fields**

  - `allow` : [[Atom](atom.md#make-atom)] (optional)
  - `modules` : {[String](string.md#make-string): {[String](string.md#make-string): (Any) -> Any}} (optional)
  - `maxSteps` : Int (optional)
  - `maxDepth` : Int (optional)


