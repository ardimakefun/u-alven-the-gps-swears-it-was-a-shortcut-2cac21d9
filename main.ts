// The GPS Swears It Was a Shortcut
// Writes one original GPS excuse (first person, GPS voice) to entry.txt.
// Deterministic: the same text on every run. No network, no randomness,
// no environment access except MAKEFUN_OUTPUT_DIR for the output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I rerouted you through a wedding because the map swore it was a shortcut, and honestly the bride looked so happy I didn't want to ruin it by turning around.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate validation (fail-fast): one line, UTF-8, 1-200 characters, not
// whitespace only. Character count uses code points, matching the gate.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200) {
  fail(`entry is ${chars.length} characters, must be 1-200`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Re-validate the gate against the bytes actually written to disk:
// read the file back and re-check length, single line, and non-blank
// from the read-back content, not from the in-memory string. Any
// mismatch (encoding change, truncation, extra newline) fails loudly.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  fail("read-back entry.txt does not match the intended entry");
}
const writtenChars = [...written];
if (writtenChars.length < 1 || writtenChars.length > 200) {
  fail(`written entry is ${writtenChars.length} characters, must be 1-200`);
}
if (written.trim().length === 0) {
  fail("written entry is only whitespace");
}
if (written.includes("\n") || written.includes("\r")) {
  fail("written entry must be a single line");
}
