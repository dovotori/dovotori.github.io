// import AudioNode from './AudioNode';

class Audio {
  constructor(audioArrayBuffer) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.support = !!AudioContext;
    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      this.support = false;
    }

    this.audioData = null;
    this.playbackRate = 1.0;
    this.playMultiple = false;
    this.isPlaying = false;
    this.isPause = true;
    this.isMute = true;
    this.isLoop = true;
    this.volume = 0.5; // 0 - 1

    this.setup(audioArrayBuffer);
  }

  setup(audioArrayBuffer) {
    if (this.support) {
      this.audioContext.decodeAudioData(
        audioArrayBuffer,
        this.saveData,
        this.onError,
      );
      // this.audioContext.addEventListener("statechange", this.onStateChange, false);

      // volume
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.audioContext.destination);

      // analyse
      this.sampleSize = 2048; // power of two / number of samples to collect before analyzing data
      this.javascriptNode = this.audioContext.createScriptProcessor(
        this.sampleSize,
        1,
        1,
      );
      /*
      // anticipate deprecated chrome alert but still unecessery  
      this.audioContext.audioWorklet.addModule('/public/worker/audioProcessor.js').then(() => {
        this.audioNode = new AudioNode(this.audioContext);
        this.audioNode.port.onmessage = (event) => {
          // Handling data from the processor.
          console.log(event.data);
        };
      });
      */
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.minDecibels = -90;
      this.analyserNode.maxDecibels = -30;
      this.analyserNode.fftSize = this.sampleSize;
      this.amplitudeArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    } else {
      console.debug("No audio api support");
    }
  }

  saveData = (audioData) => {
    this.audioData = audioData;
  };

  play() {
    if (this.audioData) {
      if (!this.playMultiple && this.isPlaying) {
        this.stop();
      }

      // sourceNode can't be rewind, need to create new one
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.playbackRate.value = this.playbackRate;
      this.sourceNode.buffer = this.audioData;
      this.sourceNode.loop = this.isLoop;

      this.sourceNode.connect(this.gainNode);

      this.setupAnalyse();

      this.sourceNode.addEventListener("ended", this.stop, false);
      this.sourceNode.start(0);
      this.isPlaying = true;
    }
  }

  togglePause = () => {
    if (!this.isPlaying) {
      this.play();
      this.isPause = false;
    } else if (this.isPause) {
      this.audioContext.resume();
      this.isPause = false;
    } else {
      this.audioContext.suspend();
      this.isPause = true;
    }
  };

  stop = () => {
    this.clearAnalyse();
    if (this.sourceNode) {
      this.sourceNode.removeEventListener("ended", this.stop, false);
      this.sourceNode.disconnect();
      this.sourceNode.stop(0);
    }
    this.isPlaying = false;
  };

  toggle = () => {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  };

  setupAnalyse() {
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.javascriptNode);
    this.javascriptNode.connect(this.audioContext.destination);
    this.javascriptNode.addEventListener("audioprocess", this.onAnalyse, false);
  }

  clearAnalyse = () => {
    this.amplitudeArray.fill(0);
    if (this.javascriptNode) {
      this.analyserNode.disconnect();
      this.javascriptNode.disconnect();
      this.javascriptNode.removeEventListener(
        "audioprocess",
        this.onAnalyse,
        false,
      );
    }
  };

  onAnalyse = () => {
    // this.analyserNode.getByteTimeDomainData(this.amplitudeArray);
    this.analyserNode.getByteFrequencyData(this.amplitudeArray);
  };

  // onStateChange = () => {
  //   console.log(this.audioContext.state);
  // };

  static onError = (e) => {
    console.log("Error load audio", e);
  };

  setPlaybackRate = (value) => {
    this.playbackRate = value;
    if (this.sourceNode) {
      this.sourceNode.playbackRate.value = this.playbackRate;
    }
  };

  setVolume = (value) => {
    this.volume = value;
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  };

  getAmplitudes = () => this.amplitudeArray;

  getFrequencyLength = () => this.analyserNode.frequencyBinCount;

  getSupport() {
    return this.support;
  }

  getIsPlaying = () => this.isPlaying;

  getIsPause = () => this.isPause;
}

export default Audio;
