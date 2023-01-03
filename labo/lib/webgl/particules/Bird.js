import Vec3 from "../maths/Vec3";
import Node from "./Node";
import { random } from "../utils/numbers";

const MAX_SPEED = 0.01;
const MAX_STRENGTH = 0.1;
const MASS = 10.0; // la masse influe le temps pour changer de direction, plus grand plus long
const RADIUS_SLOWDOWN = 0.02;
const RADIUS_SEPERATE = 0.1;
const DISTANCE_ALIGN = 0.3;
const DISTANCE_COHESION = 0.5;

export default class extends Node {
  constructor(options = {}) {
    super(options);
    this.acceleration = new Vec3(0, 0, 0);
    const angle = random(0, Math.PI);
    this.speed.set(Math.cos(angle), Math.sin(angle), 0);
  }

  seek = (cible) =>
    // ATTIRER PAR LA CIBLE
    new Vec3()
      .equal(cible)
      .minus(this.position)
      .multiplyNumber(MAX_SPEED)
      .normalise();

  seekSteering = (cible) => {
    // ATTIRER PAR LA CIBLE AVEC UN SMOOTH DE TRAJECTOIRE
    const directionDesiree = this.seek(cible);

    return new Vec3()
      .equal(directionDesiree)
      .minus(this.speed)
      .limiter(MAX_STRENGTH)
      .divideNumber(MASS)
      .add(this.speed)
      .limiter(MAX_SPEED);
  };

  seekSteeringArrival = (cible) => {
    // STEERING AVEC UN RALENTISSEMENT A L'ARRIVEE
    const directionDesiree = new Vec3().equal(cible).minus(this.position);
    const distance = directionDesiree.length();

    if (distance < RADIUS_SLOWDOWN) {
      const ralentissement = MAX_SPEED * (distance / RADIUS_SLOWDOWN);
      directionDesiree.normalise().multiplyNumber(ralentissement);
    } else {
      directionDesiree.normalise().multiplyNumber(MAX_SPEED);
    }

    return new Vec3()
      .equal(directionDesiree)
      .minus(this.speed)
      .limiter(MAX_STRENGTH)
      .add(this.speed);
  };

  flee = (cible) =>
    // FUIT LA CIBLE
    new Vec3().equal(this.seek(cible)).multiplyNumber(-1);

  fleeSteering = (cible) =>
    // FUIT LA CIBLE EN STEERING
    new Vec3().equal(this.seekSteering(cible)).multiplyNumber(-1);

  // //////////////////////// GROUPE MOUV ///////////////////////////////////

  updateMigration = (birds) => {
    this.defineAcceleration(birds);
    this.speed.add(this.acceleration).limiter(MAX_SPEED);
    this.acceleration.set(0, 0, 0); // reset de l'acceleration
  };

  defineAcceleration = (birds) => {
    // SEPARATION espace les oiseaux
    const forceSeparation = new Vec3();
    let cptSeparation = 0;

    // ALIGNEMENT dirige vers une direction commune
    const forceAlignement = new Vec3();
    let cptAlignement = 0;

    // COHESION crée un groupe uni d'oiseaux
    let forceCohesion = new Vec3();
    let cptCohesion = 0;

    birds.forEach((bird) => {
      const distance = this.position.distance(bird.getPosition());

      if (distance > 0) {
        // exclue soit meme
        // SEPARATION
        if (distance < RADIUS_SEPERATE) {
          const ajoutForce = new Vec3()
            .equal(this.position)
            .minus(bird.getPosition());
          ajoutForce.normalise();
          // plus le voisin est loin moins la force est importante
          ajoutForce.divideNumber(distance);
          forceSeparation.add(ajoutForce);
          cptSeparation++;
        }

        // ALIGNEMENT
        if (distance < DISTANCE_ALIGN) {
          forceAlignement.add(bird.getSpeed());
          cptAlignement++;
        }

        // COHESION
        if (distance < DISTANCE_COHESION) {
          forceCohesion.add(bird.getPosition());
          cptCohesion++;
        }
      }
    });

    // ///////////////////// DEFINITION DES FORCES ///////////////////////

    // SEPARATION
    if (cptSeparation > 0) {
      // divise par le nombre de voisin
      forceSeparation.divideNumber(cptSeparation);
    }

    if (forceSeparation.length() > 0) {
      forceSeparation.normalise().multiplyNumber(MAX_SPEED);

      // steer
      forceSeparation.minus(this.speed).limiter(MAX_STRENGTH);
    }

    // ALIGNEMENT
    if (cptAlignement > 0) {
      // divise par le nombre de voisin
      forceAlignement
        .divideNumber(cptAlignement)
        .normalise()
        .multiplyNumber(MAX_SPEED);

      // steer
      forceAlignement.minus(this.speed).limiter(MAX_STRENGTH);
    }

    // COHESION
    if (cptCohesion > 0) {
      forceCohesion.divideNumber(cptCohesion);
      forceCohesion = this.seekSteering(forceCohesion);
    }

    // ///////////////////// ON APPLIQUE ///////////////////////

    // gerer les influences arbitrairement
    forceSeparation.multiplyNumber(1.5);

    // appliquer la masse
    const forces = new Vec3()
      .equal(forceSeparation)
      .add(forceAlignement)
      .add(forceCohesion)
      .divideNumber(MASS);

    // on forme l'acceleration
    this.acceleration = this.acceleration.add(forces);
  };
}
