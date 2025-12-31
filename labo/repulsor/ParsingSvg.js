export function ParsingSvg() {
  this.subpaths = [];
  this.isLoaded = false;
}

ParsingSvg.prototype.setup = function (svg) {
  const paths = svg.getElementsByTagName("path");
  this.isLoaded = false;
  this.subpaths = [];

  for (let i = 0; i < paths.length; i++) {
    let string = paths[i].getAttribute("d");

    // ORDRE DES LETTRES DE DESSIN
    const ordre = [];
    let cpt = 0;
    for (let j = 0; j < string.length; j++) {
      const caractere = string.charAt(j);
      if (caractere.search(/[mMAaLlCcSsQqVvHhTZz]/g) === 0) {
        ordre[cpt] = caractere;
        cpt++;
      }
    }

    // NETTOYAGE
    string = string.replace(/[mMAaLlCcsSsQqVvHhTZz]/g, "*");
    const partiesTmp = string.split("*");
    const partiesPropres = [];
    for (let j = 1; j < partiesTmp.length; j++) {
      partiesTmp[j] = partiesTmp[j].replace(/,/g, " ");
      partiesTmp[j] = partiesTmp[j].replace(/-/g, " -");
      partiesPropres[j - 1] = [];
      const coordonnees = partiesTmp[j].split(" ");
      cpt = 0;
      for (let k = 0; k < coordonnees.length; k++) {
        if (coordonnees[k].length > 0) {
          partiesPropres[j - 1][cpt] = parseFloat(coordonnees[k]);
          cpt++;
        }
      }
    }

    // GROUP BY SUBPATH (M/m)
    let currentSubpath = [];
    let lastAbsX = 0,
      lastAbsY = 0;
    let cptPoints = 0;
    for (let j = 0; j < ordre.length; j++) {
      let multipleDe = 0;
      let isRelatif = false;
      let isH = false,
        isV = false,
        isZ = false;
      switch (ordre[j]) {
        case "M":
          isRelatif = false;
          multipleDe = 2;
          break;
        case "m":
          isRelatif = true;
          multipleDe = 2;
          break;
        case "L":
          isRelatif = false;
          multipleDe = 2;
          break;
        case "l":
          isRelatif = true;
          multipleDe = 2;
          break;
        case "H":
          isRelatif = false;
          multipleDe = 1;
          isH = true;
          break;
        case "h":
          isRelatif = true;
          multipleDe = 1;
          isH = true;
          break;
        case "V":
          isRelatif = false;
          multipleDe = 1;
          isV = true;
          break;
        case "v":
          isRelatif = true;
          multipleDe = 1;
          isV = true;
          break;
        case "S":
          isRelatif = false;
          multipleDe = 4;
          break;
        case "s":
          isRelatif = true;
          multipleDe = 4;
          break;
        case "C":
          isRelatif = false;
          multipleDe = 6;
          break;
        case "c":
          isRelatif = true;
          multipleDe = 6;
          break;
        case "Z":
        case "z":
          isZ = true;
          break;
      }
      const coors = partiesPropres[j];
      if (isZ) {
        // Close path: connect to first point of current subpath
        if (currentSubpath.length > 0) {
          currentSubpath.push([...currentSubpath[0]]);
        }
        continue;
      }
      if (isH) {
        if (!coors || coors.length < multipleDe) continue;
        for (let k = 0; k < coors.length; k += multipleDe) {
          let x;
          if (!isRelatif) {
            x = coors[k];
          } else {
            x = lastAbsX + coors[k];
          }
          lastAbsX = x;
          // y stays the same
          const y = lastAbsY;
          currentSubpath.push([x, y]);
          cptPoints += 2;
        }
        continue;
      }
      if (isV) {
        if (!coors || coors.length < multipleDe) continue;
        for (let k = 0; k < coors.length; k += multipleDe) {
          let y;
          if (!isRelatif) {
            y = coors[k];
          } else {
            y = lastAbsY + coors[k];
          }
          lastAbsY = y;
          // x stays the same
          const x = lastAbsX;
          currentSubpath.push([x, y]);
          cptPoints += 2;
        }
        continue;
      }
      if (!coors || coors.length < multipleDe || multipleDe === 0) continue;
      for (let k = 0; k <= coors.length - multipleDe; k += multipleDe) {
        let x, y;
        if (!isRelatif || cptPoints < 2) {
          x = coors[k + multipleDe - 2];
          y = coors[k + multipleDe - 1];
        } else {
          x = lastAbsX + coors[k + multipleDe - 2];
          y = lastAbsY + coors[k + multipleDe - 1];
        }
        lastAbsX = x;
        lastAbsY = y;
        // Only start a new subpath on M/m
        if (ordre[j] === "M" || ordre[j] === "m") {
          if (currentSubpath.length > 0) {
            this.subpaths.push(currentSubpath);
          }
          currentSubpath = [];
        }
        currentSubpath.push([x, y]);
        cptPoints += 2;
      }
    }
    if (currentSubpath.length > 0) {
      this.subpaths.push(currentSubpath);
    }
  }
  this.isLoaded = true;
};

ParsingSvg.prototype.getPoints = function () {
  // Returns an array of subpaths, each subpath is an array of [x, y] points
  return this.subpaths;
};
ParsingSvg.prototype.isReady = function () {
  return this.isLoaded;
};
