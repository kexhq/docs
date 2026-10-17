---
package: prelude
version: "0.4.0-alpha"
source: prelude.kex
title: Prelude
entities:

---

# Prelude

The prelude is the automatically visible part of the standard library.

Keep this file declarative: each bare `using` names a sibling stdlib source file. The toolchain expands these imports in order when it builds or loads the prelude. Libraries absent from this list (for example FS and Regex) stay available through an explicit `using`.


