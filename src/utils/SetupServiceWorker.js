const SetupServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/public/js/sw.js')
      .then((reg) => {
        if (reg.installing) {
          console.log('Service worker installing');
        } else if (reg.waiting) {
          console.log('Service worker installed');
        } else if (reg.active) {
          console.log('Service worker active');
        }
      })
      .catch((error) => {
        console.log(`ServiceWorker Registration failed: ${error}`);
      });
  }
};

export default SetupServiceWorker;
