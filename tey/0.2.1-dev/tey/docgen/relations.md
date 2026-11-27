---
package: tey
version: "0.2.1-dev"
source: tey/docgen/relations.kex
title: Tey.Docgen.Relations
entities:
  - { kind: module, name: "Tey.Docgen.Relations" }
---

# Tey.Docgen.Relations

Relations across files: which make blocks extend which type, which traits a type implements, and which types implement each trait.

Extraction works one file at a time, but readers look things up by type. The functions on `Integer` are spread over number.kex, period.kex, units.kex and algebra.kex, and that a `List` is `Enumerable`, and so has `map`, `filter` and `find`, is written on a make block rather than on the type. These indexes let the List page say where its functions come from, and the Enumerable page list its implementors.

## module `Tey.Docgen.Relations`

### `build`

```kex
build(pages: [SourcePage]) -> ([TypeFacts], [TraitFacts])
```

### `withTraitSignatures`

```kex
withTraitSignatures(pages: [SourcePage]) -> [SourcePage]
```

Returns `pages` with each untyped make member that implements a trait function given the trait's signature.

For `let identity = 0` under `make Integer, implement: Monoid`, that is the signature `Monoid` declares, with `This` read as `Integer`. It runs on the pages before anything renders them, so every output shows the same signature.

### `typedByTraits`

```kex
typedByTraits(e: Entity, traits: [TraitEntry]) -> Entity
```

### `typedByTrait`

```kex
typedByTrait(f: FunctionEntry, m: MakeEntry, traits: [TraitEntry]) -> FunctionEntry
```

### `asImplementor`

```kex
asImplementor(signature: String, target: String) -> String
```

### `pageExtensions`

```kex
pageExtensions(page: SourcePage, entities: [Entity]) -> [Extension]
```

### `extensionOf`

```kex
extensionOf(page: SourcePage, entity: Entity, entry: MakeEntry) -> Extension
```

### `typeFacts`

```kex
typeFacts(base: String, extensions: [Extension], pages: [SourcePage]) -> TypeFacts
```

### `homePathOf`

```kex
homePathOf(base: String, mine: [Extension], pages: [SourcePage]) -> String
```

Returns the page a type's links should go to.

That is the page declaring the type; failing that, the page titled after it (string.kex for the built-in String); then a page with both the type's companion module and a make block for it; and last the page whose make block adds the most functions, so number.kex for Integer rather than algebra.kex, which only makes it a Monoid.

### `homeAnchorOf`

```kex
homeAnchorOf(base: String, home: String, mine: [Extension], pages: [SourcePage]) -> String
```

### `declarationAnchors`

```kex
declarationAnchors(entities: [Entity], base: String) -> [String]
```

### `companionModule?`

```kex
companionModule?(entities: [Entity], base: String) -> Bool
```

### `declares?`

```kex
declares?(entities: [Entity], base: String) -> Bool
```

### `pageTraits`

```kex
pageTraits(page: SourcePage, entities: [Entity], extensions: [Extension]) -> [TraitFacts]
```

### `namesTrait?`

```kex
namesTrait?(written: String, name: String, qualifiedName: String) -> Bool
```

Returns whether `written`, as it appears in an `implement:` list, names the trait `name`. `implement: Enumerable` and `implement: Kex.Enumerable` both name the trait declared as `Enumerable` inside `module Kex`.

### `typeFactsFor`

```kex
typeFactsFor(model: PackageModel, base: String) -> TypeFacts?
```

Returns the facts for the type that make target `base` extends, or `None` when no make block extends it.

### `traitFactsFor`

```kex
traitFactsFor(model: PackageModel, written: String) -> TraitFacts?
```

### `traitEntryFor`

```kex
traitEntryFor(model: PackageModel, facts: TraitFacts) -> TraitEntry?
```

Returns the declaration of a trait, for its list of functions.

### `traitEntries`

```kex
traitEntries(entities: [Entity]) -> [TraitEntry]
```

### `traitMethods`

```kex
traitMethods(model: PackageModel, entry: TraitEntry) -> ([FunctionEntry], [FunctionEntry])
```

Returns a trait's functions as an implementor sees them: the required ones and the provided ones.

A function is required when the trait gives it no body and no `make <Trait>` block in any file gives it a default. The provided ones are the rest, plus any functions such a block adds that the trait does not declare.

### `traitDefaults`

```kex
traitDefaults(entities: [Entity], entry: TraitEntry) -> [FunctionEntry]
```

### `traitTarget?`

```kex
traitTarget?(model: PackageModel, target: String) -> Bool
```

Returns whether a make target names a trait of this package.

### `allFunctions`

```kex
allFunctions(entities: [Entity]) -> [FunctionEntry]
```

Returns every function documented in `entities`: top-level and module functions, trait functions and make members.

### `required?`

```kex
required?(f: FunctionEntry) -> Bool
```

Returns whether a trait function has no body, so an implementor must write it.
