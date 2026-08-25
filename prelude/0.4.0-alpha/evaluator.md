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

Sandboxed evaluation of Kex source code at runtime.

Creates a fresh, isolated evaluator for each call — the caller's environment is never shared. Returns `Result<Any, String>`.

## function `run`

Evaluates a full Kex program string.


```kex
run(source) : String -> Result<Any, String>
run(source) : String -> EvaluatorOptions -> Result<Any, String>
```


## function `runExpression`

Evaluates a single Kex expression.


```kex
runExpression(source) : String -> Result<Any, String>
runExpression(source) : String -> EvaluatorOptions -> Result<Any, String>
```


## record `EvaluatorOptions`

**Fields**

  - `allow` : [Atom] (optional)
  - `modules` : {String: {String: (Any) -> Any}} (optional)
  - `maxSteps` : Int (optional)
  - `maxDepth` : Int (optional)
