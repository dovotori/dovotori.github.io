import CollisionEndpoint from './CollisionEndpoint';
import CollisionPairManager from './CollisionPairManager';

class CollisionSweepPrune {
  static addEndpointDecroissant(liste, newMin, newMax) {
    const newListe = liste;
    const e = new CollisionEndpoint();
    e.set(-9999);
    liste.push(e);
    liste.push(e);

    let endpointAplacer = newMin;
    let cptEndpointPlace = 0;

    for (let i = liste.length - 1; i >= 0; i -= 1) {
      const oldListe = liste[i - (2 - cptEndpointPlace)];
      if (oldListe) {
        if (oldListe.get() > endpointAplacer.get()) {
          newListe[i] = endpointAplacer;
          cptEndpointPlace += 1;
          endpointAplacer = newMax;
        } else {
          newListe[i] = oldListe;
        }
      } else {
        // deux derniers
        newListe[i] = endpointAplacer;
        cptEndpointPlace += 1;
        endpointAplacer = newMax;
      }

      // on arete la boucle si plus de points a placer
      if (cptEndpointPlace === 2) {
        break;
      }
    }

    return newListe;
  }

  constructor() {
    this.listeAxe = Array(3); // liste de Endpoint sur l'axe des X
    this.listeAxe[0] = [];
    this.listeAxe[1] = [];
    this.listeAxe[2] = [];
    this.pm = new CollisionPairManager();

    this.cptEndpointPlace = 0;
    this.endpointAplacer = null;
    this.activeList = [];
  }

  setup(boxs) {
    this.addBoxes(boxs);
  }

  addBoxes(boxs) {
    // on crée une liste decroisante des endpoints des nouvelles boites
    let endpointsDecroissantsX = [];
    let endpointsDecroissantsY = [];
    for (let i = 0; i < boxs.length; i += 1) {
      endpointsDecroissantsX = CollisionSweepPrune.addEndpointDecroissant(
        endpointsDecroissantsX,
        boxs[i].getMin(0),
        boxs[i].getMax(0),
      );
      endpointsDecroissantsY = CollisionSweepPrune.addEndpointDecroissant(
        endpointsDecroissantsY,
        boxs[i].getMin(1),
        boxs[i].getMax(1),
      );
    }

    // on ajoute les addpoints aux listes
    let axe = 0;
    this.addEndPointsOnListe(axe, endpointsDecroissantsX);
    axe += 1;
    this.addEndPointsOnListe(axe, endpointsDecroissantsY);
  }

  addEndPointsOnListe(
    axe,
    newEndPoints, // array des new points en sens decroissant
  ) {
    const e = new CollisionEndpoint();
    e.set(9999);
    for (let i = 0; i < newEndPoints.length; i += 1) {
      this.listeAxe[axe].push(e);
    }

    this.cptEndpointPlace = 0;
    this.endpointAplacer = newEndPoints[this.cptEndpointPlace];

    // COLLISION
    this.activeList = [];

    for (let i = this.listeAxe[axe].length - 1; i >= 0; i -= 1) {
      this.loopTri(axe, newEndPoints, i);
      this.loopCheckCollision(axe, i);
    }
  }

  loopTri(axe, newEndPoints, i) {
    if (this.cptEndpointPlace < newEndPoints.length) {
      const oldListe = this.listeAxe[axe][i - (newEndPoints.length - this.cptEndpointPlace)];
      if (oldListe) {
        if (this.endpointAplacer.get() > oldListe.get()) {
          this.listeAxe[axe][i] = this.endpointAplacer;
          this.cptEndpointPlace += 1;
          this.endpointAplacer = newEndPoints[this.cptEndpointPlace];
        } else {
          this.listeAxe[axe][i] = oldListe;
        }
      } else {
        // deux derniers
        this.listeAxe[axe][i] = this.endpointAplacer;
        this.cptEndpointPlace += 1;
        this.endpointAplacer = newEndPoints[this.cptEndpointPlace];
      }
    }
    // on arete la boucle si plus de points a placer
    // if(this.cptEndpointPlace === newEndPoints.length){ break; }
  }

  loopCheckCollision(axe, i) {
    const id = this.listeAxe[axe][i].getID();
    if (!this.listeAxe[axe][i].isMinimum()) {
      // c'est un max
      for (let j = 0; j < this.activeList.length; j += 1) {
        // on reporte la paire comme potentiel collision
        this.pm.addPaireOnAxe([this.activeList[j], id], axe);
      }
      this.activeList.push(id); // on ajoute dans l'active liste
    } else {
      // c'est un min
      for (let j = 0; j < this.activeList.length; j += 1) {
        if (this.activeList[j] === id) {
          this.activeList.splice(j, 1);
          break; // on retire de l'active liste
        }
      }
    }
  }

  update(checkAxeX, checkAxeY, checkAxeZ) {
    this.pm.resetPairesAxes();
    this.activeList = [];
    if (checkAxeX) this.updateAxe(0);
    if (checkAxeY) this.updateAxe(1);
    if (checkAxeZ) this.updateAxe(2);
  }

  updateAxe(axe) {
    this.listeAxe[axe].sort((a, b) => (a.value < b.value ? -1 : 1));
    for (let i = this.listeAxe[0].length - 1; i >= 0; i -= 1) {
      this.loopCheckCollision(axe, i);
    }
  }

  getPaires(checkAxeX = true, checkAxeY = true, checkAxeZ = false) {
    this.update(checkAxeX, checkAxeY, checkAxeZ);
    return this.pm.getPaires(checkAxeX, checkAxeY, checkAxeZ);
  }

  removeBox(id) {
    this.listeAxe = this.listeAxe.map((list) => list.filter((point) => point.ownerId !== id));
  }

  clear() {
    this.listeAxe[0] = [];
    this.listeAxe[1] = [];
    this.listeAxe[2] = [];
  }
}

export default CollisionSweepPrune;
