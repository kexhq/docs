#!/usr/bin/env python3
"""Run the 0.4.0 guide's examples on both backends.

Only fenced `kex` blocks are executable. Blocks on a page form one program,
unless `guide-example: filename` markers name separate files. `guide-backend:
beam` limits a page to BEAM. Shell and manifest excerpts are deliberately not
executed. Temporary files and compiler output stay outside the checkout.
"""
import argparse
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "content/guide/0.4.0"


def run(command, cwd, expected=None):
    try:
        result = subprocess.run(command, cwd=cwd, text=True,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                timeout=90)
    except subprocess.TimeoutExpired as error:
        raise RuntimeError(f"Timed out: {' '.join(command)}") from error
    output = result.stdout
    if result.returncode or re.search(r"[1-9]\d* (?:failed|failing)", output):
        raise RuntimeError(f"{' '.join(command)}\n{output}")
    if expected is not None and expected not in output:
        raise RuntimeError(f"Expected {expected!r}: {' '.join(command)}\n{output}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--kex", default=os.environ.get("KEX", "kex"))
    parser.add_argument("--backend", choices=("both", "beam", "interpreter"), default="both")
    parser.add_argument("--page", action="append",
                        choices=sorted(p.parent.name for p in GUIDE.glob("*/index.md")),
                        help="Check only the named page(s)")
    args = parser.parse_args()
    failures = []
    passed = 0
    with tempfile.TemporaryDirectory(prefix="kex-guide-") as directory:
        work = Path(directory)
        for page in sorted(GUIDE.glob("*/index.md")):
            if args.page and page.parent.name not in args.page:
                continue
            text = page.read_text()
            blocks = re.findall(r"```kex\n(.*?)\n```", text, re.S)
            if not blocks:
                continue
            folder = work / page.parent.name
            folder.mkdir()
            named = re.findall(r"<!-- guide-example: ([\w.-]+) -->\s*```kex\n(.*?)\n```", text, re.S)
            if named:
                if len(named) != len(blocks):
                    raise RuntimeError(f"Unnamed block in multi-file example: {page}")
                files = {name: body for name, body in named}
            else:
                suffix = ".spec.kex" if page.parent.name == "testing" else ".kex"
                files = {"guide_" + page.parent.name + suffix: "\n\n".join(blocks)}
            if page.parent.name == "io":
                # Exercise the documented resource helper with actual handles,
                # including the empty-input and failed-open branches.
                (folder / "first-line.txt").write_text("first\nsecond\n")
                (folder / "empty.txt").write_text("")
                name = next(iter(files))
                files[name] += '\nassert(firstLine("first-line.txt").try == Just("first"))'
                files[name] += '\nassert(firstLine("empty.txt").try == None)'
                files[name] += '\nassert(firstLine("missing.txt").error?)'
            for name, body in files.items():
                (folder / name).write_text(body + "\n")
            backends = ["beam", "interpreter"] if args.backend == "both" else [args.backend]
            if "<!-- guide-backend: beam -->" in text:
                backends = [b for b in backends if b == "beam"]
            for backend in backends:
                flags = ["-R"] if backend == "interpreter" else []
                try:
                    for name in files:
                        run([args.kex, "-C", name, "--no-colors"], folder)
                        run([args.kex, *flags, name, "--no-colors"], folder)
                    if page.parent.name == "walkthrough":
                        (folder / "numbers.txt").write_text("10\n20\n\n-5\n")
                        (folder / "invalid.txt").write_text("10\ntwenty\n")
                        for filename, expected in [
                            ("numbers.txt", "count=3, sum=25"),
                            ("invalid.txt", "line 2: invalid integer 'twenty'"),
                            ("missing.txt", "cannot read input:"),
                        ]:
                            run([args.kex, *flags, "totals.kex", "--no-colors", filename], folder, expected)
                        run([args.kex, *flags, "totals.kex", "--no-colors"], folder, "usage:")
                    passed += 1
                    print(f"PASS {page.parent.name} ({backend})", flush=True)
                except RuntimeError as error:
                    failures.append(f"{page.parent.name} ({backend}): {error}")
                    print(f"FAIL {failures[-1]}", flush=True)
    print(f"\n{passed} passed; {len(failures)} failed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
