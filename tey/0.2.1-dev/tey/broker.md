---
package: tey
version: "0.2.1-dev"
source: tey/broker.kex
title: Tey.Broker
entities:
  - { kind: module, name: "Tey.Broker" }
---

# Tey.Broker

## module `Tey.Broker`

### `grants`

```kex
grants(plugin: Plugin, workspaceRoot: String) -> Grants
```

### `answered`

```kex
answered(grants: Grants, line: String) -> String
```

One request line in, one response line out. Never raises: a request that cannot be read or is refused is answered, so the plugin can say why.

### `host`

```kex
host(url: String) -> Result<String, String>
```

The host name of an http(s) URL, lower-cased; an error for anything else, or for a URL that hides its host behind user information.

## record `Grants`

The plugin host's side of a command's conversation.

A plugin command runs in a sandbox where it can write nothing and reach no network. Whatever it wants done in the world it asks for, one JSON object per line on its stdout, and waits for the answer on its stdin:

```kex
{"op":"print","text":"…"}
{"op":"read","path":"README.md"}
{"op":"write","path":".github/workflows/ci.yml","content":"…"}
{"op":"delete","path":"old.yml"}
{"op":"run","command":"git","arguments":["status","--short"]}
{"op":"fetch","method":"GET","url":"https://api.github.com/…","body":""}
```

Each request is checked here against what the plugin declared and the user approved, then carried out by Tey or refused:

```kex
{"ok":true, …}        {"ok":false,"error":"…"}
```

So `Process.Run(["git"])` means git and nothing else, and `Net.Connect(["api.github.com"])` means that host and no other — the plugin never runs a program with the user's access or opens a socket; Tey does, on its behalf, after looking.

What a plugin was approved for.

**Fields**

  - `workspaceRoot` : [String](../../../prelude/0.4.0-rc.1-dev/string.md#make-string)
  - `writes?` : [Bool](../../../prelude/0.4.0-rc.1-dev/truthyable.md#make-bool) (optional)
  - `commands` : [[String](../../../prelude/0.4.0-rc.1-dev/string.md#make-string)] (optional)
  - `hosts` : [[String](../../../prelude/0.4.0-rc.1-dev/string.md#make-string)] (optional)


