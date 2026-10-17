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

### `run`

```kex
run(source: String) -> Result<Any, String>
run(source: String, opts: EvaluatorOptions) -> Result<Any, String>
```

Evaluates a full Kex program string.

### `runExpression`

```kex
runExpression(source: String) -> Result<Any, String>
runExpression(source: String, opts: EvaluatorOptions) -> Result<Any, String>
```

Evaluates a single Kex expression.

## record `EvaluatorOptions`

**Fields**

  - `allow` : [Atom] (optional)
  - `modules` : {[String](string.md#make-string): {[String](string.md#make-string): (Any) -> Any}} (optional)
  - `maxSteps` : Int (optional)
  - `maxDepth` : Int (optional)


