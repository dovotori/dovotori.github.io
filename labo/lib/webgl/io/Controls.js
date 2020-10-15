import Fullscreen from './Fullscreen';

export default class {
  constructor(container, config) {
    this.controlsDomItem = document.createElement('div');
    this.controlsDomItem.id = 'controls';
    this.controlsDomItem.style.opacity = 0;

    const { fullscreen, ranges } = config;
    if (ranges) {
      this.ranges = Object.keys(ranges).reduce((acc, id) => {
        const { min = 0, max = 100, value = 0 } = ranges[id];
        const domRange = document.createElement('input');
        domRange.setAttribute('type', 'range');
        domRange.setAttribute('id', id);
        domRange.setAttribute('min', min);
        domRange.setAttribute('max', max);
        domRange.setAttribute('value', value);
        this.controlsDomItem.appendChild(domRange);
        return { ...acc, [id]: { id, min, max, value, dom: domRange } };
      }, {});
    }

    if (fullscreen) {
      this.fullscreen = new Fullscreen(container);
      this.controlsDomItem.appendChild(this.fullscreen.getButton());
    }
  }

  getDomItem = () => this.controlsDomItem;

  getRanges = () => {
    return this.ranges;
  };

  destroy() {
    if (this.fullscreen) {
      this.fullscreen.destroy();
    }
  }
}
