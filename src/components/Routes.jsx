import React from "react";
import { Route, Router, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

import TransitionRoute from "./TransitionRoute";
import FooterContainer from "../containers/FooterContainer";
import ProjectNavigationContainer from "../containers/ProjectNavigationContainer";
import routes from "../constants/routes";

const history = createBrowserHistory();

const renderRoute = (route) => (
  <Route
    key={route.path}
    path={route.path}
    exact={route.exact}
    component={route.component}
  />
);

const Routes = ({ isTouchDevice }) => (
  <Router history={history}>
    <>
      {/* Navigation top */}
      <Switch>
        <Route
          path="/project/:slug"
          exact
          component={ProjectNavigationContainer}
        />
      </Switch>
      {/* Main routes */}
      <TransitionRoute isTouchDevice={isTouchDevice}>
        {routes.map(renderRoute)}
        <Route
          path="*"
          render={() => (<Redirect to="/" />)}
        />
      </TransitionRoute>
      <FooterContainer />
    </>
  </Router>
);

export default Routes;
