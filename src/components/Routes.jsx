import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import TransitionRoute from './TransitionRoute';
import FooterContainer from '../containers/FooterContainer';
import ProjectNavigationContainer from '../containers/ProjectNavigationContainer';
import routes from '../constants/routes';
import { shouldNotReload } from '../utils';

const history = createBrowserHistory();

const renderRoute = (route) => (
  <Route
    key={route.path}
    path={route.path}
    exact={route.exact}
    render={(props) => (
      <route.component
        key={shouldNotReload(props.location.pathname)}
        {...props}
      />
    )}
  />
);

const Routes = ({ isTouchDevice }) => (
  <Router history={history}>
    <>
      <Switch>
        <Route path={['/about']} exact component={null} />
        <Route
          path="/project/:slug"
          exact
          component={ProjectNavigationContainer}
        />
      </Switch>
      <TransitionRoute isTouchDevice={isTouchDevice}>
        {routes.map(renderRoute)}
      </TransitionRoute>
      <FooterContainer />
    </>
  </Router>
);

export default Routes;
