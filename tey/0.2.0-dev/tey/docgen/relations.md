---
package: tey
version: "0.2.0-dev"
source: tey/docgen/relations.kex
title: Tey.Docgen.Relations
entities:
  - { kind: module, name: "Tey.Docgen.Relations" }
---

# Tey.Docgen.Relations

Cross-file relations: which make blocks extend which type, which traits a type implements, and who implements each trait.

Extraction documents one file at a time, but a reader thinks in types. The methods of `Integer` live in number.kex, time.kex, units.kex and algebra.kex; the fact that a `List` is `Enumerable` — and so has `map`, `filter` and `find` — is written on a make block, not on the type. These indexes are what let the List page say where its methods come from, and the Enumerable page say who implements it.

## module `Tey.Docgen.Relations`

### `build`

```kex
build(pages: [SourcePage]) -> ([TypeFacts], [TraitFacts])
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

Where a reader should land for a type: the page declaring it; else the page titled after it (string.kex for the builtin String); else the page whose make block adds the most methods — number.kex for Integer, not algebra.kex, which only makes it a Monoid.

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

`implement: Enumerable` and `implement: Kex.Enumerable` both name the trait declared as `Enumerable` inside `module Kex`.

### `typeFactsFor`

```kex
typeFactsFor(model: PackageModel, base: String) -> TypeFacts?
```

The facts for the type a make target extends, if any make extends it.

### `traitFactsFor`

```kex
traitFactsFor(model: PackageModel, written: String) -> TraitFacts?
```

### `traitEntryFor`

```kex
traitEntryFor(model: PackageModel, facts: TraitFacts) -> TraitEntry?
```

The declaration of a trait, for its method list.

### `traitEntries`

```kex
traitEntries(entities: [Entity]) -> [TraitEntry]
```

### `traitMethods`

```kex
traitMethods(model: PackageModel, entry: TraitEntry) -> ([FunctionEntry], [FunctionEntry])
```

A trait's methods as an implementor sees them. Required: declared with no body and given no default anywhere. Provided: a body in the trait, or a default from a `make <Trait>` block in any file — plus methods such a block adds that the trait never declared.

### `traitDefaults`

```kex
traitDefaults(entities: [Entity], entry: TraitEntry) -> [FunctionEntry]
```

### `traitTarget?`

```kex
traitTarget?(model: PackageModel, target: String) -> Bool
```

Whether a make target names a trait of this package.

### `allFunctions`

```kex
allFunctions(entities: [Entity]) -> [FunctionEntry]
```

Every function documented anywhere in these entities: top-level and module functions, trait methods, make members.

### `required?`

```kex
required?(f: FunctionEntry) -> Bool
```

A trait method with no clause is one an implementor must write; one with a body comes for free.
