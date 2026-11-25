// The GPS Swears It Was a Shortcut
// Writes one original GPS excuse (first person, GPS voice) to entry.txt.
// Deterministic: the same text on every run. No network, no randomness,
// no environment access except MAKEFUN_OUTPUT_DIR for the output directory.

import { mkdirSync, writeFileSync } from "node:fs";
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
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
