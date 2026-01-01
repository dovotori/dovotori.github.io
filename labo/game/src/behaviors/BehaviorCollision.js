import Behavior from "./Behavior";

// for collision, remove a little space to check if perso is not yet on next tile
const SPACE_CHECK = 0.000001;

class BehaviorCollision extends Behavior {
  static getNearCollisionPoint(map, points) {
    for (let i = 0; i < points.length; i += 1) {
      if (BehaviorCollision.isCollisionTile(map, points[i].x, points[i].y)) {
        return { x: points[i].x, y: points[i].y };
      }
    }
    return null;
  }

  static isCollisionTile(map, x, y) {
    const pixel = map.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    return (
      pixel.data[0] !== 255 && pixel.data[0] === pixel.data[1] && pixel.data[1] === pixel.data[2]
    );
  }

  // if speed or size to high
  static determineStep(speed, tileSize) {
    let tempValue = speed;
    let step = 1;
    while (Math.abs(tempValue) >= tileSize) {
      tempValue /= 2;
      step += 1;
    }
    return { value: tempValue, step };
  }

  constructor(constants, updateState, tileSize) {
    super(constants, updateState);
    this.isCollision = {
      left: false,
      right: false,
      bottom: false,
      top: false,
    };
    this.testPoints = this.determineTestPoints(tileSize);
  }

  determineTestPoints(tileSize) {
    const { w, h } = this.constants;
    const { value: sizeW, step: stepW } = BehaviorCollision.determineStep(w, tileSize.w);
    const { value: sizeH, step: stepH } = BehaviorCollision.determineStep(h, tileSize.h);

    const bottom = [];
    bottom.push({ x: SPACE_CHECK, y: -SPACE_CHECK }); // first
    // intermediaire
    for (let i = 1; i < stepW; i += 1) {
      bottom.push({ x: sizeW * i, y: -SPACE_CHECK });
    }
    bottom.push({ x: w - SPACE_CHECK, y: -SPACE_CHECK }); // last

    const top = [];
    top.push({ x: SPACE_CHECK, y: h + SPACE_CHECK }); // first
    // intermediaire
    for (let i = 1; i < stepW; i += 1) {
      top.push({ x: sizeW * i, y: h + SPACE_CHECK });
    }
    top.push({ x: w - SPACE_CHECK, y: h + SPACE_CHECK }); // last

    const left = [];
    left.push({ x: -SPACE_CHECK, y: SPACE_CHECK }); // first
    // intermediaire
    for (let i = 1; i < stepH; i += 1) {
      left.push({ x: -SPACE_CHECK, y: sizeH * i });
    }
    left.push({ x: -SPACE_CHECK, y: h - SPACE_CHECK }); // last

    const right = [];
    right.push({ x: w + SPACE_CHECK, y: SPACE_CHECK }); // first
    // intermediaire
    for (let i = 1; i < stepH; i += 1) {
      right.push({ x: w + SPACE_CHECK, y: sizeH * i });
    }
    right.push({ x: w + SPACE_CHECK, y: h - SPACE_CHECK }); // last

    const points = {
      left,
      right,
      bottom,
      top,
    };
    return points;
  }

  update(map, tileSize) {
    const shouldContinue = super.update();
    if (shouldContinue) {
      this.setCollision(map, tileSize);
    }
    return shouldContinue;
  }

  defineNextStatus() {
    super.defineNextStatus();
    const { STAND, RUN } = this.constants.states;
    if (!this.isLock()) {
      if (this.isCollision.bottom) {
        this.status = STAND;
        if (Math.abs(this.speed.getX()) > 0) {
          this.status = RUN;
        }
      }
    }
  }

  setCollision(map, tileSize) {
    Object.keys(this.isCollision).forEach((direction) => {
      this.setDirectionCollision(map, direction, tileSize);
    });

    // reset speed
    if (this.isCollision.top || this.isCollision.bottom) {
      this.speed.setY(0);
    }
    if (this.isCollision.left || this.isCollision.right) {
      this.speed.setX(0);
    }
  }

  setDirectionCollision(map, direction, tileSize) {
    let isMovingOnDirection = false;
    const isAxeX = direction === "left" || direction === "right";
    switch (direction) {
      case "bottom":
        isMovingOnDirection = this.speed.getY() < 0;
        break;
      case "top":
        isMovingOnDirection = this.speed.getY() > 0;
        break;
      case "left":
        isMovingOnDirection = this.speed.getX() < 0;
        break;
      case "right":
        isMovingOnDirection = this.speed.getX() > 0;
        break;
      default:
        break;
    }

    // define test points
    if (!this.isCollision[direction] && isMovingOnDirection) {
      const { value: speed, step } = BehaviorCollision.determineStep(
        isAxeX ? this.speed.getX() : this.speed.getY(),
        isAxeX ? tileSize.w : tileSize.h,
      );
      const points = [];
      const testPoints = this.testPoints[direction];
      for (let i = 0; i <= step; i += 1) {
        for (let j = 0; j < testPoints.length; j += 1) {
          let x = this.position.getX() + testPoints[j].x;
          let y = this.position.getY() + testPoints[j].y;
          if (isAxeX) {
            x += speed * i;
          } else {
            y += speed * i;
          }
          points.push({ x, y });
        }
      }

      // update position
      const collisionPoint = BehaviorCollision.getNearCollisionPoint(map, points);
      if (collisionPoint) {
        // collision
        const { w, h } = this.constants;
        switch (direction) {
          case "bottom":
            this.position.setY(Math.ceil(collisionPoint.y));
            break;
          case "top":
            this.position.setY(Math.floor(collisionPoint.y) - h);
            break;
          case "left":
            this.position.setX(Math.ceil(collisionPoint.x));
            break;
          case "right":
            this.position.setX(Math.floor(collisionPoint.x) - w);
            break;
          default:
            break;
        }
        this.isCollision[direction] = true;
      } else if (isAxeX) {
        // no collision
        this.position.addX(this.speed.getX());
      } else {
        this.position.addY(this.speed.getY());
      }
    } else if (!this.isStillCollide(map, direction)) {
      // check if still collide
      this.isCollision[direction] = false;
    }
  }

  isStillCollide(map, direction) {
    const testPoints = this.testPoints[direction];
    const points = testPoints.map((testPoint) => ({
      x: this.position.getX() + testPoint.x,
      y: this.position.getY() + testPoint.y,
    }));
    return BehaviorCollision.getNearCollisionPoint(map, points) !== null;
  }

  getCollision(direction) {
    return this.isCollision[direction];
  }

  getCollisionAxeX() {
    return this.isCollision.left || this.isCollision.right;
  }
}

export default BehaviorCollision;
