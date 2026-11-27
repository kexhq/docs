---
package: prelude
version: "0.4.0-rc.4-dev"
source: node.kex
title: Node
entities:
  - { kind: module, name: "Node" }
---

# Node

## module `Node`

Distributed Kex: this BEAM node and the nodes it is connected to.

A node is a running BEAM VM with a name. Once two nodes with the same cookie are connected, a `Process` from one works on the other: `send`, `link`, `monitor` and `Server` handles all work across the network.

Name a node when starting it (`kex --sname a --cookie secret app.kex`), or from inside the program with `Node.start`:

```kex
using Node

main do
  Node.connect(:b@myhost)
  Node.send(:b@myhost, :logger, (:hello, Node.self))
end
```

Node names are atoms: `:b@myhost` for a short name, a quoted `:"b@host.example.com"` for one with dots, or `Atom.from(text)` for one built at run time.

Plain data (numbers, strings, lists, tuples, records) can be sent anywhere. A message that carries a function, such as a lambda, needs the same compiled code on both nodes; `Node.spawn` sends its block's code along.

Under the tree-walk interpreter (`kex -R`) the program is always a single node with no name.

### `self` (foul)

```kex
self -> Atom
```

Returns this node's name, or `:nonode@nohost` when it is not distributed.

**Returns**: the node name

**Examples**

```kex
Node.self   # => :a@myhost
```

### `alive?` (foul)

```kex
alive? -> Bool
```

Returns `true` when this node has a name, so other nodes can connect to it.

**Returns**: `true` once the node has a name

**Examples**

```kex
Node.alive?   # => false, unless started with --sname or Node.start
```

### `list` (foul)

```kex
list -> [Atom]
```

Returns the nodes this one is connected to, not including itself.

**Returns**: the connected node names

**Examples**

```kex
Node.list   # => [:b@myhost]
```

### `start` (foul)

```kex
start(name: Atom) -> Result<Atom, String>
```

Makes this node distributed under `name`, as `--sname` or `--name` would at startup. A name whose host has a dot (`:"app@host.example.com"`) uses long names; any other uses short names.

**Parameters**

  - `name` — the node name, like `:app` or `:app@myhost`

**Returns**: the full node name, or why it could not start

**Examples**

```kex
Node.start(:app)   # => Ok(:app@myhost)
```

### `stop` (foul)

```kex
stop -> Result<Void, String>
```

Stops distribution: the node drops its name and every connection.

**Returns**: `Ok` once stopped, or an `Error` when the node was not distributed

### `connect` (foul)

```kex
connect(node: Atom) -> Result<Void, String>
```

Connects to the node named `node`. Both nodes must share a cookie.

**Parameters**

  - `node` — the node to connect to

**Returns**: `Ok` once the connection is up, or why it is not

**Examples**

```kex
Node.connect(:b@myhost)   # => Ok(())
```

### `disconnect` (foul)

```kex
disconnect(node: Atom) -> Result<Void, String>
```

Drops the connection to `node`.

**Parameters**

  - `node` — the node to disconnect from

**Returns**: `Ok` once dropped, or an `Error` when there was no connection

### `setCookie` (foul)

```kex
setCookie(cookie: String) -> Void
```

Sets the cookie this node presents when connecting. Nodes connect only when their cookies match.

**Parameters**

  - `cookie` — the shared secret

### `send` (foul)

```kex
send(node: Atom, name: Atom, message: X) -> Void
```

Sends `message` to the process registered as `name` on `node`.

Like `Process.send`, it does not block and does not fail, even when no such process exists.

**Parameters**

  - `node` — the node the process runs on
  - `name` — the name it was registered under
  - `message` — the message

**Examples**

```kex
Node.send(:b@myhost, :logger, (:info, "started"))
```

### `whereIs` (foul)

```kex
whereIs(node: Atom, name: Atom) -> Process<A>?
```

Returns the process registered as `name` on `node`, or `None`.

**Parameters**

  - `node` — the node to ask
  - `name` — the registered name

**Returns**: the process, or `None`

**Examples**

```kex
Node.whereIs(:b@myhost, :logger).map { |pid| pid.send(:flush) }
```

### `spawn` (foul)

```kex
spawn(node: Atom, block: Block<X>) -> Process<A>
```

Runs `block` in a new process on `node` and returns it.

When `node` has not loaded the module the block belongs to, that module's compiled code is sent and loaded first. A module `node` already has is not replaced.

**Parameters**

  - `node` — where to run it
  - `block` — the work

**Returns**: the new process

**Examples**

```kex
let me = Process.self
Node.spawn(:b@myhost) do me.send(Node.self) end
```
