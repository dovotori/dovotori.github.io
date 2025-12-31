import { createStore } from "redux";
import rootReducer from "../reducers/index";

export default () => {
  const store = createStore(
    rootReducer,
    wwindow.__REDUX_DEVTOOLS_EXTENSION__(),
  );

  if (module.hot) {
    module.hot.accept("../reducers/index", () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
};
