import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const writeFile = promisify(fs.writeFile.bind(fs));

export const copyFile = promisify(fs.copyFile.bind(fs));

export const readFile = promisify(fs.readFile.bind(fs));

export const saveFile = (url, data) => {
  writeFile(url, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

export const saveHtml = (url, data) => {
  const stream = fs.createWriteStream(url);
  stream.once("open", () => {
    stream.end(data);
  });
};

const removeFile = (file) => {
  try {
    if (fs.existsSync(file)) {
      fs.unlink(file, (e) => {
        if (e) throw e;
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export { removeFile };

export const readCsv = (url) =>
  new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(url)
      .pipe(csv())
      .on("error", (e) => reject(e))
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      });
  });

export const clean = async (folderPath) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    for await (const file of files) {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        await clean(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    }
    fs.rmdirSync(folderPath);
  }
};
