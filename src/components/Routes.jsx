import React from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history'; // bettr for reload on SPA than createBrowserHistory

import TransitionRoute from './TransitionRoute';
import FooterContainer from '../containers/FooterContainer';
import ProjectCommonContainer from '../containers/ProjectCommonContainer';
import routes from '../constants/routes';

const history = createHashHistory();

const renderRoute = (route) => (
  <Route key={route.path} path={route.path} exact={route.exact} component={route.component} />
);

const Routes = ({ isTouchDevice }) => (
  <Router history={history}>
    <>
      <Switch>
        <Route path="/project/:slug" exact component={ProjectCommonContainer} />
      </Switch>
      <TransitionRoute isTouchDevice={isTouchDevice}>
        {routes.map(renderRoute)}
        <Route path="*" render={() => <Redirect to="/" />} />
      </TransitionRoute>
      <FooterContainer />
    </>
  </Router>
);

export default Routes;
