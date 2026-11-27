---
id: "guide-0-4-0-beta-4-kex-vs-typescript"
title: "Kex vs TypeScript"
description: "Port a small delivery tracker while learning where the languages differ."
path: "/guide/0.4.0/kex-vs-typescript/"
draft: false
template: "page"
---
Let's port a tiny delivery tracker. It has parcels, a recipient who may be missing, and a status that changes as a parcel moves. Each step starts with TypeScript, then shows the Kex version and what changes in meaning.

The examples use Kex 0.4.0. You can read this page in order as a small program, or jump to the feature you need.

## 1. Give a parcel a shape

A TypeScript interface describes the fields a parcel should have:

```typescript
interface Parcel {
  id: number;
  recipient?: string;
}

const parcel: Parcel = { id: 42, recipient: "Ada" };
console.log(parcel.id); // 42
```

In Kex, a record defines the fields and constructs a value:

```kex
record Parcel do
  id : Integer
  recipient : String? = None
end

let parcel = Parcel { id: 42, recipient: Just("Ada") }
IO.printLine(parcel.id)
```

```output filename="OUTPUT"
42
```

The Kex constructor must supply `id`. It can omit `recipient` because that field defaults to `None`. A TypeScript interface participates in structural type checking; Kex's `Parcel` is a named record type. That difference matters when two values happen to have the same fields. [TypeScript type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

## 2. Handle the missing recipient

TypeScript's optional field may be `undefined`. Optional chaining and nullish coalescing give it a fallback:

```typescript
function recipientLabel(parcel: Parcel): string {
  return parcel.recipient?.toUpperCase() ?? "UNASSIGNED";
}

console.log(recipientLabel(parcel)); // ADA
```

Kex uses the `Optional<String>` value in the record:

```kex
let recipientLabel(value: Parcel) -> String = value.recipient.map(&.upperCase).or("UNASSIGNED")

assert(recipientLabel(parcel) == "ADA")
assert(recipientLabel(Parcel { id: 43 }) == "UNASSIGNED")
IO.printLine(recipientLabel(parcel))
IO.printLine(recipientLabel(Parcel { id: 43 }))
```

```output filename="OUTPUT"
ADA
UNASSIGNED
```

`Just("Ada")` contains a name and `None` does not. `map` transforms only a present name; `or` supplies the fallback. When absence has a reason that callers need, use `Result<A, E>` instead. Read [Optional values and errors](../errors/) for both forms.

## 3. Make the possible states visible

The tracker needs three states. TypeScript can use a discriminated union, where `kind` determines which other fields are available:

```typescript
type Delivery =
  | { kind: "queued" }
  | { kind: "sent"; receipt: string }
  | { kind: "failed"; reason: string };

function statusText(value: Delivery): string {
  switch (value.kind) {
    case "queued": return "waiting";
    case "sent": return `receipt ${value.receipt}`;
    case "failed": return `failed: ${value.reason}`;
  }
}

console.log(statusText({ kind: "sent", receipt: "R-42" })); // receipt R-42
```

Kex names the three alternatives directly:

```kex
type Delivery = Queued | Sent(String) | Failed(String)

let statusText(value: Delivery) -> String do
  match value do
    Queued => "waiting"
    Sent(receipt) => "receipt ${receipt}"
    Failed(reason) => "failed: ${reason}"
  end
end

assert(statusText(Queued) == "waiting")
assert(statusText(Failed("offline")) == "failed: offline")
IO.printLine(statusText(Sent("R-42")))
```

```output filename="OUTPUT"
receipt R-42
```

`Sent` carries a receipt; `Failed` carries a reason; `Queued` carries neither. In TypeScript, checking `kind` narrows a discriminated union. In Kex, the constructor pattern selects and binds its payload. [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) and [Kex pattern matching](../patterns/) explain the two approaches.

## 4. Update a list of parcels

This is where familiar-looking collection code can mislead you. A TypeScript `const` prevents rebinding the variable, but `push` still changes the array to which it refers:

```typescript
const parcels: Parcel[] = [parcel];
const earlier = parcels;
parcels.push({ id: 43 });
console.log(earlier.length); // 2
```

Kex values stay immutable. Here `var` permits the local binding to change, and `push!` rebinds it to the returned list:

```kex
foul showParcelRebinding() do
  var parcels = [parcel]
  let earlier = parcels
  parcels.push!(Parcel { id: 43 })
  IO.printLine(parcels.count)
  IO.printLine(earlier.count)
end
showParcelRebinding()
```

```output filename="OUTPUT"
2
1
```

The two names now refer to different list values. If you translate a TypeScript array algorithm, decide whether it depends on shared mutation. Kex's [Effects chapter](../effects/) shows how local reassignment and process-owned state work.

## 5. Put effects at the edge

TypeScript allows logging inside an ordinary function declaration. Kex asks the function to say when it performs IO:

```kex
let parcelSummary(value: Parcel, status: Delivery) -> String = "parcel ${value.id}: ${statusText(status)}"

foul printParcel(value: Parcel, status: Delivery) -> Void =
  IO.printLine(parcelSummary(value, status))

printParcel(parcel, Sent("R-42"))
```

```output filename="OUTPUT"
parcel 42: receipt R-42
```

`parcelSummary` only makes a string, so it remains pure. `printParcel` writes the string and uses `foul`. This keeps the calculation usable in a test without a console. The [Functions chapter](../functions/) introduces pure and foul declarations.

## 6. Keep identifiers apart when needed

TypeScript normally checks compatibility by structure. Two plain aliases of `number` still describe the same underlying type. Kex can mark identifiers as distinct even when both use integers:

```kex
distinct type ParcelId = Integer
distinct type CustomerId = Integer

let parcelId = 42.as(ParcelId)
let customerId = 42.as(CustomerId)
assert(parcelId.as(Integer) == customerId.as(Integer))
```

The equal integer representation does not make a parcel identifier a customer identifier. `.as(...)` makes the conversion explicit; it does not look up either value in a database. TypeScript can also use a branded type when a project needs a similar distinction, but a plain alias does not create it.

The port now has a record, an optional field, a set of states, a list update, and an IO boundary. Those are useful places to pause when translating a real program: follow the values and their effects, not just the punctuation. TypeScript's handbook documents [structural compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html), [readonly fields](https://www.typescriptlang.org/docs/handbook/2/objects.html), and [type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions).
