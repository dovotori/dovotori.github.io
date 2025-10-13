import Audio from '../../utils/io/Audio';

export default class {
  constructor(audios) {
    this.audios = {};

    Object.keys(audios).forEach((name) => {
      this.audios[name] = new Audio(audios[name]);
    });
  }

  get(id) {
    return this.audios[id];
  }
}
