const path = require('path');
const utils = require('./utils');

const PATH_ASSETS = path.resolve(__dirname, '../assets/');
const PATH_LABO = path.resolve(__dirname, '../labo/');

const main = async () => {
  const myArgs = process.argv.slice(2);
  const name = myArgs[0];

  if (name) {
    console.log('process');
    let html = await utils.readFile(`${PATH_ASSETS}/html/labo.html`, 'utf8');
    html = html.replace(/labo/g, name);
    utils.saveFile(`${PATH_ASSETS}/html/${name}.html`, html);
    console.log(`save ${PATH_ASSETS}/html/${name}.html`);

    let js = await utils.readFile(`${PATH_ASSETS}/js/labo.js`, 'utf8');
    js = js.replace(/labo/g, name);
    utils.saveFile(`${PATH_ASSETS}/js/${name}.js`, js);
    console.log(`save ${PATH_ASSETS}/js/${name}.js`);

    let config = await utils.readFile(`${PATH_LABO}/configs/labo.js`, 'utf8');
    config = config.replace(/labo/g, name);
    utils.saveFile(`${PATH_LABO}/configs/${name}.js`, config);
    console.log(`save ${PATH_LABO}/configs/${name}.js`);

    await utils.copyFile(`${PATH_LABO}/scenes/labo.js`, `${PATH_LABO}/scenes/${name}.js`);

    console.log('done');
  } else {
    console.log('no name specify');
  }
};

main();
