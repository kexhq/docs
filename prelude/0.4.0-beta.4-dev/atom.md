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

Most atoms are written in the source. From text:

```kex
"hello".as(Atom)     # at compile time, from a literal
Atom.from(text)      # at run time, making the atom — a node name, say
text.to(Atom)        # at run time, only an atom that already exists: Atom?
```

and `string` gives the text back.

### `from`

```kex
from(text: String) -> Atom
```

Returns the atom whose name is `text`.

On the BEAM atoms are never freed, and a node holds at most about a million. Build atoms from a bounded set of names — node names, config keys — never from untrusted input; `text.to(Atom)` is the safe form for that, since it only finds atoms that already exist.

**Parameters**

  - `text` — the atom's name

**Returns**: the atom

**Examples**

```kex
Atom.from("ok") == :ok                # => true
Atom.from("app@${host}")              # => :"app@myhost"
```

## type `Atom`

### `string`

```kex
string : String
```

Returns the atom's name as text, without the leading colon. Total, like `Char.string`: every atom has a name.

**Returns**: the name

**Examples**

```kex
:ok.string                    # => "ok"
:"b@host.example.com".string  # => "b@host.example.com"
```


