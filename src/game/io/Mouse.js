import { mapFromRange } from '../utils/numbers';

class Mouse {
  constructor(
    div,
    {
      callbackDrag, callbackDown, callbackMove, callbackWheel,
    },
  ) {
    this.div = div;
    this.callbackDrag = callbackDrag || null;
    this.callbackDown = callbackDown || null;
    this.callbackMove = callbackMove || null;
    this.callbackWheel = callbackWheel || null;
    this.isDragging = false;
    this.startDraggingMousePos = { x: 0, y: 0 };
    this.oldPos = { x: 0, y: 0 };

    this.setup();
  }

  setup() {
    if (this.callbackDrag || this.callbackMove) {
      this.div.addEventListener('mousemove', this.onMove, false);
      this.div.addEventListener('touchmove', this.onMove, false);
    }
    if (this.callbackDrag) {
      window.addEventListener('mouseup', this.onUp, false);
      this.div.addEventListener('mousedown', this.onDown, false);
      this.div.addEventListener('touchstart', this.onDown, false);
      this.div.addEventListener('touchend', this.onUp, false);
    }
    if (this.callbackWheel) {
      this.div.addEventListener('wheel', this.onWheel, false);
    }
  }

  cancel() {
    if (this.callbackDrag || this.callbackMove) {
      this.div.removeEventListener('mousemove', this.onMove, false);
      this.div.removeEventListener('touchmove', this.onMove, false);
    }
    if (this.callbackDrag) {
      window.removeEventListener('mouseup', this.onUp, false);
      this.div.removeEventListener('mousedown', this.onDown, false);
      this.div.removeEventListener('touchstart', this.onDown, false);
      this.div.removeEventListener('touchend', this.onUp, false);
    }
    if (this.callbackWheel) {
      this.div.removeEventListener('wheel', this.onWheel, false);
    }
  }

  static getPos(e) {
    return e.touches
      ? {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      : {
        x: e.clientX,
        y: e.clientY,
      };
  }

  computeInfos(e) {
    const pos = Mouse.getPos(e);
    const box = this.div.getBoundingClientRect();
    const x = pos.x - box.x;
    const y = pos.y - box.y;
    return {
      size: box,
      pos: { x, y },
      rel: {
        x: mapFromRange(x, 0, box.width, -1, 1),
        y: mapFromRange(y, 0, box.height, 1, -1),
      },
      relScroll: {
        x: e.pageX - box.left + window.scrollX,
        y: e.pageY - box.top + window.scrollY,
      },
      relDown: {
        x: this.startDraggingMousePos.x - pos.x,
        y: this.startDraggingMousePos.y - pos.y,
      },
      relPrevious: {
        x: this.oldPos.x - pos.x,
        y: this.oldPos.y - pos.y,
      },
    };
  }

  onMove = (e) => {
    const infos = this.computeInfos(e);
    if (this.callbackMove !== null) this.callbackMove(infos);
    if (this.isDragging) {
      if (this.callbackDrag !== null) this.callbackDrag(infos);
      this.oldPos = Mouse.getPos(e);
    }
  };

  onDown = (e) => {
    this.isDragging = true;
    this.startDraggingMousePos = Mouse.getPos(e);
    this.oldPos = Mouse.getPos(e);
    if (this.callbackDown !== null) this.callbackDown(this.computeInfos(e));
  };

  onUp = () => {
    this.isDragging = false;
  };

  onWheel = (e) => {
    e.preventDefault();
    const { deltaY } = e;
    if (this.callbackWheel !== null) this.callbackWheel({ deltaY });
  };

  get() {
    return this.infos;
  }
}

export default Mouse;
