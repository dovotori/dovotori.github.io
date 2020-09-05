import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, withRouter } from 'react-router-dom';

import Bloc from './Bloc';
import Loader from './Loader';

const TIME = 300;

const Out = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 0;  }
`;

const StyledTransitionGroup = styled(TransitionGroup)`
  .route-enter,
  .route-exit {
    pointer-events: none;
  }
  .route-enter {
    position: fixed;
    opacity: 0;
  }
  .route-enter-done {
    position: relative;
    opacity: 1;
  }
  .route-exit {
    animation: ${Out} ${TIME}ms linear forwards;
  }
`;

const renderLoader = () => (
  <Bloc>
    <Loader colorType={0} />
  </Bloc>
);

const shouldAnimRouteTransition = (location) => {
  if (location.pathname.indexOf('/project/') === 0 || location.pathname === '/about') {
    return location.pathname;
  }
  return 'notransition';
};

const RenderSwitch = ({ location, children }) => (
  <Suspense fallback={renderLoader()}>
    <Switch location={location}>{children}</Switch>
  </Suspense>
);

const TransitionRoute = ({ location, children, isTouchDevice }) => {
  // if (isTouchDevice) {
  return <RenderSwitch location={location}>{children}</RenderSwitch>;
  // }
  // return (
  //   <StyledTransitionGroup>
  //     <CSSTransition key={shouldAnimRouteTransition(location)} timeout={TIME} classNames="route">
  //       <RenderSwitch location={location}>{children}</RenderSwitch>
  //     </CSSTransition>
  //   </StyledTransitionGroup>
  // );
};

export default withRouter(TransitionRoute);
