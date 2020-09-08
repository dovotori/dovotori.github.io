const path = require('path');
const puppeteer = require('puppeteer');
const utils = require('../utils');

const SAVE_HTML_FILE = path.resolve(__dirname, '../../public/html/religionmap.html');
const SAVE_SVG_FILE = path.resolve(__dirname, './religionmap.svg');

const generateSvg = async (showBrowser) => {
  const geoDataFile = await utils.readFile(
    path.resolve(__dirname, '../common/world-110m.v1.json'),
    'utf8'
  );
  const countriesDataFile = path.resolve(__dirname, '../common/worldCountries.csv');
  const blasphemeDataFile = path.resolve(__dirname, './blasphemeInfos.csv');
  const religionsDataFile = path.resolve(__dirname, './WRPstate2010.csv');
  const cowDataFile = path.resolve(__dirname, './COWstate.csv');

  const countriesDataCsv = await utils.readCsv(countriesDataFile);
  const blasphemeDataCsv = await utils.readCsv(blasphemeDataFile);
  const religionsDataCsv = await utils.readCsv(religionsDataFile);
  const cowDataCsv = await utils.readCsv(cowDataFile);

  const html = await utils.readFile(path.resolve(__dirname, './createSvg.html'), 'utf8');
  const css = await utils.readFile(path.resolve(__dirname, './createSvg.css'), 'utf8');

  const extraScript = `
    const countries = ${JSON.stringify(countriesDataCsv)};
    const geojson = ${geoDataFile};
    const blasphemes = ${JSON.stringify(blasphemeDataCsv)};
    const religions = ${JSON.stringify(religionsDataCsv)};
    const cows = ${JSON.stringify(cowDataCsv)};
    main();
  `;

  const browser = await puppeteer.launch({ headless: !showBrowser });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.addStyleTag({ content: css });
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
  return `
<style>${css}</style>
<div style="position: relative;text-align: center;">
  ${map}
  <div id="infos">
    <h3></h3>
    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" class="chrstcatpct"></circle><circle cx="10" cy="10" r="7" class="chrstprotpct"></circle><circle cx="10" cy="10" r="7" class="chrstorthpct"></circle><circle cx="10" cy="10" r="7" class="chrstangpct"></circle><circle cx="10" cy="10" r="7" class="chrstothrpct"></circle><circle cx="10" cy="10" r="7" class="islmsunpct"></circle><circle cx="10" cy="10" r="7" class="islmshipct"></circle><circle cx="10" cy="10" r="7" class="judgenpct"></circle><circle cx="10" cy="10" r="7" class="anmgenpct"></circle><circle cx="10" cy="10" r="7" class="budgenpct"></circle><circle cx="10" cy="10" r="7" class="taogenpct"></circle><circle cx="10" cy="10" r="7" class="hindgenpct"></circle><circle cx="10" cy="10" r="7" class="confgenpct"></circle><circle cx="10" cy="10" r="7" class="syncgenpct"></circle><circle cx="10" cy="10" r="7" class="nonreligpct"></circle></svg>
    <div id="legend"><p class="chrstcatpct"><span class="legendBloc"></span><span class="legendText">Catholique</span>
      </p><p class="chrstprotpct"><span class="legendBloc"></span><span class="legendText">Protestant</span>
      </p><p class="chrstorthpct"><span class="legendBloc"></span><span class="legendText">Orthodoxe</span>
      </p><p class="chrstangpct"><span class="legendBloc"></span><span class="legendText">Anglican</span>
      </p><p class="chrstothrpct"><span class="legendBloc"></span><span class="legendText">Autres Chrétiens</span>
      </p><p class="islmsunpct"><span class="legendBloc"></span><span class="legendText">Sunnite</span>
      </p><p class="islmshipct"><span class="legendBloc"></span><span class="legendText">Shiite</span>
      </p><p class="judgenpct"><span class="legendBloc"></span><span class="legendText">Juif</span>
      </p><p class="anmgenpct"><span class="legendBloc"></span><span class="legendText">Animiste</span>
      </p><p class="budgenpct"><span class="legendBloc"></span><span class="legendText">Bouddhiste</span>
      </p><p class="taogenpct"><span class="legendBloc"></span><span class="legendText">Taoiste</span>
      </p><p class="hindgenpct"><span class="legendBloc"></span><span class="legendText">Hindou</span>
      </p><p class="confgenpct"><span class="legendBloc"></span><span class="legendText">Confusianiste</span>
      </p><p class="syncgenpct"><span class="legendBloc"></span><span class="legendText">Syncrétisme</span>
      </p><p class="nonreligpct"><span class="legendBloc"></span><span class="legendText">Non religieux</span>
      </p></div>
    <p></p>
  </div>
</div>
`;
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
