---
package: tey
version: "0.2.1-dev"
source: tey/docgen/relations.kex
title: Tey.Docgen.Relations
entities:
  - { kind: module, name: "Tey.Docgen.Relations" }
---

# Tey.Docgen.Relations

Cross-file relations: which make blocks extend which type, which traits a type implements, and who implements each trait.

Extraction documents one file at a time, but a reader thinks in types. The methods of `Integer` live in number.kex, time.kex, units.kex and algebra.kex; the fact that a `List` is `Enumerable` — and so has `map`, `filter` and `find` — is written on a make block, not on the type. These indexes are what let the List page say where its methods come from, and the Enumerable page say who implements it.

## module `Tey.Docgen.Relations`

### `build` (foul)

```kex
build(pages: [SourcePage]) -> ([TypeFacts], [TraitFacts])
```

### `withTraitSignatures` (foul)

```kex
withTraitSignatures(pages: [SourcePage]) -> [SourcePage]
```

A member that fulfils a trait function and declares no type of its own (`let identity = 0` under `make Integer, implement: Monoid`) is typed by the trait: the signature the trait declares, with `This` read as the implementing type. Done on the pages, before anything renders them, so every output states the same signature.

### `typedByTraits` (foul)

```kex
typedByTraits(e: Entity, traits: [TraitEntry]) -> Entity
```

### `typedByTrait` (foul)

```kex
typedByTrait(f: FunctionEntry, m: MakeEntry, traits: [TraitEntry]) -> FunctionEntry
```

### `asImplementor` (foul)

```kex
asImplementor(signature: String, target: String) -> String
```

### `pageExtensions` (foul)

```kex
pageExtensions(page: SourcePage, entities: [Entity]) -> [Extension]
```

### `extensionOf` (foul)

```kex
extensionOf(page: SourcePage, entity: Entity, entry: MakeEntry) -> Extension
```

### `typeFacts` (foul)

```kex
typeFacts(base: String, extensions: [Extension], pages: [SourcePage]) -> TypeFacts
```

### `homePathOf` (foul)

```kex
homePathOf(base: String, mine: [Extension], pages: [SourcePage]) -> String
```

Where a reader should land for a type: the page declaring it; else the page titled after it (string.kex for the builtin String); else the page whose make block adds the most methods — number.kex for Integer, not algebra.kex, which only makes it a Monoid.

### `homeAnchorOf` (foul)

```kex
homeAnchorOf(base: String, home: String, mine: [Extension], pages: [SourcePage]) -> String
```

### `declarationAnchors` (foul)

```kex
declarationAnchors(entities: [Entity], base: String) -> [String]
```

### `companionModule?` (foul)

```kex
companionModule?(entities: [Entity], base: String) -> Bool
```

### `declares?` (foul)

```kex
declares?(entities: [Entity], base: String) -> Bool
```

### `pageTraits` (foul)

```kex
pageTraits(page: SourcePage, entities: [Entity], extensions: [Extension]) -> [TraitFacts]
```

### `namesTrait?` (foul)

```kex
namesTrait?(written: String, name: String, qualifiedName: String) -> Bool
```

`implement: Enumerable` and `implement: Kex.Enumerable` both name the trait declared as `Enumerable` inside `module Kex`.

### `typeFactsFor` (foul)

```kex
typeFactsFor(model: PackageModel, base: String) -> TypeFacts?
```

The facts for the type a make target extends, if any make extends it.

### `traitFactsFor` (foul)

```kex
traitFactsFor(model: PackageModel, written: String) -> TraitFacts?
```

### `traitEntryFor` (foul)

```kex
traitEntryFor(model: PackageModel, facts: TraitFacts) -> TraitEntry?
```

The declaration of a trait, for its method list.

### `traitEntries` (foul)

```kex
traitEntries(entities: [Entity]) -> [TraitEntry]
```

### `traitMethods` (foul)

```kex
traitMethods(model: PackageModel, entry: TraitEntry) -> ([FunctionEntry], [FunctionEntry])
```

A trait's methods as an implementor sees them. Required: declared with no body and given no default anywhere. Provided: a body in the trait, or a default from a `make <Trait>` block in any file — plus methods such a block adds that the trait never declared.

### `traitDefaults` (foul)

```kex
traitDefaults(entities: [Entity], entry: TraitEntry) -> [FunctionEntry]
```

### `traitTarget?` (foul)

```kex
traitTarget?(model: PackageModel, target: String) -> Bool
```

Whether a make target names a trait of this package.

### `allFunctions` (foul)

```kex
allFunctions(entities: [Entity]) -> [FunctionEntry]
```

Every function documented anywhere in these entities: top-level and module functions, trait methods, make members.

### `required?` (foul)

```kex
required?(f: FunctionEntry) -> Bool
```

A trait method with no clause is one an implementor must write; one with a body comes for free.
