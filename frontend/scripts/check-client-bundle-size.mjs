import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const chunksDirectory = join(process.cwd(), ".next", "static", "chunks");
const maximumTotalBytes = 1_800_000;
const maximumSingleChunkBytes = 350_000;

async function javascriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return javascriptFiles(path);
    return entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
  }));
  return nested.flat();
}

let files;
try {
  files = await javascriptFiles(chunksDirectory);
} catch {
  console.error("No production build found. Run npm run build before checking bundle size.");
  process.exit(1);
}

const sizes = await Promise.all(files.map(async (file) => ({ file, size: (await stat(file)).size })));
const total = sizes.reduce((sum, item) => sum + item.size, 0);
const largest = sizes.toSorted((a, b) => b.size - a.size)[0];

if (total > maximumTotalBytes) {
  console.error(`Client JavaScript total ${total} bytes exceeds the ${maximumTotalBytes}-byte Beta budget.`);
  process.exitCode = 1;
}
if (largest && largest.size > maximumSingleChunkBytes) {
  console.error(`Largest client chunk ${largest.size} bytes exceeds the ${maximumSingleChunkBytes}-byte Beta budget: ${largest.file}`);
  process.exitCode = 1;
}

console.log(`Client bundle budget passed: ${files.length} chunks, ${total} bytes total, ${largest?.size ?? 0} bytes largest.`);
