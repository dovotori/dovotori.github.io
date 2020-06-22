export default class {
  constructor(domItem, button) {
    this.domItem = domItem;
    this.button = button;
    this.isFullscreen = false;
    this.support = !!(document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen);

    if (this.button) {
      this.button.addEventListener('click', this.toggle, false);
    }
  }

  enter = () => {
    if (this.support) {
      if (this.domItem.requestFullscreen) {
        this.domItem.requestFullscreen();
      } else if (this.domItem.msRequestFullscreen) {
        this.domItem.msRequestFullscreen();
      } else if (this.domItem.mozRequestFullScreen) {
        this.domItem.mozRequestFullScreen();
      } else if (this.domItem.webkitRequestFullscreen) {
        this.domItem.webkitRequestFullscreen();
      }
      this.domItem.setAttribute("data-fullscreen", true);
      this.isFullscreen = true;
    }
  }

  exit = () => {
    if (this.support) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.domItem.removeAttribute("data-fullscreen");
      this.isFullscreen = false;
    }
  }

  toggle = () => {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter();
    }
  };

  destroy() {
    if (this.button) {
      this.button.removeEventListener('click', this.toggle, false);
    }
  }

  get() {
    return this.isFullscreen;
  }

  getSupport() {
    return this.support;
  }
}
