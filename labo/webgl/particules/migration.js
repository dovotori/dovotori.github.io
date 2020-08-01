import Bird from './Bird';

export default class {
  constructor(count = 10) {
    this.birds = Array(count)
      .fill()
      .map((_) => new Bird({ withRespawn: true }));
  }

  update = () => {
    this.birds.forEach((bird) => {
      bird.updateMigration(this.birds);
      bird.update();
    });
  };

  getPositions = () => {
    return this.birds.reduce((acc, bird) => [...bird.getPosition().get(), ...acc], []);
  };
}
