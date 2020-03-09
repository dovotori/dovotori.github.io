class CollisionPairManager {
  static compareListes(liste1, liste2) {
    const tmp = [];
    for (let i = 0; i < liste1.length; i += 1) {
      for (let j = 0; j < liste2.length; j += 1) {
        if (
          (liste1[i][0] === liste2[j][0] && liste1[i][1] === liste2[j][1])
          || (liste1[i][1] === liste2[j][0] && liste1[i][0] === liste2[j][1])
        ) {
          tmp.push([liste1[i][0], liste1[i][1]]);
        }
      }
    }
    return tmp;
  }

  constructor() {
    this.listesAxe = Array(3); // contient les paires qui overlap sur chacun des axes
    this.resetPairesAxes();
  }

  resetPairesAxes() {
    for (let i = 0; i < this.listesAxe.length; i += 1) {
      this.listesAxe[i] = [];
    }
  }

  addPaireOnAxe(paire, axe) {
    let already = false;
    for (let i = 0; i < this.listesAxe[axe].length; i += 1) {
      if (
        (paire[0] === this.listesAxe[axe][i][0]
          && paire[1] === this.listesAxe[axe][i][1])
        || (paire[1] === this.listesAxe[axe][i][0]
          && paire[0] === this.listesAxe[axe][i][1])
      ) {
        already = true;
        break;
      }
    }
    if (!already) {
      this.listesAxe[axe].push(paire);
    }
  }

  getPaires(axeX, axeY, axeZ) {
    let paires = null;
    if (axeX) {
      [paires] = this.listesAxe;
      if (axeY) {
        paires = CollisionPairManager.compareListes(paires, this.listesAxe[1]);
        if (axeZ) {
          paires = CollisionPairManager.compareListes(paires, this.listesAxe[2]);
        }
      }
    }
    return paires;
  }
}

export default CollisionPairManager;
