import { mapFromRange } from "../numbers";

class Mouse {
  constructor(
    div,
    { callbackDrag, callbackDown, callbackUp, callbackMove, callbackWheel, callbackClick },
  ) {
    this.div = div;
    this.callbackDrag = callbackDrag || null;
    this.callbackDown = callbackDown || null;
    this.callbackUp = callbackUp || null;
    this.callbackMove = callbackMove || null;
    this.callbackWheel = callbackWheel || null;
    this.callbackClick = callbackClick || null;
    this.isDragging = false;
    this.startDraggingMousePos = { x: 0, y: 0 };
    this.oldPos = { x: 0, y: 0 };

    this.options = {
      capture: false,
      passive: true,
    };
    this.setup();
  }

  setup() {
    if (this.div) {
      if (this.callbackClick) {
        this.div.addEventListener("click", this.onClick, false);
      }
      if (this.callbackDrag || this.callbackMove) {
        this.div.addEventListener("mousemove", this.onMove, this.options);
        this.div.addEventListener("touchmove", this.onMove, this.options);
      }
      if (this.callbackDrag || this.callbackDown || this.callbackUp) {
        window.addEventListener("mouseup", this.onUp, this.options);
        this.div.addEventListener("mousedown", this.onDown, this.options);
        this.div.addEventListener("touchstart", this.onDown, this.options);
        this.div.addEventListener("touchend", this.onUp, this.options);
      }
      if (this.callbackWheel) {
        this.div.addEventListener("wheel", this.onWheel, this.options);
      }
    }
  }

  cancel() {
    if (this.div) {
      if (this.callbackClick) {
        this.div.removeEventListener("click", this.onClick, false);
      }
      if (this.callbackDrag || this.callbackMove) {
        this.div.removeEventListener("mousemove", this.onMove, this.options);
        this.div.removeEventListener("touchmove", this.onMove, this.options);
      }
      if (this.callbackDrag) {
        window.removeEventListener("mouseup", this.onUp, this.options);
        this.div.removeEventListener("mousedown", this.onDown, this.options);
        this.div.removeEventListener("touchstart", this.onDown, this.options);
        this.div.removeEventListener("touchend", this.onUp, this.options);
      }
      if (this.callbackWheel) {
        this.div.removeEventListener("wheel", this.onWheel, this.options);
      }
    }
  }

  getPos(e) {
    if (e.touches?.length >= 0) {
      return {
        x: e.touches.length === 0 ? this.oldPos.x : e.touches[0].clientX,
        y: e.touches.length === 0 ? this.oldPos.y : e.touches[0].clientY,
      };
    }
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }

  computeInfos(e) {
    const pos = this.getPos(e);
    const box = this.div.getBoundingClientRect();
    const x = pos.x - box.x;
    const y = pos.y - box.y;
    const relPrevious = {
      x: this.oldPos.x - pos.x,
      y: this.oldPos.y - pos.y,
    };
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
      relPrevious,
      speed: Math.max(Math.abs(relPrevious.x), Math.abs(relPrevious.x)),
    };
  }

  onMove = (e) => {
    const infos = this.computeInfos(e);
    this.oldPos = this.getPos(e);
    if (this.callbackMove !== null) this.callbackMove(infos);
    if (this.isDragging) {
      if (this.callbackDrag !== null) this.callbackDrag(infos);
    }
  };

  onDown = (e) => {
    this.isDragging = true;
    this.startDraggingMousePos = this.getPos(e);
    if (this.callbackDown !== null) {
      const infos = this.computeInfos(e);
      this.callbackDown(infos);
    }
    this.oldPos = this.getPos(e);
  };

  onUp = (e) => {
    this.onMove(e);
    this.isDragging = false;
    if (this.callbackUp !== null) {
      const infos = this.computeInfos(e);
      this.callbackUp(infos);
    }
  };

  onWheel = (e) => {
    const { deltaY } = e;
    if (this.callbackWheel !== null) this.callbackWheel({ deltaY });
  };

  onClick = (e) => {
    if (this.callbackClick !== null) this.callbackClick(this.computeInfos(e));
  };

  get() {
    return this.infos;
  }
}

export default Mouse;
