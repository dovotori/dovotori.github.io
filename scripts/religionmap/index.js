import path from "node:path";
import puppeteer from "puppeteer";
import { __dirname, readCsv, readFile, removeFile, saveHtml } from "./utils.js";

const SAVE_HTML_FILE = path.resolve(__dirname, "../../public/html/religionmap.html");
const SAVE_SVG_FILE = path.resolve(__dirname, "./religionmap.svg");

const generateSvg = async (showBrowser) => {
  const geoDataFile = await readFile(
    path.resolve(__dirname, "../common/world-110m.v1.json"),
    "utf8"
  );
  const countriesDataFile = path.resolve(__dirname, "../common/worldCountries.csv");
  const blasphemeDataFile = path.resolve(__dirname, "./blasphemeInfos.csv");
  const religionsDataFile = path.resolve(__dirname, "./WRPstate2010.csv");
  const cowDataFile = path.resolve(__dirname, "./COWstate.csv");

  const countriesDataCsv = await readCsv(countriesDataFile);
  const blasphemeDataCsv = await readCsv(blasphemeDataFile);
  const religionsDataCsv = await readCsv(religionsDataFile);
  const cowDataCsv = await readCsv(cowDataFile);

  const html = await readFile(path.resolve(__dirname, "./createSvg.html"), "utf8");
  const css = await readFile(path.resolve(__dirname, "./createSvg.css"), "utf8");

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
  await page.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.2/d3.min.js",
  });
  await page.addScriptTag({ url: "https://d3js.org/topojson.v3.min.js" });
  await page.addScriptTag({ path: path.resolve(__dirname, "./createSvg.js") });
  await page.addScriptTag({ content: extraScript });

  const svgData = await page.$eval("svg#worldmap", (domItem) => domItem.outerHTML);
  await removeFile(SAVE_SVG_FILE);
  await saveHtml(SAVE_SVG_FILE, svgData);
  if (!showBrowser) {
    await browser.close();
  }
  return svgData;
};

const generateHtml = async (showBrowser) => {
  const map = await generateSvg(showBrowser);
  const css = await readFile(path.resolve(__dirname, "./style.css"), "utf8");
  const infos = await readFile(path.resolve(__dirname, "./infos.html"), "utf8");
  return `
<style>${css}</style>
<div style="position: relative;text-align: center;">
  ${map}
  ${infos}
</div>`;
};

const main = async () => {
  const myArgs = process.argv.slice(2);
  const showBrowser = myArgs.indexOf("-s") !== -1 || myArgs.indexOf("--show") !== -1;

  console.log("process");
  const html = await generateHtml(showBrowser);
  console.log("clean");
  await removeFile(SAVE_HTML_FILE);
  saveHtml(SAVE_HTML_FILE, html);
  console.log("done");
};

main();
