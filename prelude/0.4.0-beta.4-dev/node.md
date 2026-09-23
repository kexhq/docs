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

## function `self`

This node's name, or `:nonode@nohost` when it is not distributed.


```kex
self() : Atom
```


## function `alive?`

Whether this node is distributed — started with a name, so other nodes can connect to it.


```kex
alive?() : Bool
```


## function `list`

The nodes this one is currently connected to, not including itself.


```kex
list() : [Atom]
```


## function `start`

Makes this node distributed under `name`, as `--sname`/`--name` would at startup. A `name` whose host has a dot (`:"app@host.example.com"`) uses long names; anything else uses short names.


```kex
start(name) : Atom -> Result<Atom, String>
```


## function `stop`

Stops distribution: the node drops its name and every connection.


```kex
stop() : Bool
```


## function `connect`

Connects to the node named `node`. Both nodes must share a cookie.


```kex
connect(node) : Atom -> Bool
```


## function `disconnect`

Drops the connection to `node`.


```kex
disconnect(node) : Atom -> Bool
```


## function `setCookie`

Sets the cookie this node presents when connecting. Nodes connect only when their cookies match.


```kex
setCookie(cookie) : String -> Void
```


## function `send`

Sends `message` to the process registered as `name` on `node`, unchanged. Like `Pid.send`, it never blocks and never fails.


```kex
send : Atom -> Atom -> X -> Void
```


## function `whereIs`

The `Pid` registered as `name` on `node`, or `None`.


```kex
whereIs(node, name) : Atom -> Atom -> Pid?
```


## function `spawn`

Runs `block` in a new process on `node` and returns its `Pid`.

The block is a function of THIS program. When `node` has not loaded the module it belongs to, that module's compiled code is sent over and loaded first. A module `node` already has is left as it is.


```kex
spawn(node, block) : Atom -> Block<X> -> Pid
```

