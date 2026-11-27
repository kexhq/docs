---
id: "guide-0-4-0-beta-4-walkthrough"
title: "A complete command-line program"
description: "Read and validate input, compute a report, and handle failures."
path: "/guide/0.4.0/walkthrough/"
draft: false
template: "page"
---
You can now combine values, functions, errors, and IO in one program. This example reads one integer per nonblank line, then prints how many numbers it found and their sum. It keeps parsing pure and puts file access in `main`.

Save the following as `totals.kex`. Read it in two parts: `parseTotals` turns text into either a report or a named error, and `main` deals with command arguments and file access. The companion tests appear later on this page.

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

```output filename="OUTPUT"
count=3, sum=25
```

Replacing the second line with `twenty` produces `line 2: invalid integer 'twenty'`. A missing file follows the read-error branch. Running without exactly one argument prints usage.

`parseTotals` starts with zero count and sum, then reads one line at a time. It skips blank lines but still counts them when reporting a later error. A valid integer increases both accumulators; invalid text returns `InvalidNumber` immediately. These local changes do not touch outside state, so the function is pure.

`main` handles the outside world. It expects one path, reads the file, calls the parser, and prints either a report or an error. Keeping that boundary small makes the parser usable without a real file.

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

The three cases cover numbers with a blank line, empty input, and an invalid number after a blank line. None needs a filesystem mock because `parseTotals` receives a string. The small file-reading part can be exercised separately with a temporary file. For large inputs, use a feed to acquire lines while keeping validation and reporting explicit.
