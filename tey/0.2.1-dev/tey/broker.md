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

### `answered` (foul)

```kex
answered(grants: Grants, line: String) -> String
```

Carries out one request line and returns the response line.

It does not fail: a request that cannot be parsed, or is not allowed, gets an `{"ok":false}` response that says why.

### `host`

```kex
host(url: String) -> Result<String, String>
```

Returns the lower-cased host name of an `http` or `https` URL.

Any other scheme is an error, and so is a URL with user information before the host (`https://user@host/`), which could disguise the real host.

## record `Grants`

Tey's side of a plugin command's requests.

A plugin command runs in a sandbox where it cannot write files or reach the network. To get something done it writes a request to stdout, one JSON object per line, and reads the answer from stdin:

```kex
{"op":"print","text":"…"}
{"op":"read","path":"README.md"}
{"op":"write","path":".github/workflows/ci.yml","content":"…"}
{"op":"delete","path":"old.yml"}
{"op":"run","command":"git","arguments":["status","--short"]}
{"op":"fetch","method":"GET","url":"https://api.github.com/…","body":""}
```

Tey checks each request against the capabilities the plugin declared and the user approved, then either carries it out or refuses it:

```kex
{"ok":true, …}        {"ok":false,"error":"…"}
```

A grant of `Process.Run(["git"])` lets the plugin run git and nothing else, and `Net.Connect(["api.github.com"])` lets it reach that host only. The plugin never runs a program or opens a connection itself; Tey does it for the plugin once the request passes the check.

The capabilities a plugin was approved for: whether it may write in the workspace, which commands it may run, and which hosts it may fetch from.

**Fields**

  - `workspaceRoot` : [String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)
  - `writes?` : [Bool](../../../prelude/0.4.0-rc.5-dev/truthyable.md#make-bool) (optional)
  - `commands` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)
  - `hosts` : [[String](../../../prelude/0.4.0-rc.5-dev/string.md#make-string)] (optional)


