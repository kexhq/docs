---
package: prelude
version: "0.4.0-beta.4-dev"
source: atom.kex
title: Atom
entities:
  - { kind: module, name: "Atom" }
  - { kind: make, name: "Atom" }
---

# Atom

## module `Atom`

Atoms: the `:name` values. An atom is its own name — two atoms with the same text are the same value, and comparing them is as cheap as comparing numbers.

```kex
:ok
:b@localhost                  # an interior `@` is part of a bare atom
:"b@host.example.com"         # the quoted form spells any text
```

Most atoms are written in the source. `Atom.from` makes one from text built at runtime — a node name, say — and `string` gives the text back.

## function `from`

Returns the atom whose name is `text`.

On the BEAM atoms are never freed, and a node holds at most about a million. Build atoms from a bounded set of names — node names, config keys — never from untrusted input; `existing` is the safe form for that.


```kex
from(text) : String -> Atom
```


## function `existing`

Returns the atom named `text` only if one already exists, and `None` otherwise — it never creates an atom, so it is safe on untrusted input.


```kex
existing(text) : String -> Atom?
```


## make `Atom`


#### `string`

Returns the atom's name as text, without the leading colon. Total, like `Char.string`: every atom has a name.

```kex
string : String
```

**Returns**: `String` — the name

**Examples**

```kex
:ok.string                    # => "ok"
:"b@host.example.com".string  # => "b@host.example.com"
```
