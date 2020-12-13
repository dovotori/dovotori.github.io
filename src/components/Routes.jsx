import React from 'react';
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom';

import TransitionRoute from './TransitionRoute';
import FooterContainer from '../containers/FooterContainer';
import ProjectCommonContainer from '../containers/ProjectCommonContainer';
import routes from '../constants/routes';

const renderRoute = (route) => (
  <Route key={route.path} path={route.path} exact={route.exact} component={route.component} />
);

const RedirectionHome = () => <Redirect to="/" />;

const Routes = ({ isTouchDevice }) => (
  <Router>
    <>
      <Switch>
        <Route path="/project/:slug" exact component={ProjectCommonContainer} />
      </Switch>
      <TransitionRoute $isTouchDevice={isTouchDevice}>
        {routes.map(renderRoute)}
        <Route path="*" component={RedirectionHome} />
      </TransitionRoute>
      <FooterContainer />
    </>
  </Router>
);

export default Routes;
