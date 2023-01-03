import io from "socket.io-client";

export default class {
  constructor() {
    // const options = {
    //   path: '/test/socket.io',
    //   transports: ['websocket'],
    //   forceNew: true,
    // };
    // const url = 'https://dovotori-test.herokuapp.com';
    this.socket = null;
  }

  create = () =>
    new Promise((resolve, reject) => {
      const url = "http://localhost:8083";

      this.socket = io(url);
      console.log("socket connect");
      // const socket = io();
      this.socket.on("connect_error", (e) => {
        this.socket.disconnect();
        reject(e);
      });

      this.socket.on("connect", () => {
        resolve(this);
      });
    });

  on = (...args) => this.socket.on(...args);

  emit = (...args) => this.socket.emit(...args);

  reconnect = () => {
    this.close();
    return new Promise((resolve, reject) => {
      this.socket.connect();
      console.log("socket connect");

      this.socket.on("connect_error", (e) => {
        this.socket.close();
        reject(e);
      });

      this.socket.on("connect", () => {
        resolve(this);
      });
    });
  };

  close = () => {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  };

  isConnected = () => this.socket.connected;
}
