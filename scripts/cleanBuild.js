import path from "node:path";
import { __dirname, clean } from "./utils.js";

const DEST = path.resolve(__dirname, "../build");

const main = async () => {
  await clean(DEST);
};

main();
