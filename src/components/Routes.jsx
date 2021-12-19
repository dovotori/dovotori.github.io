import { Route, HashRouter as Router, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { ReactComponent as BackArrow } from 'Assets/svg/arrow.svg';
import TransitionRoute from './TransitionRoute';
import ButtonNavigation from './ButtonNavigation';
import FooterContainer from '../containers/FooterContainer';
import ProjectCommonContainer from '../containers/ProjectCommonContainer';
import SignatureContainer from '../containers/SignatureContainer';
import routes from '../constants/routes';

const Arrow = styled(BackArrow)`
  height: 1em;
  fill: ${(p) => p.theme.getColor};
`;

const MinHeight = styled.div`
  min-height: 100vh;
`;

const renderRoute = (route) => (
  <Route key={route.path} path={route.path} exact={route.exact} component={route.component} />
);

const RedirectionHome = () => <Redirect to="/" />;

const Center = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 700px;
  ${(p) => p.hide && `visibility: hidden; pointer-events: none;`}
`;

const BackButton = () => {
  const match = useRouteMatch();
  const labelBack = useSelector((state) => state.content.back);
  return (
    <Center hide={match.path !== '/about'}>
      <ButtonNavigation to="/" label={labelBack} $colorType={0}>
        <Arrow $colorType={0} />
        <Arrow $colorType={0} />
      </ButtonNavigation>
    </Center>
  );
};

const Routes = ({ isTouchDevice }) => (
  <Router>
    <>
      <MinHeight>
        <Switch>
          <Route path={['/', '/category/:slug', '/about']} exact component={BackButton} />
          <Route path="/project/:slug" exact component={ProjectCommonContainer} />
        </Switch>
        <Switch>
          <Route path={['/', '/category/:slug', '/about']} exact component={SignatureContainer} />
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
