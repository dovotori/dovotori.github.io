import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AppContainer from './containers/AppContainer';
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
    document.querySelector(`#${process.env.NAME}`)
  );
};

render(AppContainer);

if (module.hot) {
  module.hot.accept('./containers/AppContainer', () => {
    /* eslint-disable-next-line global-require */
    const NextApp = require('./containers/AppContainer').default;
    render(NextApp);
  });
}
