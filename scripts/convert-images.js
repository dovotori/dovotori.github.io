import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { __dirname } from "./utils.js";

const SRC = path.resolve(__dirname, "../public");

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

async function convertFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;
  const rel = path.relative(SRC, file);
  const outWebp = path.join(SRC, rel).replace(/\.(jpe?g|png)$/i, ".webp");
  const outAvif = path.join(SRC, rel).replace(/\.(jpe?g|png)$/i, ".avif");

  try {
    const statSrc = await fs.stat(file);
    let doWebp = true;
    let doAvif = true;
    const statWebp = await fs.stat(outWebp);
    doWebp = statSrc.mtimeMs > statWebp.mtimeMs;
    const statAvif = await fs.stat(outAvif);
    doAvif = statSrc.mtimeMs > statAvif.mtimeMs;

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
    const all = await walk(SRC);
    const images = all.filter((f) => /\.(jpe?g|png)$/i.test(f));
    for (const img of images) {
      await convertFile(img);
    }
    console.log("image conversion done");
  } catch (e) {
    console.error("error converting images", e);
    process.exit(1);
  }
})();
