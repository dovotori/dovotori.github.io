import Vec3 from '../maths/Vec3';
import Node from './Node';
import { random } from '../utils/numbers';

const MAX_SPEED = 2;
const MAX_STRENGTH = 0.2;
const MASS = 1;
const RADIUS_SLOWDOWN = 100;
const RADIUS_SEPERATE = Node.taille * 2;
const DISTANCE_ALIGN = 50;
const DISTANCE_COHESION = 100;

export default class extends Node {
  constructor() {
    super();
    this.acceleration = new Vec3(0, 0, 0);
    const angle = random(0, Math.PI);
    this.vitesse.set(Math.cos(angle), Math.sin(angle), Math.tan(angle));
  }

  seek = (cible) => {
    // ATTIRER PAR LA CIBLE
    let direction = cible.minus(this.position);
    direction = direction.multiplyNumber(MAX_SPEED);
    direction.normalise();
    return direction;
  };

  seekSteering = (cible) => {
    // ATTIRER PAR LA CIBLE AVEC UN SMOOTH DE TRAJECTOIRE
    const directionDesiree = this.seek(cible);
    let direction = directionDesiree.minus(this.vitesse);
    direction.limiter(MAX_STRENGTH); // ou tronquer
    // la masse influe le temps pour changer de direction, plus grand plus long
    direction = direction.divideNumber(MASS);
    direction = direction.add(this.vitesse);
    direction.limiter(MAX_SPEED);
    return direction;
  };

  seekSteeringArrival = (cible) => {
    // STEERING AVEC UN RALENTISSEMENT A L'ARRIVEE
    let directionDesiree = cible.minus(this.position);
    const distance = directionDesiree.longueur();

    if (distance < RADIUS_SLOWDOWN) {
      directionDesiree.normalise();
      const ralentissement = MAX_SPEED * (distance / RADIUS_SLOWDOWN);
      directionDesiree = directionDesiree.multiplyNumber(ralentissement);
    } else {
      directionDesiree = directionDesiree.multiplyNumber(MAX_SPEED);
      directionDesiree.normalise();
    }

    let direction = directionDesiree.minus(this.vitesse);
    direction.limiter(MAX_STRENGTH);
    direction = direction.add(this.vitesse);
    return direction;
  };

  flee = (cible) => {
    // FUIT LA CIBLE
    let direction = this.seek(cible);
    direction = direction.multiplyNumber(-1); // on inverse par rapport a seek
    return direction;
  };

  fleeSteering = (cible) => {
    // FUIT LA CIBLE EN STEERING
    let direction = this.seekSteering(cible);
    direction = direction.multiplyNumber(-1); // on inverse par rapport a seek
    return direction;
  };

  // /////////////////////////////////////////////////////////////////////////
  // //////////////////////// GROUPE MOUV ///////////////////////////////////
  // /////////////////////////////////////////////////////////////////////////

  updateTroupeau = (oiseaux) => {
    this.defineAcceleration(oiseaux);
    this.vitesse = this.vitesse.add(this.acceleration); // on ajoute l'acceleration a la vitesse
    this.vitesse.limiter(MAX_SPEED); // on limite la vitesse
    this.position = this.position.add(this.vitesse); // on ajoute la vitesse a la position

    this.acceleration.set(0, 0, 0); // reset de l'acceleration
  };

  defineAcceleration = (oiseaux) => {
    // SEPARATION espace les oiseaux
    let forceSeparation = new Vec3(0, 0, 0);
    let cptSeparation = 0;

    // ALIGNEMENT dirige vers une direction commune
    let forceAlignement = new Vec3(0, 0, 0);
    let cptAlignement = 0;

    // COHESION crée un groupe uni d'ioseaux
    let forceCohesion = new Vec3(0, 0, 0);
    let cptCohesion = 0;

    // ///////////////////// BOUCLE VOISINS ///////////////////////
    for (let i = 0; i < oiseaux.length; i++) {
      const distance = this.position.distance(oiseaux[i].getPosition());

      if (distance > 0) {
        // exclue soit meme
        // SEPARATION
        if (distance < RADIUS_SEPERATE) {
          let ajoutForce = this.position.minus(oiseaux[i].getPosition());
          ajoutForce.normalise();
          // plus le voisin est loin moins la force est importante
          ajoutForce = ajoutForce.divideNumber(distance);
          forceSeparation = forceSeparation.add(ajoutForce);
          cptSeparation++;
        }

        // ALIGNEMENT
        if (distance < DISTANCE_ALIGN) {
          forceAlignement = forceAlignement.add(oiseaux[i].getVitesse());
          cptAlignement++;
        }

        // COHESION
        if (distance < DISTANCE_COHESION) {
          forceCohesion = forceCohesion.add(oiseaux[i].getPosition());
          cptCohesion++;
        }
      }
    }

    // ///////////////////// DEFINITION DES FORCES ///////////////////////

    // SEPARATION
    if (cptSeparation > 0) {
      // divise par le nombre de voisin
      forceSeparation = forceSeparation.divideNumber(cptSeparation);
    }

    if (forceSeparation.longueur() > 0) {
      forceSeparation.normalise();
      forceSeparation = forceSeparation.multiplyNumber(MAX_SPEED);

      // steer
      forceSeparation = forceSeparation.minus(this.vitesse);
      forceSeparation.limiter(MAX_STRENGTH);
    }

    // ALIGNEMENT
    if (cptAlignement > 0) {
      // divise par le nombre de voisin
      forceAlignement = forceAlignement.divideNumber(cptAlignement);
      forceAlignement.normalise();
      forceAlignement = forceAlignement.multiplyNumber(MAX_SPEED);

      // steer
      forceAlignement = forceAlignement.minus(this.vitesse);
      forceAlignement.limiter(MAX_STRENGTH);
    }

    // COHESION
    if (cptCohesion > 0) {
      forceCohesion = forceCohesion.divideNumber(cptCohesion);
      forceCohesion = this.seekSteering(forceCohesion);
    }

    // ///////////////////// ON APPLIQUE ///////////////////////

    // gerer les influences arbitrairement
    forceSeparation = forceSeparation.multiplyNumber(1.5);

    // appliquer la masse
    let forces = new Vec3();
    forces = forces.add(forceSeparation);
    forces = forces.add(forceAlignement);
    forces = forces.add(forceCohesion);
    forces = forces.divideNumber(MASS);

    // on forme l'acceleration
    this.acceleration = this.acceleration.add(forces);
  };
}
