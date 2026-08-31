---
package: prelude
version: "0.4.0-alpha"
source: evaluator.kex
title: Evaluator
entities:
  - { kind: module, name: "Evaluator" }
---

# Evaluator

## module `Evaluator`

Running Kex source code at run time, in a sandbox.

Each call builds a fresh, isolated evaluator: the caller's environment is never shared, and the evaluated code sees only what `EvaluatorOptions` allows. Step and depth limits make a runaway program stop rather than hang.

```kex
Evaluator.runExpression("1 ` 2")           # => Ok(3)
Evaluator.runExpression("[3,1,2].sort")    # => Ok([1, 2, 3])
```

This is for evaluating expressions your program was given: a formula in a config file, a filter typed by a user. Every result is a `Result+, so a syntax error or a rejected call is a value you handle.

## function `run`

Evaluates a whole Kex program and returns its result.

The source may declare functions, records and a `main`, exactly as a file would. Anything that goes wrong: a parse error, a call the sandbox does not allow, running past the step limit: comes back as `Error` with a message.


```kex
run(source) : String -> Result<Any, String>
run(source) : String -> EvaluatorOptions -> Result<Any, String>
```


## function `runExpression`

Evaluates a single Kex expression and returns its value.

The form to reach for when the input is a formula rather than a program: there is no `main` to write and no declarations to skip past.


```kex
runExpression(source) : String -> Result<Any, String>
runExpression(source) : String -> EvaluatorOptions -> Result<Any, String>
```


## record `EvaluatorOptions`

What an evaluated program is allowed to reach, and how long it may run.

The defaults are already conservative: pure computation over the common data types, no filesystem, no network, no processes. Narrow `allow` further, or lower the limits, when the source is less trusted still.

**Fields**

  - `allow` : [Atom] (optional)
  - `modules` : {String: {String: (Any) -> Any}} (optional)
  - `maxSteps` : Int (optional)
  - `maxDepth` : Int (optional)
