import Vec3 from "../maths/Vec3";
import Node from "./Node";
import { random } from '../utils/numbers';

const MAX_SPEED = 2;
const MAX_STRENGTH = 0.2;
const MASS = 1;
const RADIUS_SLOWDOWN = 100;
const RADIUS_SEPERATE = Node.taille*2;
const DISTANCE_ALIGN = 50;
const DISTANCE_COHESION = 100;

export default class extends Node {
constructor() {
	super();
	this.acceleration = new Vec3(0, 0, 0);
}

setup = (x, y, z)=> {
	super.setup(x, y, z);
	const angle = random(0, Math.PI);
	this.vitesse.set(Math.cos(angle), Math.sin(angle), Math.tan(angle));
	// this.vitesse.set(1, 1, 1);
}

seek = (cible)=> {
  // ATTIRER PAR LA CIBLE
  let direction = cible.moins(this.position);
  direction = direction.multiplierValeur(MAX_SPEED);
  direction.normaliser();
  return direction;
}

seekSteering = (cible)=> {
  // ATTIRER PAR LA CIBLE AVEC UN SMOOTH DE TRAJECTOIRE
  const directionDesiree = this.seek(cible);
  let direction = directionDesiree.moins(this.vitesse); 
  direction.limiter(MAX_STRENGTH); // ou tronquer
	// la masse influe le temps pour changer de direction, plus grand plus long
  direction = direction.diviserValeur(MASS);
  direction = direction.plus(this.vitesse);
  direction.limiter(MAX_SPEED);
  return direction;
}

seekSteeringArrival = (cible)=>{
  // STEERING AVEC UN RALENTISSEMENT A L'ARRIVEE
  let directionDesiree = cible.moins(this.position);
  const distance = directionDesiree.longueur();

  if (distance < RADIUS_SLOWDOWN) 
  {
    directionDesiree.normaliser();
    const ralentissement = MAX_SPEED * (distance / RADIUS_SLOWDOWN);
    directionDesiree = directionDesiree.multiplierValeur(ralentissement); 
  } else {
    directionDesiree = directionDesiree.multiplierValeur(MAX_SPEED);
    directionDesiree.normaliser();
  }

  let direction = directionDesiree.moins(this.vitesse);
  direction.limiter(MAX_STRENGTH);
  direction = direction.plus(this.vitesse);
  return direction;
}




flee = (cible)=> {
  // FUIT LA CIBLE
  let direction = this.seek(cible);
  direction = direction.multiplierValeur(-1); // on inverse par rapport a seek 
  return direction;
}


fleeSteering = (cible)=> {
  // FUIT LA CIBLE EN STEERING
  let direction = this.seekSteering(cible);
  direction = direction.multiplierValeur(-1); // on inverse par rapport a seek 
  return direction;
}

	// /////////////////////////////////////////////////////////////////////////
	// //////////////////////// GROUPE MOUV ///////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////

	updateTroupeau = (oiseaux)=>{
		this.defineAcceleration(oiseaux);
		this.vitesse = this.vitesse.plus(this.acceleration);// on ajoute l'acceleration a la vitesse
		this.vitesse.limiter(MAX_SPEED); 			// on limite la vitesse
		this.position = this.position.plus(this.vitesse); 	// on ajoute la vitesse a la position
		
		this.acceleration.set(0, 0, 0); 					// reset de l'acceleration
	}

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
	for(let i = 0; i < oiseaux.length; i++) {
		const distance = this.position.distance(oiseaux[i].getPosition());

		if(distance > 0) // exclue soit meme
		{
			// SEPARATION
			if(distance < RADIUS_SEPERATE)
			{
				let ajoutForce = this.position.moins(oiseaux[i].getPosition());
				ajoutForce.normaliser();
				// plus le voisin est loin moins la force est importante
				ajoutForce = ajoutForce.diviserValeur(distance); 
				forceSeparation = forceSeparation.plus(ajoutForce);
				cptSeparation++;
			}
		
			// ALIGNEMENT
			if(distance < DISTANCE_ALIGN)
			{
				forceAlignement = forceAlignement.plus(oiseaux[i].getVitesse());
				cptAlignement++;
			}

			// COHESION
			if(distance < DISTANCE_COHESION) 
			{
				forceCohesion = forceCohesion.plus(oiseaux[i].getPosition());
				cptCohesion++;
			}
		
		}
	}

	// ///////////////////// DEFINITION DES FORCES ///////////////////////

	// SEPARATION
	if(cptSeparation > 0) {
		// divise par le nombre de voisin
		forceSeparation = forceSeparation.diviserValeur(cptSeparation); 
	}

	
	if(forceSeparation.longueur() > 0)
	{
		forceSeparation.normaliser();
		forceSeparation = forceSeparation.multiplierValeur(MAX_SPEED);

		// steer
		forceSeparation = forceSeparation.moins(this.vitesse);
		forceSeparation.limiter(MAX_STRENGTH);
	}
	
	// ALIGNEMENT
	if(cptAlignement > 0) {
		// divise par le nombre de voisin
		forceAlignement = forceAlignement.diviserValeur(cptAlignement); 
		forceAlignement.normaliser();
		forceAlignement = forceAlignement.multiplierValeur(MAX_SPEED);

		// steer
		forceAlignement = forceAlignement.moins(this.vitesse);
		forceAlignement.limiter(MAX_STRENGTH);
	}

	// COHESION
	if(cptCohesion > 0) {
		forceCohesion = forceCohesion.diviserValeur(cptCohesion);
		forceCohesion = this.seekSteering(forceCohesion);
	}

	// ///////////////////// ON APPLIQUE ///////////////////////
    
    // gerer les influences arbitrairement
    forceSeparation = forceSeparation.multiplierValeur(1.5);   

    // appliquer la masse
    let forces = new Vec3();
    forces = forces.plus(forceSeparation); 
    forces = forces.plus(forceAlignement); 
    forces = forces.plus(forceCohesion);
    forces = forces.diviserValeur(MASS);

    // on forme l'acceleration
    this.acceleration = this.acceleration.plus(forces); 

}
}
