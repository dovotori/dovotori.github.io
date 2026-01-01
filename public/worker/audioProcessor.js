class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      // Handling data from the node.
      console.log(event.data);
    };

    this.port.postMessage("Hi!");
  }

  process(_inputs, _outputs, _parameters) {
    // audio processing code here.
    return true;
  }
}

registerProcessor("deform-worklet-processor", AudioProcessor);
