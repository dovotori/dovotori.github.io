class AudioNode extends AudioWorkletNode {
  constructor(context) {
    super(context, 'deform-worklet-processor');
  }
}

export default AudioNode;