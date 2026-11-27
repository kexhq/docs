---
id: "guide-0-4-0-beta-4-modules"
title: "Modules"
description: "Organize declarations, control visibility, and import deliberately."
path: "/guide/0.4.0/modules/"
draft: false
template: "page"
---
Modules group related names. In this example, callers can use `heading`, while the `clean` helper stays inside the module:

```kex
module GuideFormatting do
  private do
    let clean(text: String) -> String = text.trim
  end

  let heading(text: String) -> String = clean(text).upperCase
end

assert(GuideFormatting.heading("  kex  ") == "KEX")
IO.printLine(GuideFormatting.heading("  kex  "))
```

```output filename="OUTPUT"
KEX
```

`GuideFormatting.heading("  kex  ")` trims the spaces and returns `"KEX"`. The qualified call shows where `heading` comes from. Functions are public by default; `private do ... end` keeps helpers out of the public API.

## Scoped imports

If a name is used often, import it from its module:

```kex
using GuideFormatting, only: [heading]
assert(heading("guide") == "GUIDE")
```

`using GuideFormatting, only: [heading]` lets the next call use `heading` without the module name. `only:` lists names to import; `except:` lists names to leave out. Use one or the other. You can also shorten the module name with `as:`:

```kex
using GuideFormatting, as: GF
assert(GF.heading("modules") == "MODULES")
```

The alias `GF` lets the call read `GF.heading("modules")`. A bare `using GuideFormatting` would import all its public names. A short `only:` list makes larger modules easier to read and avoids name collisions.

`using Module do ... end` limits an import to the block. A `using` in a function applies to the remaining function body. Modules can nest, producing qualified names such as `Application.Formatting.heading`.

## Files and source roots

In a Tey package, source files live under `src/`. A file may start with `module Reports` and then define that module's declarations. A nested module named `App.Reports` belongs at `src/app/reports.kex`. Follow the lowercase layout Tey generates so the compiler can find modules by name.

Run package programs and tests through Tey so dependency source roots are included. For direct compiler use, `--source-root src` specifies the project root used for module lookup and is repeatable for additional roots.

## A type and its namespace

A `record Account`, `module Account`, and `make Account` can coexist. The record defines data, the module owns type-level constructors and constants, and `make` owns receiver methods. Constructors such as `Account.Named(...)` remain namespaced; importing the type does not mean every constructor becomes a free function.

When an imported name is ambiguous, narrow the import or qualify the call. Do not rely on import ordering to decide which behavior runs.
