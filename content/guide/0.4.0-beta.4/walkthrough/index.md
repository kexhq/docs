---
id: "guide-0-4-0-beta-4-walkthrough"
title: "A complete command-line program"
description: "Read and validate input, compute a report, and handle failures."
path: "/guide/0.4.0-beta.4/walkthrough/"
draft: false
template: "page"
---
This program reads one integer per nonblank line and prints their count and sum. It connects the guide's main ideas: a pure parser, typed errors, immutable transformations, an effectful input boundary, and explicit failure handling.

Save the following as `totals.kex`. Its companion tests appear in the second block.

<!-- guide-example: totals.kex -->
```kex
type TotalsProblem = InvalidNumber(Integer, String)

record Totals do
  count : Integer
  sum : Integer
end

let parseTotals(text: String) -> Result<Totals, TotalsProblem> do
  var count = 0
  var sum = 0
  var lineNumber = 0
  var remaining = text.lines
  while !remaining.empty? do
    let line = remaining.first.or("").trim
    remaining = remaining.drop(1)
    lineNumber = lineNumber + 1
    next if line.empty?
    match Integer.parse(line) do
      Ok(number) => do
        sum = sum + number
        count = count + 1
      end
      Error(_) => return Error(InvalidNumber(lineNumber, line))
    end
  end
  Ok(Totals { count: count, sum: sum })
end

main(args) do
  match args do
    [path] => do
      match FS.File.read(path) do
        Ok(text) => do
          match parseTotals(text) do
            Ok(totals) => IO.printLine("count=${totals.count}, sum=${totals.sum}")
            Error(InvalidNumber(line, value)) => IO.printLine("line ${line}: invalid integer '${value}'")
          end
        end
        Error(error) => IO.printLine("cannot read input: ${error}")
      end
    end
    _ => IO.printLine("usage: kex totals.kex <file>")
  end
end
```

## Run it

Create `numbers.txt` containing `10`, `20`, a blank line, and `-5`, each on its own line. Then run:

```sh
kex totals.kex numbers.txt
```

The output is `count=3, sum=25`. Replacing the second line with `twenty` produces `line 2: invalid integer 'twenty'`. A missing file follows the read-error branch. Running without exactly one argument prints usage.

The parser reports the original line number, including blank lines. It uses a local loop because a validation error should return immediately from the parser. The accumulators do not escape and the function is pure.

This teaching program prints diagnostics and returns normally. A production command used by shell scripts should also define nonzero exit statuses for usage and input failures, and send diagnostics to the appropriate error stream.

## Test the core

Save this next to the program as `totals.spec.kex`. Running it loads `totals.kex`'s declarations without running its `main`:

<!-- guide-example: totals.spec.kex -->
```kex
describe("parseTotals") do
  it("sums numbers and ignores blank lines") do
    assert(parseTotals("10\n20\n\n-5") == Ok(Totals { count: 3, sum: 25 }))
  end
  it("accepts empty input") do
    assert(parseTotals("") == Ok(Totals { count: 0, sum: 0 }))
  end
  it("reports the original line number") do
    assert(parseTotals("10\n\nbad") == Error(InvalidNumber(3, "bad")))
  end
end
```

```sh
kex totals.spec.kex
```

The tests require no filesystem mock because parsing receives text directly. The effectful shell around that pure function is small enough to exercise with a real temporary file. For large inputs, evolve the acquisition layer toward a feed while keeping validation and reporting explicit.
