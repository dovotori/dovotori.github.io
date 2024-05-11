import CollisionSweepPrune from './CollisionSweepPrune'

class Collisions {
  constructor(boxes) {
    this.collision = new CollisionSweepPrune()
    this.collision.addBoxes(boxes)
  }

  get() {
    return this.collision.getPaires().reduce((acc, pair) => {
      let type = 'SIMPLE'
      pair.sort()
      let on = pair[0]
      let from = pair[1]
      let bulletId = null

      const onIsBullet = on.indexOf('bullet') !== -1
      const fromIsBullet = from.indexOf('bullet') !== -1
      if (onIsBullet && fromIsBullet) {
        // 2 bullets we cancel collision
        return acc
      }

      if (onIsBullet) {
        type = 'SHOOT'
        bulletId = on
        const newFrom = on.split('-')[0]
        on = from
        from = newFrom
      } else if (fromIsBullet) {
        type = 'SHOOT'
        bulletId = from
        ;[from] = from.split('-')
      }
      if (type === 'SHOOT' && on === from) {
        // friendly bullet, we cancel collision
        return acc
      }

      return [...acc, { type, from, on, bulletId }]
    }, [])
  }

  addBoxes = (boxes) => {
    this.collision.addBoxes(boxes)
  }

  clear = () => {
    this.collision.clear()
  }

  removeBox = (id) => {
    this.collision.removeBox(id)
  }
}

export default Collisions
