import 'webrtc-adapter';
import createStream from 'Labo/lib/webrtc/createStream';
import Socket from 'Labo/lib/webrtc/Socket';
import Peer from 'Labo/lib/webrtc/Peer';

import './style.css';

const button = document.querySelector('#btn');
// const status = document.querySelector('#status');

const setupStream = async (peer) => {
  const stream = await createStream();
  if (stream) {
    peer.setStream(stream);
    const video = document.querySelector('#own');
    video.srcObject = stream;
    video.play();
  } else {
    button.innerHTML = "Can't access your webcam. Retry";
  }
};

const setupSocket = async (peer) => {
  const socket = await new Socket();
  const ask = (...args) => socket.emit(...args);
  peer.setAsk(ask);
  socket.on('answer initiator', peer.setIsInitiator);
  socket.on('answer offer', peer.setOffer);
  socket.on('answer answer', peer.setAnswer);
  socket.emit('question initiator');
  return socket;
};

export default () => {
  let socket = null;
  if (button) {
    button.addEventListener(
      'click',
      async () => {
        button.innerHTML = 'Loading';
        try {
          console.log(socket);
          if (socket === null) {
            button.innerHTML = 'Please allow webcam access';
            const peer = new Peer();
            await setupStream(peer);
            socket = await setupSocket(peer);
            button.innerHTML = peer.getIsInitiator()
              ? 'Connected (wait for another connection)'
              : 'Wait you will join someone';
          } else {
            socket.close();
            socket = null;
            button.innerHTML = 'Join';
          }
        } catch (e) {
          console.log(e);
          button.innerHTML = 'Retry';
        }
      },
      false,
    );
  }
};
