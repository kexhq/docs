---
package: prelude
version: "0.4.0-beta.4-dev"
source: node.kex
title: Node
entities:
  - { kind: module, name: "Node" }
---

# Node

## module `Node`

Distributed Kex: this BEAM node, and the other nodes it is connected to.

A node is one running BEAM VM with a name. Once two nodes share a cookie and are connected, a `Pid` from one works on the other: `send`, `link` and `monitor` cross the network unchanged, and so do typed `Process` and `Server` handles.

Name a node when starting it (`kex --sname a --cookie secret app.kex`), or from inside the program with `Node.start`:

```kex
using Node

main do
  Node.connect(:b@myhost)
  Node.send(:b@myhost, :logger, (:hello, Node.self))
end
```

Node names are atoms: `:b@myhost` for a short name, the quoted `:"b@host.example.com"` for one with dots, or `Atom.from(text)` for one built at runtime.

Both nodes need the same compiled code for anything that carries a function, like a lambda or a record whose methods the receiver calls; `Node.spawn` sends its block's code along. Plain data — numbers, strings, lists, tuples, records — needs nothing.

Backed by Kex.Intrinsic.Node on the BEAM. The tree-walk interpreter is always a single, unnamed node.

### `self`

```kex
self : Atom
```

This node's name, or `:nonode@nohost` when it is not distributed.

**Returns**: the node name

**Examples**

```kex
Node.self   # => :a@myhost
```

### `alive?`

```kex
alive? : Bool
```

Whether this node is distributed — started with a name, so other nodes can connect to it.

**Returns**: true once the node has a name

**Examples**

```kex
Node.alive?   # => false, unless started with --sname or Node.start
```

### `list`

```kex
list : [Atom]
```

The nodes this one is currently connected to, not including itself.

**Returns**: the connected node names

**Examples**

```kex
Node.list   # => [:b@myhost]
```

### `start`

```kex
start(name: Atom) -> Result<Atom, String>
```

Makes this node distributed under `name`, as `--sname`/`--name` would at startup. A `name` whose host has a dot (`:"app@host.example.com"`) uses long names; anything else uses short names.

**Parameters**

  - `name` — the node name, like `:app` or `:app@myhost`

**Returns**: the full node name, or why it could not start

**Examples**

```kex
Node.start(:app)   # => Ok(:app@myhost)
```

### `stop`

```kex
stop : Bool
```

Stops distribution: the node drops its name and every connection.

**Returns**: whether it was distributed and has now stopped

### `connect`

```kex
connect(node: Atom) -> Bool
```

Connects to the node named `node`. Both nodes must share a cookie.

**Parameters**

  - `node` — the node to connect to

**Returns**: whether the connection is up

**Examples**

```kex
Node.connect(:b@myhost)   # => true
```

### `disconnect`

```kex
disconnect(node: Atom) -> Bool
```

Drops the connection to `node`.

**Parameters**

  - `node` — the node to disconnect from

**Returns**: whether a connection was dropped

### `setCookie`

```kex
setCookie(cookie: String) -> Void
```

Sets the cookie this node presents when connecting. Nodes connect only when their cookies match.

**Parameters**

  - `cookie` — the shared secret

### `send`

```kex
send : Atom -> Atom -> X -> Void
```

Sends `message` to the process registered as `name` on `node`, unchanged. Like `Pid.send`, it never blocks and never fails.

**Parameters**

  - `node` — the node the process runs on
  - `name` — the name it was registered under
  - `message` — the message

**Examples**

```kex
Node.send(:b@myhost, :logger, (:info, "started"))
```

### `whereIs`

```kex
whereIs(node: Atom, name: Atom) -> Pid?
```

The `Pid` registered as `name` on `node`, or `None`.

**Parameters**

  - `node` — the node to ask
  - `name` — the registered name

**Returns**: the process, or `None`

**Examples**

```kex
Node.whereIs(:b@myhost, :logger).map { |pid| pid.send(:flush) }
```

### `spawn`

```kex
spawn(node: Atom, block: Block<X>) -> Pid
```

Runs `block` in a new process on `node` and returns its `Pid`.

The block is a function of THIS program. When `node` has not loaded the module it belongs to, that module's compiled code is sent over and loaded first. A module `node` already has is left as it is.

**Parameters**

  - `node` — where to run it
  - `block` — the work

**Returns**: the new process

**Examples**

```kex
let me = Process.self
Node.spawn(:b@myhost) do me.send(Node.self) end
```
