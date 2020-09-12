const path = require('path');
const puppeteer = require('puppeteer');
const utils = require('../utils');

const SAVE_HTML_FILE = path.resolve(__dirname, '../../public/html/netmap.html');
const SAVE_SVG_FILE = path.resolve(__dirname, './netmap.svg');

const generateSvg = async (showBrowser) => {
  const geoDataFile = await utils.readFile(
    path.resolve(__dirname, '../common/world-110m.v1.json'),
    'utf8'
  );
  const countriesDataFile = path.resolve(__dirname, '../common/worldCountries.csv');
  const netDataFile = path.resolve(__dirname, './netEnnemies.csv');
  const countriesDataCsv = await utils.readCsv(countriesDataFile);
  const netDataCsv = await utils.readCsv(netDataFile);

  const html = await utils.readFile(path.resolve(__dirname, './createSvg.html'), 'utf8');
  // const css = await utils.readFile(path.resolve(__dirname, './createSvg.css'), 'utf8');
  const extraScript = `
    const countries = ${JSON.stringify(countriesDataCsv)};
    const net = ${JSON.stringify(netDataCsv)};
    const geojson = ${geoDataFile};
    main();
  `;

  const browser = await puppeteer.launch({ headless: !showBrowser });
  const page = await browser.newPage();
  await page.setContent(html);
  // await page.addStyleTag({ content: css });
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.2/d3.min.js' });
  await page.addScriptTag({ url: 'https://d3js.org/topojson.v3.min.js' });
  await page.addScriptTag({ path: path.resolve(__dirname, './createSvg.js') });
  await page.addScriptTag({ content: extraScript });

  const svgData = await page.$eval('svg#worldmap', (domItem) => domItem.outerHTML);
  await utils.removeFile(SAVE_SVG_FILE);
  await utils.saveHtml(SAVE_SVG_FILE, svgData);
  if (!showBrowser) {
    await browser.close();
  }
  return svgData;
};

const generateHtml = async (showBrowser) => {
  const map = await generateSvg(showBrowser);
  const css = await utils.readFile(path.resolve(__dirname, './style.css'), 'utf8');
  return `<style>${css}</style>${map}`;
};

const main = async () => {
  const myArgs = process.argv.slice(2);
  const showBrowser = myArgs.indexOf('-s') !== -1 || myArgs.indexOf('--show') !== -1;

  console.log('process');
  const html = await generateHtml(showBrowser);
  console.log('clean');
  await utils.removeFile(SAVE_HTML_FILE);
  utils.saveHtml(SAVE_HTML_FILE, html);
  console.log('done');
};

main();
