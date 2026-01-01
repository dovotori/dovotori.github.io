import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { __dirname } from "./utils.js";

const SRC = [
  path.resolve(__dirname, "../public/img"),
  path.resolve(__dirname, "../public/textures"),
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function convertFile(file, base) {
  const rel = path.relative(base, file);
  const outWebp = path.join(base, rel).replace(/\.(jpe?g|png)$/i, ".webp");
  const outAvif = path.join(base, rel).replace(/\.(jpe?g|png)$/i, ".avif");

  try {
    const statSrc = await fs.stat(file);
    let doWebp = true;
    let doAvif = true;
    try {
      const statWebp = await fs.stat(outWebp);
      doWebp = statSrc.mtimeMs > statWebp.mtimeMs;
    } catch {
      // target doesn't exist, proceed to generate
      doWebp = true;
    }
    try {
      const statAvif = await fs.stat(outAvif);
      doAvif = statSrc.mtimeMs > statAvif.mtimeMs;
    } catch {
      // target doesn't exist, proceed to generate
      doAvif = true;
    }

    const input = await fs.readFile(file);
    if (doWebp) {
      await ensureDir(outWebp);
      await sharp(input).webp({ quality: 80 }).toFile(outWebp);
      console.log("generated", outWebp);
    }
    if (doAvif) {
      await ensureDir(outAvif);
      await sharp(input).avif({ quality: 50 }).toFile(outAvif);
      console.log("generated", outAvif);
    }
  } catch (e) {
    console.warn("failed to convert", file, e.message);
  }
}

(async () => {
  try {
    for (const src of SRC) {
      const paths = await walk(src);
      const promises = paths
        .map((p) => {
          if (/\.(jpe?g|png)$/i.test(p)) {
            return convertFile(p, src);
          }
          return null;
        })
        .filter((p) => p !== null);
      await Promise.all(promises);
    }
    console.log("image conversion done");
  } catch (e) {
    console.error("error converting images", e);
    process.exit(1);
  }
})();
