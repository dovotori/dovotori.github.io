/* global process, module */
import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import SetupServiceWorker from './utils/SetupServiceWorker';
import configureStore from './store/configureStore';

const store = configureStore();

if (process.env.NODE_ENV === 'production') {
  SetupServiceWorker();
}

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.querySelector(`#${process.env.NAME}`),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}
