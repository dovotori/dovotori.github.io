export default class {
  constructor() {
    this.div = document.querySelector('#splash');
  }

  show() {
    if (this.div) {
      this.div.style.opacity = 1;
    }
  }

  hide() {
    if (this.div) {
      this.div.style.opacity = 0;
    }
  }

  showTitle() {
    if (this.div) {
      const title = this.div.querySelector('#title');
      if (title) {
        title.style.opacity = 1;
        title.style.transform = 'none';
      }
    }
  }

  showReady() {
    if (this.div) {
      const intro = this.div.querySelector('#instructions');
      if (intro) intro.style.display = 'block';
    }
  }
}
