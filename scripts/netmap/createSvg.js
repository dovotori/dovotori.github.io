/* global d3 topojson geojson countries net */
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

const distanceEntrePoints = (point1, point2) => {
  const xs = point2[0] - point1[0];
  const ys = point2[1] - point1[1];
  return Math.sqrt(xs * xs + ys * ys);
};

const getGeoCoord = (latitude, longitude, projection, offsetX, offsetY) => {
  let coor = [0, 0];
  if (latitude !== "#N/A" && longitude !== "#N/A") {
    let lat = parseFloat(latitude.substring(0, latitude.length - 1));
    let sens = latitude.substring(latitude.length - 1, latitude.length);
    if (sens === "S") {
      lat *= -1;
    }

    let long = parseFloat(longitude.substring(0, longitude.length - 1));
    sens = longitude.substring(longitude.length - 1, longitude.length);
    if (sens === "W") {
      long *= -1;
    }
    const coordonneesCapitale = [long, lat];
    coor = projection(coordonneesCapitale);
  }
  return [offsetX + coor[0], offsetY + coor[1]];
};

const getInstitutions = (netDataCsv, countries) =>
  netDataCsv.reduce((acc, cur) => {
    const { institutionsFR, iso, nom, name, capitaleFR, latitudeCapitale, longitudeCapitale } = cur;
    const info = countries.filter((d) => d["ISO3166-1-Alpha-3"] === iso)[0];
    const newCountry = {
      iso,
      nom,
      name,
      capitaleFR,
      latitudeCapitale,
      longitudeCapitale,
      isoAlpha: info["ISO3166-1-numeric"],
    };

    const newCountries = acc[institutionsFR] ? [...acc[institutionsFR], newCountry] : [newCountry];
    return {
      ...acc,
      [institutionsFR]: newCountries,
    };
  }, {});

const main = () => {
  let projection;
  const geoGenerator = d3.geoPath().projection(projection);

  const svg = document.querySelector("#worldmap");
  const viewBoxAttr = svg.getAttribute("viewBox").split(" ");
  const WIDTH = parseFloat(viewBoxAttr[2], 10);
  const HEIGHT = parseFloat(viewBoxAttr[3], 10);
  let OFFSET_X = 0;
  let OFFSET_Y = 0;

  const state = {
    type: "AzimuthalEquidistant",
    scale: 50,
    translateX: WIDTH / 2,
    translateY: HEIGHT / 2,
    centerLon: 0,
    centerLat: 0,
    rotateLambda: 0.1,
    rotatePhi: 0,
    rotateGamma: 0,
  };

  const update = (init = false) => {
    projection = d3[`geo${state.type}`]();
    geoGenerator.projection(projection);
    projection
      .scale(state.scale)
      .translate([state.translateX, state.translateY])
      .center([state.centerLon, state.centerLat])
      .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma]);

    // Update world map
    const u = init
      ? d3
          .select("g.map")
          .selectAll("path")
          .data(topojson.feature(geojson, geojson.objects.countries).features)
          .enter()
          .append("path")
          .attr("data-iso", (d) => d.id)
      : d3
          .select("g.map")
          .selectAll("path")
          .data(topojson.feature(geojson, geojson.objects.countries).features);

    u.enter().append("path").merge(u).attr("d", geoGenerator);

    if (init) {
      // CUSTOM reupdate projection for translate //
      const gCenter = document.querySelector("g.center");
      const gMap = document.querySelector("g.map");
      const box = gMap.getBoundingClientRect();
      const shouldBeX = (WIDTH - box.width) / 2;
      const absX = Math.abs(box.x - shouldBeX);
      const wayX = box.x < shouldBeX ? 1 : -1;
      const shouldBeY = (HEIGHT - box.height) / 2;
      const absY = Math.abs(box.y - shouldBeY);
      const wayY = box.y < shouldBeY ? 1 : -1;
      OFFSET_X = absX * wayX;
      OFFSET_Y = absY * wayY;
      gCenter.setAttribute("transform", `translate(${OFFSET_X}, ${OFFSET_Y})`);
      // END CUSTOM reupdate projection for translate //
    }
  };

  const setup = () => {
    update(true);
    const enemies = net.reduce((acc, cur) => {
      const country = countries.filter((d) => d["ISO3166-1-Alpha-3"] === cur.iso);
      if (country?.[0]) {
        return [
          ...acc,
          {
            isoNum: country[0]["ISO3166-1-numeric"],
            iso3: cur.iso,
          },
        ];
      }
      return acc;
    }, []);
    const map = svg.querySelector(".map");
    enemies.forEach((enemy) => {
      const { isoNum } = enemy;
      const path = map.querySelector(`path[data-iso="${isoNum}"]`);
      if (path) {
        path.setAttribute("class", "enemy");
      }
    });

    const { PI, cos, sin, atan } = Math;
    const institutions = getInstitutions(net, countries);
    const NB_POINTS = Object.keys(institutions).length;
    const RADIUS = 180;
    const enhancedInstitutions = Object.keys(institutions).reduce((acc, cur, index) => {
      const radian = mapFromRange(index, 0, NB_POINTS, 0, 2 * PI);
      const x = cos(radian) * RADIUS;
      const y = sin(radian) * RADIUS;
      return {
        ...acc,
        [cur]: {
          countries: institutions[cur],
          x: WIDTH / 2 + x,
          y: HEIGHT / 2 + y,
          angle: radToDeg(atan(y / x)),
          radian,
        },
      };
    }, {});

    const group = d3.select("g.institutions");

    const LINE_HEIGHT = 12;
    Object.keys(enhancedInstitutions).forEach((cur) => {
      const { x, y, angle } = enhancedInstitutions[cur];
      const reverse = x > WIDTH / 2;
      const textAnchor = reverse ? "start" : "end";
      const textLines = cur.split("_");

      const g = group
        .append("g")
        .attr("transform", `translate(${x},${y}) rotate(${angle})`)
        .attr("text-anchor", textAnchor);

      const LINES_HEIGHT = textLines.length * LINE_HEIGHT;
      g.append("rect")
        .attr("x", reverse ? 0 : -200)
        .attr("y", -LINES_HEIGHT / 2)
        .attr("width", 200)
        .attr("height", LINES_HEIGHT);

      textLines.forEach((text, i) => {
        const lineY =
          LINE_HEIGHT / 2 - ((textLines.length - 1) / 2) * LINE_HEIGHT + i * LINE_HEIGHT;
        g.append("text").attr("x", 0).attr("y", lineY).text(text.replace(/"/gi, ""));
      });
    });

    const groupLine = d3.select("g.lines");
    let cptCss = 0;
    let css = "";
    console.log(enhancedInstitutions);
    Object.keys(enhancedInstitutions).forEach((cur) => {
      const { x, y, radian } = enhancedInstitutions[cur];
      const instiX = x - cos(radian) * 10;
      const instiY = y - sin(radian) * 10;

      enhancedInstitutions[cur].countries.forEach(({ latitudeCapitale, longitudeCapitale }) => {
        const [countryX, countryY] = getGeoCoord(
          latitudeCapitale,
          longitudeCapitale,
          projection,
          OFFSET_X,
          OFFSET_Y
        );

        const length = distanceEntrePoints([countryX, countryY], [instiX, instiY]);
        const tanLength = length * 0.4;
        const tanX = x - cos(radian) * tanLength;
        const tanY = y - sin(radian) * tanLength;
        const tanCountryX = countryX + (countryX > instiX ? -tanLength : tanLength);
        const tanCountryY = countryY + (countryY > instiY ? -tanLength : tanLength);

        let d = `M ${instiX} ${instiY} `;
        d += `C ${tanX} ${tanY} ${tanCountryX} ${tanCountryY} ${countryX} ${countryY}`;
        const line = groupLine.append("path").attr("d", d);

        const pathLength = line.node().getTotalLength();
        let animCss = `{\n`;
        animCss += `stroke-dasharray: ${pathLength};\n`;
        animCss += `stroke-dashoffset: ${pathLength};\n`;
        animCss += `animation-delay: calc(1s + (var(--timing-line) * ${cptCss}));\n}`;
        css += `#worldmap .lines path:nth-child(${cptCss + 1}) ${animCss}\n\n`;
        cptCss++;
      });
    });
    const style = document.createElement("style");
    style.innerHTML = css;
    document.body.appendChild(style);
  };
  setup();
};

main();
