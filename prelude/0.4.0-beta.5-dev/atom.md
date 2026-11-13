---
package: prelude
version: "0.4.0-beta.5-dev"
source: atom.kex
title: Atom
entities:
  - { kind: module, name: "Atom" }
  - { kind: make, name: "Atom" }
---

# Atom

## module `Atom`

Atoms are named values such as `:ok`, `:error`, and `:reset`. Use them for labels, statuses, and message tags. Atoms with the same name are equal; an atom and a string are different values.

```kex
:ok == :ok                    # => true
:ok == :error                 # => false
:ok.string                    # => "ok"
```

Write atoms with a leading colon. Node names can include `@`; use quotes for names containing spaces or punctuation:

```kex
:app@localhost
:"app@host.example.com"
:"two words"
```

To convert text to an atom:

```kex
"hello".as(Atom)     # converts a string literal at compile time
Atom.from("hello")  # creates or finds an atom at run time
"hello".to(Atom)    # finds an existing atom: Just(:hello), or None
```

On the BEAM, atoms are never freed. Use `text.to(Atom)` for external input to avoid creating an unbounded number of atoms.

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

Returns the atom's name as a string, without the leading colon.

**Returns**: the name

**Examples**

```kex
:ok.string                    # => "ok"
:"b@host.example.com".string  # => "b@host.example.com"
```

### `to`

```kex
to(_) -> String?
```

Returns the atom's name as text, like `string`, through the universal conversion. The name, not the displayed form: `:ok` converts to `"ok"`, not `":ok"`, so `text.to(Atom)` and this are inverses.

**Returns**: the name, always `Just`

**Examples**

```kex
:hello.to(String)                       # => Just("hello")
"hello".to(Atom).flatMap { |a| a.to(String) }   # => Just("hello")
```


