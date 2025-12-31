export function ParsingSvg() {
  this.points;
  this.isLoaded;
}

ParsingSvg.prototype.setup = function (svg) {
  const paths = svg.getElementsByTagName("path");

  this.isLoaded = false;
  this.points = [];
  let cptPoints = 0;

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

    //////////////////////// NETTOYAGE

    // RECUPERER LES GROUPES DE COORDONNEES
    string = string.replace(/[mMAaLlCcsSsQqVvHhTZz]/g, "*");
    const partiesTmp = string.split("*");
    const partiesPropres = [];

    for (let j = 1; j < partiesTmp.length; j++) {
      // j=1 pour eviter la premiere partie vide

      // ON PASSE EN MODE X espace Y espace
      partiesTmp[j] = partiesTmp[j].replace(/,/g, " ");
      partiesTmp[j] = partiesTmp[j].replace(/-/g, " -");

      // ON RETIRE LES COORDONNES VIDES
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

    //////////////////////// FIN DU NETTOYAGE

    // ON A PARTIES PROPRES ET ORDRE

    for (let j = 0; j < ordre.length; j++) {
      let multipleDe = 0;
      let isRelatif = false;

      switch (ordre[j]) {
        case "M":
        case "L":
          isRelatif = false;
          multipleDe = 2;
          break; // x,y
        case "m":
        case "l":
          isRelatif = true;
          multipleDe = 2;
          break;
        case "S":
          isRelatif = false;
          multipleDe = 4;
          break; // cx1,cy1 x,y
        case "s":
          isRelatif = true;
          multipleDe = 4;
          break;
        case "C":
          isRelatif = false;
          multipleDe = 6;
          break; // cx1,cy1 cx2,cy2 x,y
        case "c":
          isRelatif = true;
          multipleDe = 6;
          break;
      }

      const coors = partiesPropres[j];
      for (let k = 0; k < coors.length; k++) {
        if (k % multipleDe === multipleDe - 1 || k % multipleDe === multipleDe - 2) {
          if (!isRelatif || cptPoints < 2) {
            this.points[cptPoints] = coors[k];
          } else {
            this.points[cptPoints] = this.points[cptPoints - 2] + coors[k];
          }
          cptPoints++;
        }
      }
    }
  }

  this.isLoaded = true;
};

ParsingSvg.prototype.getPoints = function () {
  return this.points;
};
ParsingSvg.prototype.isReady = function () {
  return this.isLoaded;
};
