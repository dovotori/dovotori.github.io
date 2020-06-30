export default class {
  constructor(domItem, button) {
    this.domItem = domItem;
    this.button = button;
    this.isFullscreen = false;
    this.support = !!(
      document.exitFullscreen ||
      document.msExitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen
    );

    if (this.button) {
      this.button.addEventListener('click', this.toggle, false);
    }

    this.listen();
  }

  enter = () => {
    if (this.support) {
      this.isFullscreen = true;
      if (this.domItem.requestFullscreen) {
        this.domItem.requestFullscreen();
      } else if (this.domItem.msRequestFullscreen) {
        this.domItem.msRequestFullscreen();
      } else if (this.domItem.mozRequestFullScreen) {
        this.domItem.mozRequestFullScreen();
      } else if (this.domItem.webkitRequestFullscreen) {
        this.domItem.webkitRequestFullscreen();
      }
    }
  };

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
    }
  };

  listen = () => {
    if (this.support) {
      if (document.exitFullscreen) {
        document.addEventListener('fullscreenchange', this.onChange, false);
      } else if (document.msExitFullscreen) {
        document.addEventListener('MSFullscreenChange', this.onChange, false);
      } else if (document.mozCancelFullScreen) {
        document.addEventListener('mozfullscreenchange', this.onChange, false);
      } else if (document.webkitExitFullscreen) {
        document.addEventListener('webkitfullscreenchange', this.onChange, false);
      }
    }
  };

  onChange = () => {
    if (this.domItem) {
      if (this.isOnFullscreen()) {
        this.domItem.setAttribute('data-fullscreen', true);
        this.isFullscreen = true;
      } else {
        this.domItem.removeAttribute('data-fullscreen');
        this.isFullscreen = false;
      }
    }
  };

  isOnFullscreen = () => {
    return !!document.fullscreenElement;
  };

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

    if (this.support) {
      if (document.exitFullscreen) {
        document.removeEventListener('fullscreenchange', this.onExit, false);
      } else if (document.msExitFullscreen) {
        document.removeEventListener('MSFullscreenChange', this.onExit, false);
      } else if (document.mozCancelFullScreen) {
        document.removeEventListener('mozfullscreenchange', this.onExit, false);
      } else if (document.webkitExitFullscreen) {
        document.removeEventListener('webkitfullscreenchange', this.onExit, false);
      }
    }
  }

  get() {
    return this.isFullscreen;
  }

  getSupport() {
    return this.support;
  }
}
