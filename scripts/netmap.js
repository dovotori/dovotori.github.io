const path = require('path');
const utils = require('./utils');

// const DATA_FILE = path.resolve(__dirname, '../public/data/netmap/data.json');
const HTML_FILE = path.resolve(__dirname, '../public/html/netmap.html');

const SVG_ISO_NUMERIC = [4, 24, 8, 784, 32, 51, 10, 260, 36, 40, 31, 108, 56, 204, 854, 50, 100, 44, 70, 112, 84, 68, 76, 96, 64, 72, 140, 124, 756, 152, 156, 384, 120, 180, 178, 170, 188, 192, 196, 203, 276, 262, 208, 214, 12, 218, 818, 232, 724, 233, 231, 246, 242, 238, 250, 266, 826, 268, 288, 324, 270, 624, 226, 300, 304, 320, 328, 340, 191, 332, 348, 360, 356, 372, 364, 368, 352, 376, 380, 388, 400, 392, 398, 404, 417, 116, 410, 414, 418, 422, 430, 434, 144, 426, 440, 442, 428, 504, 498, 450, 484, 807, 466, 104, 499, 496, 508, 478, 454, 458, 516, 540, 562, 566, 558, 528, 578, 524, 554, 512, 586, 591, 604, 608, 598, 616, 630, 408, 620, 600, 275, 634, 642, 643, 646, 732, 682, 729, 728, 686, 90, 694, 222, 706, 688, 740, 703, 705, 752, 748, 760, 148, 768, 764, 762, 795, 626, 780, 788, 792, 158, 834, 800, 804, 858, 840, 860, 862, 704, 548, 887, 710, 894, 716
];

const radToDeg = (rad) => (180 * rad) / Math.PI;

const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let result = minDest + ((valeur - minRef) * (maxDest - minDest)) / (maxRef - minRef);
  if (result < Math.min(minDest, maxDest)) {
    result = Math.min(minDest, maxDest);
  }
  if (result > Math.max(minDest, maxDest)) {
    result = Math.max(minDest, maxDest);
  }
  return result;
};

const generateCss = (countries, netDataCsv) => netDataCsv.reduce((acc, cur) => {
  const country = countries.filter((d) => d['ISO3166-1-Alpha-3'] === cur.iso);
  if (country && country[0]) {
    const pathId = country[0]['ISO3166-1-numeric'];
    const newAcc = `${acc}
        #worldmap path[data-iso="${pathId}"] {
          fill: #cd1335;
        }
        #worldmap path[data-iso="${pathId}"]:hover {
          fill: #580823;
        }`;
    return newAcc;
  }
  return acc;
}, '');

const getInstitutions = (netDataCsv) => netDataCsv.reduce((acc, cur) => {
  const {
    institutionsFR, iso, nom, name, capitaleFR, latitudeCapitale, longitudeCapitale
  } = cur;
  const newCountry = {
    iso, nom, name, capitaleFR, latitudeCapitale, longitudeCapitale
  };
  const newCountries = acc[institutionsFR] ? [...acc[institutionsFR], newCountry] : [newCountry];
  return {
    ...acc,
    [institutionsFR]: newCountries
  };
}, {});

const extraSvg = (institutions) => {
  const {
    PI, cos, sin, atan
  } = Math;
  const WIDTH = 600;
  const NB_POINTS = Object.keys(institutions).length;
  const items = Object.keys(institutions).reduce((acc, cur, index) => {
    const circlePos = mapFromRange(index, 0, NB_POINTS, 0, 2 * PI);
    const x = cos(circlePos) * (WIDTH / 2);
    const y = sin(circlePos) * (WIDTH / 2);
    const angle = radToDeg(atan(y / x));
    const textAnchor = x > 0 ? 'start' : 'end';
    const LINE_HEIGHT = 16 * 0.6;
    const lines = cur.split('_');
    const finalLines = lines.map((text, i) => (
      `<text  x="0" y="${(LINE_HEIGHT / 2) - (((lines.length - 1) / 2) * LINE_HEIGHT) + (i * LINE_HEIGHT)}">${text.replace(/"/gi, '')}</text>`
    ));
    return `${acc}
    <g class="institution" transform="translate(${x},${y}) rotate(${angle})" text-anchor="${textAnchor}">
      ${finalLines}
      <rect x="0" y="0" width="4" height="4" fill="#0f0"/>
    </g>`;
  }, '');
  return `<g class="institutions" transform="translate(${WIDTH / 2}, ${WIDTH / 2})">${items}</g></svg>`;
};

const generateHtml = async () => {
  const countriesDataFile = path.resolve(__dirname, '../public/data/common/worldCountries.csv');
  const netDataFile = path.resolve(__dirname, '../public/data/netmap/netEnnemies.csv');
  const countriesDataCsv = await utils.readCsv(countriesDataFile);
  const netDataCsv = await utils.readCsv(netDataFile);
  const filterDataCountries = countriesDataCsv.filter((data) => SVG_ISO_NUMERIC.indexOf(parseInt(data['ISO3166-1-numeric'], 10)) !== -1);
  const institutions = getInstitutions(netDataCsv);

  const map = await utils.readFile(path.resolve(__dirname, '../public/svg/worldAzimuthalEqui.svg'), 'utf8');
  const extraCss = await generateCss(filterDataCountries, netDataCsv);
  return `<style>
  #worldmap {
    display: block;
    margin: 0 auto;
    overflow:visible;
  }

  #worldmap path {
    stroke-width: 0.4;
    stroke: #222;
    fill: #A2AFAE;
    transition: fill 300ms ease-out, stroke 300ms ease-out;
  }

  [theme=light] #worldmap path {
    stroke: #fff;
  }

  #worldmap .institutions text {
    font-family: Verdana, sans-serif;
    font-size: 0.6em;
    fill: #fff;
    transition: transform 300ms ease-out, fill 300ms ease-out;
  }

  [theme=light] #worldmap .institutions text {
    fill: #000;
  }

  #worldmap .institutions .institution:hover text {
    transform: scale(1.5);
  }

  ${extraCss}
</style>
<div style="position: relative;text-align: center; padding: 10em 0;">
  ${map.replace('</svg>', extraSvg(institutions))}
</div>
<script>window.addEventListener("load", function() {
  console.log("Hello");
}, false);</script>`;
};

const main = async () => {
  console.log('clean');
  // await utils.removeFile(DATA_FILE);
  await utils.removeFile(HTML_FILE);

  console.log('process');
  // const data = await generateDataObject();
  // utils.saveFile(DATA_FILE, JSON.stringify(data));

  const html = await generateHtml();
  utils.saveHtml(HTML_FILE, html);

  console.log('done');
};

main();
