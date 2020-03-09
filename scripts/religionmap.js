const path = require('path');
const utils = require('./utils');

const DATA_FILE = path.resolve(__dirname, '../public/data/religionmap/data.json');
const HTML_FILE = path.resolve(__dirname, '../public/html/religionmap.html');

const SVG_CODES = [
  'AF', 'AO', 'AL', 'AE', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BI', 'BE', 'BJ', 'BF', 'BD', 'BG', 'BA', 'BY', 'BZ', 'BO', 'BR', 'BN', 'BT', 'BW', 'CF', 'CA', 'CH', 'CL', 'CN', 'CI', 'CM', 'CD', 'CG', 'CO', 'CR', 'CU', 'CZ', 'DE', 'DJ', 'DK', 'DO', 'DZ', 'EC', 'EG', 'ER', 'EE', 'ET', 'FI', 'FJ', 'GA', 'GB', 'GE', 'GH', 'GN', 'GM', 'GW', 'GQ', 'GR', 'GL', 'GT', 'GY', 'HN', 'HR', 'HT', 'HU', 'ID', 'IN', 'IE', 'IR', 'IQ', 'IS', 'IL', 'IT', 'JM', 'JO', 'JP', 'KZ', 'KE', 'KG', 'KH', 'KR', 'XK', 'KW', 'LA', 'LB', 'LR', 'LY', 'LK', 'LS', 'LT', 'LU', 'LV', 'MA', 'MD', 'MG', 'MX', 'MK', 'ML', 'MM', 'ME', 'MN', 'MZ', 'MR', 'MW', 'MY', 'NA', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NZ', 'OM', 'PK', 'PA', 'PE', 'PH', 'PG', 'PL', 'KP', 'PT', 'PY', 'PS', 'QA', 'RO', 'RU', 'RW', 'EH', 'SA', 'SD', 'SS', 'SN', 'SL', 'SV', 'RS', 'SR', 'SK', 'SI', 'SE', 'SZ', 'SY', 'TD', 'TG', 'TH', 'TJ', 'TM', 'TL', 'TN', 'TR', 'TW', 'TZ', 'UG', 'UA', 'UY', 'US', 'UZ', 'VE', 'VN', 'VU', 'YE', 'ZA', 'ZM', 'ZW', 'SO', 'GF', 'FR', 'ES', 'AW', 'AI', 'AD', 'AG', 'BS', 'BM', 'BB', 'KM', 'CV', 'KY', 'DM', 'FK', 'FO', 'GD', 'HK', 'KN', 'LC', 'LI', 'MF', 'MV', 'MT', 'MS', 'MU', 'NC', 'NR', 'PN', 'PR', 'PF', 'SG', 'SB', 'ST', 'SX', 'SC', 'TC', 'TO', 'TT', 'VC', 'VG', 'VI', 'CY', 'RE', 'YT', 'MQ', 'GP', 'CW', 'IC'];

const getClassName = (d) => {
  const categories = [d.blaspheme, d.apostasie, d.diffamation];
  let nomClasse = '';
  categories.forEach((c) => {
    if (c === 'oui') {
      nomClasse += 'O';
    } else {
      nomClasse += 'N';
    }
  });

  switch (nomClasse) {
    default: case 'NNN': return 'noPenalty';
    case 'ONN': return 'blaspheme';
    case 'NON': return 'apostasie';
    case 'NNO': return 'diffamation';
    case 'OON': return 'blasphemeApostasie';
    case 'NOO': return 'apostasieDiffamation';
    case 'ONO': return 'blasphemeDiffamation';
    case 'OOO': return 'allPenalties';
  }
};

const generateDataObject = async () => {
  const countriesDataFile = path.resolve(__dirname, '../public/data/common/worldCountries.csv');
  const blasphemFile = path.resolve(__dirname, '../public/data/religionmap/blasphemeInfos.csv');
  const religionFile = path.resolve(__dirname, '../public/data/religionmap/WRPstate2010.csv');
  const cow = path.resolve(__dirname, '../public/data/religionmap/COWstate.csv');

  const countriesDataCsv = await utils.readCsv(countriesDataFile);
  const blasphemCsv = await utils.readCsv(blasphemFile);
  const religionCsv = await utils.readCsv(religionFile);
  const cowCsv = await utils.readCsv(cow);

  const filterDataCountries = countriesDataCsv.filter((data) => SVG_CODES.indexOf(data['ISO3166-1-Alpha-2']) !== -1);
  // const notFound = SVG_CODES.filter((iso) => countriesDataCsv.filter((d) => iso === d['ISO3166-1-Alpha-2']).length === 0);

  // FIX wrong COW iso
  const wrongIsos = religionCsv.reduce((acc, { name }) => {
    if (filterDataCountries.filter((d) => name === d['ISO3166-1-Alpha-3']).length === 0) {
      return [...acc, name];
    }
    return acc;
  }, []);
  const wrongNames = wrongIsos
    .filter((wrongIso) => cowCsv.filter((d) => d.cow === wrongIso)[0])
    .map((wrongIso) => ({ name: cowCsv.filter((d) => d.cow === wrongIso)[0].name, wrongIso }));
  const countriesToFix = wrongNames.reduce((acc, cur) => {
    const match = filterDataCountries.filter((country) => {
      const str = Object.keys(country).map((d) => country[d]).join(',');
      return str.indexOf(`,${cur.name},`) !== -1;
    });
    if (match && match[0]) {
      const realIso = match[0]['ISO3166-1-Alpha-3'];
      return { ...acc, [cur.wrongIso]: realIso };
    }
    // console.log('pb', cur);
    return acc;
  }, {});
  const fixReligionCsv = religionCsv.map((d) => {
    if (countriesToFix[d.name]) {
      return {
        ...d,
        name: countriesToFix[d.name]
      };
    }
    return d;
  });

  return filterDataCountries.reduce((acc, cur) => {
    const {
      'ISO3166-1-Alpha-2': iso2, official_name_fr: fr, official_name_en: en, 'ISO3166-1-Alpha-3': iso3
    } = cur;
    let entry = {
      fr,
      en,
      iso3,
    };
    const blasphem = blasphemCsv.filter((d) => iso3 === d.iso);
    if (blasphem[0]) {
      const { mort } = blasphem[0];

      entry = {
        ...entry,
        className: getClassName(blasphem[0]),
        mort: mort === 'oui'
      };
    }
    const religion = fixReligionCsv.filter((d) => iso3 === d.name);
    if (religion[0]) {
      const {
        chrstcatpct,
        chrstprotpct,
        chrstorthpct,
        chrstangpct,
        chrstothrpct,
        islmsunpct,
        islmshipct,
        judgenpct,
        anmgenpct,
        budgenpct,
        taogenpct,
        hindgenpct,
        confgenpct,
        syncgenpct,
        nonreligpct
      } = religion[0];

      entry = {
        ...entry,
        religion: {
          chrstcatpct,
          chrstprotpct,
          chrstorthpct,
          chrstangpct,
          chrstothrpct,
          islmsunpct,
          islmshipct,
          judgenpct,
          anmgenpct,
          budgenpct,
          taogenpct,
          hindgenpct,
          confgenpct,
          syncgenpct,
          nonreligpct
        }
      };
    }
    return {
      ...acc,
      [iso2]: entry
    };
  }, {});
};

const generateHtml = async () => {
  const map = await utils.readFile(path.resolve(__dirname, '../public/svg/world.svg'));
  return `<style>
  #worldmap {
    display: block;
    margin: 0 auto;
    transition: transform 2s ease-out;
  }

  #worldmap path {
    stroke-width: 0.4;
    stroke: #000;
    transition: fill 10s ease-out;
  }

  .noPenalty {
    fill: #dfdfdf;
  }

  .diffamation {
    fill: #568cac;
  }

  .blaspheme {
    fill: #5656bf;
  }

  .apostasie {
    fill: #8080a0;
  }

  .blasphemeDiffamation {
    fill: #804ab4;
  }

  .apostasieDiffamation {
    fill: #ac568c;
  }

  .blasphemeApostasie {
    fill: #bf5656;
  }

  .allPenalties {
    fill: #533a67;
  }

  .peindeDeMort {
    fill: transparent;
  }

  .pictoDeath {
    stroke: #000;
    stroke-width: 2;
    fill: #fff;
  }

  #infos {
    position: absolute;
    left: 50%;
    bottom: 50%;
    width: 50%;
    background: rgba(255,255,255,0.8);
    padding: 1em;
    text-align: left;
    transition: transform 500ms ease-out;
    transform: none;
    transform-origin: center center;
    overflow: hidden;
  }

  #infos[data-hide] {
    transform: scale(0);
  }

  #infos h3 {
    letter-spacing: 0.02em;
    font-size: 1em;
    color: #000;
  }

  #infos svg {
    width: 50%;
    height: auto;
    float: left;
  }

  #infos svg circle {
    fill: transparent;
    stroke-width: 3;
    transition: stroke-dashoffset 1s ease-out, stroke-dasharray 1s ease-out;
  }

  #legend {
    width: 50%;
    float: left;
  }

  #legend .legendBloc {
    display: inline-block;
    width: 10px;
    height: 10px;
  }

  #legend .legendText {
    font-size: 0.8em;
    margin-left: 0.5em;
    font-family: sans-serif;
    color: #000;
  }

  .infosSource {
    font-size: 0.7em;
    font-family: sans-serif;
    fill: #fff;
    cursor: pointer;
  }

  #infosFond {
    fill: rgba(60, 60, 60, 0.95);
  }

  .capitaleTexte {
    font-size: 40%;
    font-family: sans-serif;
    fill: #aaa;
  }

  .capitalePoint {
    fill: #aaa;
  }

  .pictosMort {
    stroke-width: 0.03em;
    stroke: #000;
    fill: #fff;
  }
</style>
<div style="position: relative;text-align: center;">
  ${map}
  <div id="infos">
    <h3></h3>
    <svg viewBox="0 0 20 20"></svg>
    <p></p>
  </div>
</div>`;
};

const main = async () => {
  console.log('clean');
  await utils.removeFile(DATA_FILE);
  await utils.removeFile(HTML_FILE);

  console.log('process');
  const data = await generateDataObject();
  utils.saveFile(DATA_FILE, JSON.stringify(data));

  const html = await generateHtml();
  utils.saveHtml(HTML_FILE, html);

  console.log('done');
};

main();
