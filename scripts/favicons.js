const path = require('path');
const favicons = require('favicons');
const fs = require('fs');
const { promisify } = require('util');
const utils = require('./utils');

const config = require('../package.json');

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
  path: '/assets/app/', // Path for overriding default icons path.
  appName: config.name,
  appShortName: config.name,
  appDescription: 'portfolio de Dorian Ratovo',
  developerName: 'Dorian Ratovo',
  developerURL: 'https://dovotori.gitlab.io',
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
    android: options,
    appleIcon: options,
    appleStartup: options,
    coast: false,
    favicons: true,
    firefox: options,
    windows: options,
    yandex: false,
  },
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
  <link rel="icon" type="image/x-icon" href="<%= htmlWebpackPlugin.options.base %>/app/favicon.ico" />
  <link rel="stylesheet" type="text/css" href="<%= htmlWebpackPlugin.options.base %>/style/critical.css">
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
  utils.saveFile(path.resolve(__dirname, './templates/index.ejs'), html);
};

const callback = (error, response) => {
  if (error) {
    console.log(error.message);
    return;
  }

  const { images, files, html } = response;
  images.forEach((img) => utils.saveFile(`${DEST}/${img.name}`, img.contents));
  files.forEach((file) => utils.saveFile(`${DEST}/${file.name}`, file.contents));
  console.log('create template ejs');
  createTemplate(html.join('\n    '));
};

const main = async () => {
  await utils.clean(DEST);
  console.log('clean');
  await favicons(SOURCE, configuration, callback);
  console.log('done');
};

main();
