---
package: prelude
version: "0.4.0-rc.5-dev"
source: atom.kex
title: Atom
entities:
  - { kind: module, name: "Atom" }
  - { kind: make, name: "Atom" }
---

# Atom

## module `Atom`

Named constants such as `:ok`, `:error` and `:reset`, used for labels, statuses and message tags.

Atoms with the same name are equal, and an atom never equals a string.

```kex
:ok == :ok                    # => true
:ok == :error                 # => false
:ok.string                    # => "ok"
```

An atom is written with a leading colon. The name may include `@`, as node names do; quote a name that contains spaces or other punctuation:

```kex
:app@localhost
:"app@host.example.com"
:"two words"
```

To convert text to an atom:

```kex
"hello".as(Atom)    # a string literal, converted at compile time
Atom.from("hello")  # creates the atom at run time if it does not exist
"hello".to(Atom)    # Just(:hello) if the atom exists, otherwise None
```

On the BEAM atoms are never freed, so use `text.to(Atom)` for external input. The interpreter (`kex -R`) has no atom table, and there `to(Atom)` converts any string.

### `from`

```kex
from(text: String) -> Atom
```

Returns the atom whose name is `text`.

The atom is created if it does not exist yet. On the BEAM atoms are never freed and a node holds at most about a million, so only build atoms from a bounded set of names, such as node names or configuration keys. For untrusted input use `text.to(Atom)`, which only finds existing atoms.

**Parameters**

  - `text` — the atom's name

**Returns**: the atom

**Examples**

```kex
Atom.from("ok") == :ok                # => true
Atom.from("app@${host}")              # => :app@myhost
```

## type `Atom`

### `string`

```kex
string -> String
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
to(String) -> String?
```

Returns the atom's name wrapped in `Just`, as `string` does without the wrapper.

The result has no colon: `:ok` converts to `"ok"`, so this undoes `text.to(Atom)`.

**Returns**: the name, always `Just`

**Examples**

```kex
:hello.to(String)                       # => Just("hello")
"hello".to(Atom).into { |a| a.to(String) }   # => Just("hello")
```


