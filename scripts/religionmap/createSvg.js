/* global d3 topojson geojson blasphemes countries religions */
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
    default:
    case 'NNN':
      return 'noPenalty';
    case 'ONN':
      return 'blaspheme';
    case 'NON':
      return 'apostasie';
    case 'NNO':
      return 'diffamation';
    case 'OON':
      return 'blasphemeApostasie';
    case 'NOO':
      return 'apostasieDiffamation';
    case 'ONO':
      return 'blasphemeDiffamation';
    case 'OOO':
      return 'allPenalties';
  }
};

const RELIGION_INFOS = {
  chrstcatpct: { fr: 'Catholique', en: 'Catholic', color: '#7199F0' },
  chrstprotpct: { fr: 'Protestant', en: 'Prostestant', color: '#AAD1E3' },
  chrstorthpct: { fr: 'Orthodoxe', en: 'Orthodox', color: '#A7A7D8' },
  chrstangpct: { fr: 'Anglican', en: 'Anglican', color: '#AB89F1' },
  chrstothrpct: { fr: 'Autres Chrétiens', en: 'Others Christians', color: '#5D65C2' },
  islmsunpct: { fr: 'Sunnite', en: 'Sunni', color: '#82C7A1' },
  islmshipct: { fr: 'Shiite', en: "Shi'a", color: '#9DE47A' },
  judgenpct: { fr: 'Juif', en: 'Judaism', color: '#F08686' },
  anmgenpct: { fr: 'Animiste', en: 'Animist', color: '#EECC5C' },
  budgenpct: { fr: 'Bouddhiste', en: 'Buddhism', color: '#DFB561' },
  taogenpct: { fr: 'Taoiste', en: 'Taoism', color: '#D69773' },
  hindgenpct: { fr: 'Hindou', en: 'Hindu', color: '#EC7F4E' },
  confgenpct: { fr: 'Confusianiste', en: 'Confusianism', color: '#C37FA6' },
  syncgenpct: { fr: 'Syncrétisme', en: 'Syncretism', color: '#C35D5C' },
  nonreligpct: { fr: 'Non religieux', en: 'Non-religious', color: '#999' },
  // oth: { fr: 'Autres', en: 'Others', color: '#DDD' }
};

const PATH_LENGTH = 43.962541581;

const main = () => {
  let projection;
  const geoGenerator = d3.geoPath().projection(projection);

  const svg = document.querySelector('#worldmap');
  const viewBoxAttr = svg.getAttribute('viewBox').split(' ');
  const WIDTH = parseFloat(viewBoxAttr[2], 10);
  const HEIGHT = parseFloat(viewBoxAttr[3], 10);

  const state = {
    type: 'Mercator',
    scale: 120,
    translateX: WIDTH / 2,
    translateY: HEIGHT / 2,
    centerLon: 0,
    centerLat: 0,
    rotateLambda: 0.1,
    rotatePhi: 0,
    rotateGamma: 0,
  };

  const setup = () => {
    projection = d3[`geo${state.type}`]();
    geoGenerator.projection(projection);

    projection
      .scale(state.scale)
      .translate([state.translateX, state.translateY])
      .center([state.centerLon, state.centerLat])
      .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma]);

    const filteredGeometries = geojson.objects.countries.geometries.filter(
      (country) => country.id !== '010'
    );
    const filteredCountries = { ...geojson.objects.countries, geometries: filteredGeometries };

    // Update world map
    const u = d3
      .select('g.map')
      .selectAll('path')
      .data(topojson.feature(geojson, filteredCountries).features)
      .enter()
      .append('path')
      .attr('data-iso', (d) => d.id);

    u.enter().append('path').merge(u).attr('d', geoGenerator);

    const groupDead = d3.select('g.dead');
    blasphemes.forEach((blasphem) => {
      const country = countries.filter((c) => c['ISO3166-1-Alpha-3'] === blasphem.iso);
      if (country && country[0]) {
        const path = d3.select(`g.map path[data-iso="${country[0]['ISO3166-1-numeric']}"]`);
        if (path) {
          path.attr('class', getClassName(blasphem));

          const node = path.node();
          if (node && blasphem.mort === 'oui') {
            const { x, y, width, height } = node.getBBox();
            groupDead
              .append('svg')
              .attr('class', 'deadPicto')
              .append('path')
              .attr(
                'd',
                'M24.869 -17.798 L17.798 -24.869 L0 -7.071 L-17.797 -24.869 L-24.869 -17.798 L-7.071 0 L-24.869 17.798 L-17.798 24.869 L0 7.071 L17.798 24.869 L24.869 17.798 L7.071 0Z'
              )
              .attr('transform', `translate(${x + width / 2}, ${y + height / 2}) scale(0.15)`);
          }
        }
      }
    });

    document
      .querySelector('.map')
      .querySelectorAll('path')
      .forEach((countryPath) => {
        const isoAlpha = countryPath.getAttribute('data-iso');
        const countryData = countries.filter((d) => d['ISO3166-1-numeric'] === isoAlpha);
        if (countryData && countryData[0]) {
          const religion = religions.filter((r) => r.name === countryData[0]['ISO3166-1-Alpha-3']);
          if (religion && religion[0]) {
            const data = {};
            Object.keys(RELIGION_INFOS).forEach((key) => {
              const stringPercent = religion[0][key];
              if (stringPercent !== '0') {
                const percent = parseFloat(stringPercent, 10);
                data[key] = percent;
              }
            });
            if (Object.keys(data).length > 0) {
              data.fr = countryData[0].official_name_fr;
              countryPath.setAttribute('data-data', JSON.stringify(data));
            }
          }
        }
      });

    let css = `#infos svg circle{\nstroke-dashoffset: ${PATH_LENGTH};\nstroke-dasharray: ${PATH_LENGTH}; }\n`;
    let html = '';
    let svgStr = '';
    Object.keys(RELIGION_INFOS).forEach((key) => {
      const { fr, color } = RELIGION_INFOS[key];
      html += `<p class="${key}"><span class="legendBloc"></span><span class="legendText">${fr}</span>
    </p>`;
      css += ` circle.${key} { stroke: ${color}; }\n
      .${key} .legendBloc { background-color: ${color}; }\n`;
      svgStr += `<circle cx="10" cy="10" r="7" class="${key}"></circle>`;
    });

    const style = document.createElement('style');
    style.innerHTML = css;
    document.body.appendChild(style);
    document.querySelector('#legend').innerHTML = html;
    document.querySelector('#infos').querySelector('svg').innerHTML = svgStr;
  };
  setup();
};
