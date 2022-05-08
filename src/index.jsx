import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/App';
import configureStore from './store/configureStore';

// if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
//   runtime.register('/public/js/sw.js');
// }

const store = configureStore();

const Main = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

createRoot(document.querySelector(`#${process.env.NAME}`)).render(<Main />);
