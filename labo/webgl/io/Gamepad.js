export default class {
  constructor() {
    window.addEventListener('gamepadconnected', this.onConnect, false);
    window.addEventListener('gamepaddisconnected', this.onDisconnect, false);
  }

  static onConnect(e) {
    console.log(
      'Gamepad connected at index %d: %s. %d buttons, %d axes.',
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    );
  }

  static onDisconnect(e) {
    console.log('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id);
  }

  detroy() {
    window.removeEventListener('gamepadconnected', this.onConnect, false);
    window.removeEventListener('gamepaddisconnected', this.onDisconnect, false);
  }
}
