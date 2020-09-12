export default () => {
  const constraints = { audio: false, video: true };
  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => mediaStream)
    .catch((err) => {
      // no webcam or user disable webcam access
      console.log(`${err.name}: ${err.message}`);
    });
};
