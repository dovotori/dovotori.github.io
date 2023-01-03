import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./components/App";
import store from "./store";

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // scope should be https://domain/ to avoid error on reload
        console.log(
          `[Service Worker] Registration successful with scope: ${registration.scope}`,
        );
      })
      .catch((err) =>
        console.log("[Service Worker] Registration failed: ", err),
      );
  });
}

const Main = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

createRoot(document.querySelector(`#${process.env.NAME}`)).render(<Main />);
