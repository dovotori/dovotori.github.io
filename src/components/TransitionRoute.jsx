import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, withRouter } from 'react-router-dom';

import { shouldNotReload } from '../utils';
import Loader from './Loader';

const TIME = 10000;

const In = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0; }
	100% { opacity: 1; }
`;

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
    overflow: hidden;
    width: 100%;
    max-height: 100vh;
    top: 0;
    left: 0;
    animation: ${In} ${TIME}ms linear forwards;
  }
  .route-exit {
    animation: ${Out} ${TIME}ms linear forwards;
  }
`;

const TransitionRoute = ({
  isTouchDevice, location, names, children,
}) =>
  // if (isTouchDevice) {
  (
    <Suspense fallback={<Loader colorType={0} />}>
      <Switch location={location}>{children}</Switch>
    </Suspense>
  )
  // }
  // return (
  //   <StyledTransitionGroup names={names}>
  //     <CSSTransition
  //       key={shouldNotReload(location.pathname)}
  //       timeout={TIME}
  //       classNames="route"
  //     >
  //       <Suspense fallback={<Loader colorType={0} />}>
  //         <Switch location={location}>{children}</Switch>
  //       </Suspense>
  //     </CSSTransition>
  //   </StyledTransitionGroup>
  // );
;

export default withRouter(TransitionRoute);
