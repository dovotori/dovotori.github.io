const path = require('path');

const utils = require('./utils');

const DEST = path.resolve(__dirname, '../build');

const main = async () => {
  await utils.clean(DEST);
};

main();
