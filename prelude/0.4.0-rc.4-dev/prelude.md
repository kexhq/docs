---
package: prelude
version: "0.4.0-rc.4-dev"
source: prelude.kex
title: Prelude
entities:

---

# Prelude

The standard-library modules every Kex source file sees without a `using`.

The prelude holds everyday values and operations (`List`, `Map`, `String`, `Math`, `IO`), the protocols the language itself relies on (`Enumerable`, `Truthyable`, `Errorable`), and core runtime services such as processes and time. That is why `.map`, conditions and `.try` work without importing the traits that define them.

Every prelude name is in scope in every program, so a module belongs here only when most code needs it or the language depends on it. A module stays opt-in when it grants a capability that should show up in a file's imports, or when most programs have no use for its names. The filesystem (`FS`), regular expressions (`Regex`), JSON, parser combinators (`Parsing`), bit operations (`Bits`), data structures such as `Data.Set`, hashing (`Digest`), command-line parsing (`OptionParser`) and the sandboxed evaluator (`Evaluator`) are all opt-in.

```kex
using FS

main do
  let config = FS.File.read("config.txt").or("")
  IO.printLine(config)
end
```

This file only lists modules. Each bare `using` names a sibling stdlib source, and the toolchain expands them in order when it builds or loads the prelude. Document a type or function next to its declaration in that source, not here.


