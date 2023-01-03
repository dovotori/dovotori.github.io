export default class {
  constructor() {
    this.div = document.querySelector("#splash");
    this.instructions = this.div && this.div.querySelector("#instructions");
    this.title = this.div && this.div.querySelector("#title");
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

  showRestart = () => {
    if (this.instructions) {
      this.title.innerHTML = "G a m e O v e r";
      this.instructions.innerHTML = "Pressed Enter to restart";
    }
    this.show();
  };

  showVictory = () => {
    if (this.instructions) {
      this.title.innerHTML = "V i c t o r y";
      this.instructions.innerHTML = "";
    }
    this.show();
  };

  showPause() {
    if (this.title) {
      this.title.innerHTML = "T h e G a m e";
    }
    this.show();
  }

  showReady = () => {
    if (this.instructions) {
      if (this.instructions) this.instructions.style.display = "block";
    }
  };
}
