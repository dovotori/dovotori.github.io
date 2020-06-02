const { promisify } = require('util');
const fs = require('fs');
const csv = require('csv-parser');

const writeFile = promisify(fs.writeFile);

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

exports.removeFile = (file) => {
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

exports.readCsv = (url) => new Promise((resolve, reject) => {
  const data = [];
  fs.createReadStream(url)
    .pipe(csv())
    .on('error', (e) => reject(e))
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => { resolve(data); });
});
