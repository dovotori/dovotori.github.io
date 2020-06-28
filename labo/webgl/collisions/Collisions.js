import CollisionSweepPrune from './CollisionSweepPrune';

class Collisions {
  static isCollide = (pair, id1, id2) => {
    if (pair[0] === id1 && pair[1] === id2) {
      return pair;
    }
    if (pair[0] === id2 && pair[1] === id1) {
      return [pair[1], pair[0]];
    }
    return null;
  };

  static isCollideGroup = (pair, id1, groupId) => {
    if (pair[0] === id1 && pair[1].indexOf(groupId) !== -1) {
      return pair;
    }
    if (pair[0].indexOf(groupId) !== -1 && pair[1] === id1) {
      return [pair[1], pair[0]];
    }
    return null;
  };

  constructor(boxes) {
    this.collision = new CollisionSweepPrune();
    this.collision.addBoxes(boxes);
  }

  update(heros, monster, bullets) {
    this.collision.getPaires().forEach((pair) => {
      if (Collisions.isCollide(pair, 'heros', 'monster')) {
        heros.addToSpeed(monster.getX() < heros.getX() ? 1 : -1);
      } else {
        const newPair = Collisions.isCollideGroup(pair, 'monster', 'bullet');
        if (newPair) {
          monster.addToSpeed(monster.getX() < heros.getX() ? -1 : 1);
          this.collision.removeBox(newPair[1]);
          bullets.removeOne(newPair[1]);
        }
      }
    });
  }

  addBoxes = (boxes) => {
    this.collision.addBoxes(boxes);
  };

  removeBox = (id) => {
    this.collision.removeBox(id);
  };
}

export default Collisions;
