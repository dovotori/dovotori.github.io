export default class {
  constructor(states, callback = null) {
    this.states = states
    this.step = 0
    this.oldStep = this.step
    this.nbSteps = 1
    this.timeout = this.states.time
    this.lastFrame = null
    this.sprite = {
      uv: {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      },
      size: { w: 1, h: 1 },
    }
    this.uv = null
    this.iteration = null
    this.nextState = null
    this.currentState = null
    this.callbackEndOfAnimation = callback
    this.scale = 1
  }

  reset = () => {
    this.sprite = {
      uv: {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      },
      size: { w: 1, h: 1 },
    }
    this.step = 0
  }

  set(state) {
    if (state !== undefined && this.currentState !== state) {
      this.currentState = state
      this.reload(state)
    }
  }

  reload(state) {
    const data = this.states[state]
    this.uv = data.uv
    this.setUV(0)
    this.nbSteps = this.uv.length
    if (this.nbSteps === 1) {
      this.lastFrame = null
    } else {
      this.step = 0
      this.timeout = this.uv[this.step].t || this.states.time || 100
      this.iteration = data.iteration || null
      this.nextState = data.next
      this.lastFrame = new Date().getTime()
    }
  }

  update() {
    this.oldStep = this.step
    if (this.lastFrame !== null) {
      const now = new Date().getTime()
      const milli = now - this.lastFrame
      if (milli > this.timeout) {
        if (this.step < this.nbSteps - 1) {
          this.nexStep()
        } else {
          this.endOfLoop()
        }
        this.setUV(this.step)
        this.lastFrame = now
      }
    }
  }

  nexStep() {
    this.step += 1
    this.timeout = this.uv[this.step].t || this.states.time || 100
  }

  endOfLoop() {
    if (this.iteration === 1) {
      if (this.callbackEndOfAnimation) {
        this.callbackEndOfAnimation(this.currentState, this.nextState)
      }
      if (this.nextState !== null || this.nextState !== undefined) {
        this.set(this.nextState)
      } else {
        this.lastFrame = null
      }
    } else {
      this.step = 0
    }
  }

  get() {
    return {
      x: this.sprite.uv.x,
      y: this.sprite.uv.y,
      texW: this.states.size.w,
      texH: this.states.size.h,
      w: this.sprite.uv.w,
      h: this.sprite.uv.h,
      px: this.sprite.uv.px || -1,
      py: this.sprite.uv.py || -1,
      refSize: this.states.refSize,
    }
  }

  setUV(step) {
    this.sprite.uv = {
      x: this.uv[step].x || 0,
      y: this.uv[step].y || 0,
      w: this.uv[step].w || 1,
      h: this.uv[step].h || 1,
      px: this.uv[step].px,
      py: this.uv[step].py,
    }
  }

  getStatus() {
    return this.currentState
  }

  getStep() {
    return this.step
  }

  isNewStep() {
    return this.step !== this.oldStep
  }

  getRelSize() {
    const { refSize } = this.states
    const { uv } = this.sprite
    let w = uv.w / refSize
    let h = uv.h / refSize
    let px = uv.px !== undefined ? -(uv.px / refSize) : null
    let py = uv.py !== undefined ? -(uv.py / refSize) : null

    w *= this.scale
    h *= this.scale
    px = px !== null ? px * this.scale : null
    py = py !== null ? py * this.scale : null
    return {
      w,
      h,
      px,
      py,
    }
  }

  setScale(value) {
    this.scale = value
  }

  getScale() {
    return this.scale
  }

  getState() {
    return this.currentState
  }
}
