---
id: "guide-0-4-0-beta-4-compiled"
title: "Compile-time programming"
description: "Compute constants and generate checked declarations before runtime."
path: "/guide/0.4.0-beta.4/compiled/"
draft: false
template: "page"
---
`compiled do ... end` runs an expansion phase before semantic analysis. The surviving output is ordinary Kex declarations, which are then checked and compiled like handwritten code. Start with plain functions; use compile-time programming when it removes repetitive declarations or precomputes stable data.

## Constants

```kex
compiled do
  let GuidePrefix = "kex".upperCase
end
assert(GuidePrefix == "KEX")
```

A compile-time binding is evaluated while building. Do not confuse it with a runtime function whose result changes on each call.

## Generated names

```kex
compiled do
  ["guideAlpha", "guideBeta"].eachIndexed do |name, index|
    let %name(value: Integer) -> Integer = value + index
  end
end
assert(guideAlpha(10) == 10)
assert(guideBeta(10) == 11)
```

`%name` splices a computed declaration name. `%{expression}` computes a name from an expression. Generated type names must obey type-name rules. Values captured during generation become part of the generated body, which still passes through type checking.

Name generation is powerful enough to make an API hard to discover. Keep generation input small and explicit, and test generated behavior with names that cannot accidentally resolve to an unrelated standard-library function.

## Embedding and build inputs

`Kex.embed("relative/path.txt")` embeds a file as text at compile time. The path is relative to the source file containing the expression. The resulting runtime program does not need to reopen that file. This is useful for templates and fixed assets; it also makes those files build dependencies.

`ENV.get` is allowed for compile-time environment values. A value read in a compiled block is baked into the artifact, so it is no longer runtime configuration. Avoid embedding secrets and record environment-dependent build inputs when reproducibility matters.

## Inspect the result

```sh
kex --expand program.kex
kex -C program.kex
kex --collapse-report program.kex
```

`--expand` shows the expanded syntax, while `--collapse-report` explains compile-time evaluation of eligible builder expressions. Not every expression can collapse: runtime values can prevent evaluation and leave correct runtime work in place. A successful runtime test proves behavior, not that a particular optimization happened.

Tagged literals and templates build on related ideas but have their own validation rules. Use their documented APIs rather than assuming arbitrary runtime IO is allowed inside the compiler's expansion environment.
