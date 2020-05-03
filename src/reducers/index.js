import device from "./device";
import content from "./content";

const rootReducer = (state = {}, action) => {
  const deviceState = device(state.device, action);
  return {
    device: deviceState,
    content: content(state.content, action, { device: deviceState }),
  };
};

export default rootReducer;
