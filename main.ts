// The last words live in entry.txt, not in this file.
// This runner only reads that file, checks it, and copies it out.
// Keeping the text in one place means one edit fixes every run.
// Reading at runtime keeps the output honest about the source file.
// A guard at the door beats an apology after the copy is made.
// The file stays the single source of truth for every run.
// Whitespace alone is not a sentence, so the runner refuses it.
// Limits are checked before a single byte leaves this process.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

let text;
try {
  text = readFileSync(entryPath, "utf8");
} catch {
  console.error("cannot read entry.txt");
  process.exit(1);
}

const length = [...text].length;
if (length === 0 || text.trim().length === 0) {
  console.error("entry.txt is empty or whitespace only");
  process.exit(1);
}
if (length > 200) {
  console.error(`entry.txt is ${length} code points, over the 200 limit`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
