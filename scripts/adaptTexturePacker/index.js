import path from "node:path";
import { __dirname, readFile, removeFile, saveHtml } from "./utils.js";

const SAVE_FILE = path.resolve(__dirname, "./level.txt");

const generateContent = async () => {
  const raw = await readFile(path.resolve(__dirname, "./raw.json"), "utf8");
  const { frames } = JSON.parse(raw);
  const uvs = Object.keys(frames).reduce((acc, key) => {
    const uv = frames[key].frame;
    const formatName = key.toUpperCase().replace(".PNG", "");
    const line = `[${formatName}]: { uv: [${JSON.stringify(uv)}] },\n`;
    return acc + line;
  }, "");

  const keys = Object.keys(frames).reduce((acc, key, index) => {
    const formatName = key.toUpperCase().replace(".PNG", "");
    const line = `const ${formatName} = ${index};\n`;
    return acc + line;
  }, "");
  return `${keys}\n\n${uvs}`;
};

const main = async () => {
  const content = await generateContent();
  console.log("clean");
  await removeFile(SAVE_FILE);
  saveHtml(SAVE_FILE, content);
  console.log("done");
};

main();
