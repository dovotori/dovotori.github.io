class WebWorker {
  constructor(worker) {
    this.worker = worker;
    this.onMessage = null;
    this.worker.addEventListener("error", WebWorker.onError);
  }

  static onError(err) {
    console.error(`${err.filename}, line ${err.lineno}: ${err.message}`);
  }

  setMessageListener(onMessage) {
    this.onMessage = onMessage;
    this.worker.addEventListener("message", this.onMessage);
  }

  postMessage(payload) {
    this.worker.postMessage(payload);
  }

  destroy() {
    if (this.worker) {
      if (this.onMessage) {
        this.worker.removeEventListener("message", this.onMessage);
      }
      this.worker.removeEventListener("error", WebWorker.onError);
      this.worker.terminate();
    }
  }
}

export default WebWorker;
