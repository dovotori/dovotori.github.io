const path = require('path');
const favicons = require('favicons');
const fs = require('fs');
const { promisify } = require('util');
const config = require('../package.json');

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

const SOURCE = path.resolve(__dirname, '../assets/img/source.png');
const DEST = path.resolve(__dirname, '../assets/app');

const BACKGROUND_COLOR = '#222';

const options = {
  offset: 20, // offset in percentage
  background: false, // BACKGROUND_COLOR,
  mask: true,
  overlayGlow: false,
  overlayShadow: false,
};

const configuration = {
  path: 'PATH_ASSET/app', // Path for overriding default icons path.
  appName: config.name,
  appShortName: config.name,
  appDescription: 'portfolio de Dorian Ratovo',
  developerName: 'Dorian Ratovo',
  developerURL: 'https://dovotori.fr.nf',
  dir: 'ltr',
  lang: 'fr-FR',
  background: BACKGROUND_COLOR,
  theme_color: '#66ffcc',
  appleStatusBarStyle: BACKGROUND_COLOR,
  display: 'standalone',
  orientation: 'any',
  scope: '/',
  start_url: '/',
  version: '1.0',
  logging: false,
  pixel_art: false,
  loadManifestWithCredentials: false,
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
    //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
    //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
    //
    android: options, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
    appleIcon: options,
    appleStartup: options,
    coast: false,
    favicons: true,
    firefox: options,
    windows: options,
    yandex: false,
  },
};

const saveFile = (url, data) => {
  writeFile(url, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const createTemplate = (htmlFavicon) => {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, user-scalable=no'>
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="description" content="dorian ratovo - code + design">
  ${htmlFavicon}
  <link rel="icon" type="image/x-icon" href="PATH_ASSET/app/favicon.ico" />
  <link rel="stylesheet" type="text/css" href="PATH_ASSET/style/critical.css">
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title>
</head>

<body>
  <div id="<%= htmlWebpackPlugin.options.title %>"></div>
  <noscript>
    <div id="noscript">
      <h1>In JS we trust</h1>
      <p>Ce site utilise javascript pour s'afficher. S’il vous plaît, reconsiderez votre choix de le désactiver, pour ce site en tout cas :) ou utiliser un <a href="https://www.mozilla.org/fr/firefox/new/">navigateur compatible comme celui ci</a></p>
    </div>
  </noscript>
</body>
</html>
  `;
  saveFile(path.resolve(__dirname, '../src/templates/index.ejs'), html.replace(/PATH_ASSET/gi, '<%= htmlWebpackPlugin.options.base %>'));
};

const callback = (error, response) => {
  if (error) {
    console.log(error.message);
    return;
  }

  const { images, files, html } = response;
  images.forEach((img) => saveFile(`${DEST}/${img.name}`, img.contents));
  files.forEach((file) => saveFile(`${DEST}/${file.name}`, file.contents));
  createTemplate(html.join('\n    '));
};

const clean = (directory) => {
  readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      fs.unlink(path.join(directory, file), (e) => {
        if (e) throw e;
      });
    });
  });
};

const main = async () => {
  await clean(DEST);
  console.log('clean');
  await favicons(SOURCE, configuration, callback);
  console.log('done');
};

main();
