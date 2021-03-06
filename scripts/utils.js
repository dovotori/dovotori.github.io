const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const writeFile = promisify(fs.writeFile);

exports.copyFile = promisify(fs.copyFile);

exports.readFile = promisify(fs.readFile);

exports.saveFile = (url, data) => {
  writeFile(url, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.saveHtml = (url, data) => {
  const stream = fs.createWriteStream(url);
  stream.once('open', () => {
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

exports.removeFile = removeFile;

exports.readCsv = (url) =>
  new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(url)
      .pipe(csv())
      .on('error', (e) => reject(e))
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      });
  });

const deleteFolderRecursive = async (folderPath) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    // eslint-disable-next-line
    for await (const file of files) {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        await deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    }
    fs.rmdirSync(folderPath);
  }
};

exports.clean = deleteFolderRecursive;
