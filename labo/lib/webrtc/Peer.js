import Peer from "simple-peer";

export default class {
  constructor() {
    this.isInitiator = null;
    this.isConnected = false;
    this.peer = null;
    this.stream = null;
    this.answer = null;
    this.offer = null;
    this.ask = null;
    this.isCreated = false;
  }

  tryToCreate() {
    if (!this.isCreated && this.isInitiator !== null) {
      if (this.isInitiator) {
        this.create();
      } else if (!this.isInitiator && this.offer) {
        this.create();
      }
    }
  }

  create() {
    this.peer = new Peer({
      initiator: this.isInitiator,
      trickle: false,
      stream: this.stream,
      // offerConstraints: {
      //   offerToReceiveVideo: true,
      //   offerToReceiveAudio: false,
      // },
    });

    console.log("create peer", this.isInitiator);

    this.peer.on("error", (error) => console.log(error));

    this.peer.on("signal", (data) => {
      console.log("peer on signal", data);
      if (!this.isConnected) {
        if (this.isInitiator && data.type && data.type === "offer") {
          this.ask("question offer", data);
        } else if (!this.isInitiator && data.type && data.type === "answer") {
          this.ask("question answer", data);
        }
      }
    });

    this.peer.on("stream", (mediaStream) => {
      console.log("stream emitter");
      // got remote video stream, now let's show it in a video tag
      const video = document.querySelector("#emitter");
      video.srcObject = mediaStream;
      video.play();
    });

    this.peer.on("connect", () => {
      console.log("peer connected");
      this.isConnected = true;
    });

    if (!this.isInitiator) {
      this.setSignal(this.offer);
    }
    this.isCreated = true;
  }

  setSignal = (signalData) => {
    this.peer.signal(signalData);
  };

  setAsk = (ask) => {
    this.ask = ask;
  };

  setStream = (stream) => {
    this.stream = stream;
    if (this.isCreated) {
      this.peer.addStream(this.stream);
    }
  };

  setAnswer = (answer) => {
    this.answer = answer;
    if (this.isInitiator && this.isCreated) {
      this.peer.signal(this.answer);
    }
  };

  setOffer = (offer) => {
    this.offer = offer;
    this.tryToCreate();
  };

  setIsInitiator = (value) => {
    console.log("set initiator", value);
    this.isInitiator = value;
    this.tryToCreate();
  };

  getIsInitiator() {
    return this.isInitiator;
  }
}
