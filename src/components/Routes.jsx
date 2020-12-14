import React from 'react';
import { Route, HashRouter as Router, Switch, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import TransitionRoute from './TransitionRoute';
import FooterContainer from '../containers/FooterContainer';
import ProjectCommonContainer from '../containers/ProjectCommonContainer';
import routes from '../constants/routes';

const MinHeight = styled.div`
  min-height: 100vh;
`;

const Back = styled(Link)``;

const renderRoute = (route) => (
  <Route key={route.path} path={route.path} exact={route.exact} component={route.component} />
);

const RedirectionHome = () => <Redirect to="/" />;

const Routes = ({ isTouchDevice }) => (
  <Router>
    <>
      <MinHeight>
        <Switch>
          <Route path="/project/:slug" exact component={ProjectCommonContainer} />
          <Route path="/about" exact render={() => <Back to="/">Back</Back>} />
        </Switch>
        <TransitionRoute $isTouchDevice={isTouchDevice}>
          {routes.map(renderRoute)}
          <Route path="*" component={RedirectionHome} />
        </TransitionRoute>
      </MinHeight>
      <FooterContainer />
    </>
  </Router>
);

export default Routes;
