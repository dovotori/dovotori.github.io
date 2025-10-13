import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { StateProvider } from "./contexts";

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // scope should be https://domain/ to avoid error on reload
        console.log(
          `[Service Worker] Registration successful with scope: ${registration.scope}`,
        );

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          newWorker.addEventListener("statechange", () => {
            // When the service worker is installed, show update notification
            if (newWorker.state === "activated") {
              // You could show a notification to the user that the app has updated
              console.log("New version installed!");
              // Optional: Force reload to ensure everything is fresh
              window.location.reload();
            }
          });
        });
      })
      .catch((err) =>
        console.log("[Service Worker] Registration failed: ", err),
      );
  });
}

const Main = () => {
  return (
    <StrictMode>
      <StateProvider>
        <App />
      </StateProvider>
    </StrictMode>
  );
};
createRoot(document.querySelector(`#${process.env.NAME}`)).render(<Main />);
