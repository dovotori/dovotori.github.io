import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { ReactComponent as BackArrow } from 'Assets/svg/arrow.svg';
import TransitionRoute from './TransitionRoute';
import ButtonNavigation from './ButtonNavigation';
import FooterContainer from '../containers/FooterContainer';
import ProjectCommonContainer from '../containers/ProjectCommonContainer';
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
`;

const BackButton = connect((state) => ({ labelBack: state.content.back }))(({ labelBack }) => (
  <Center>
    <ButtonNavigation to="/" label={labelBack} $colorType={0}>
      <Arrow $colorType={0} />
      <Arrow $colorType={0} />
    </ButtonNavigation>
  </Center>
));

const Routes = ({ isTouchDevice }) => (
  <Router>
    <>
      <MinHeight>
        <Switch>
          <Route path="/project/:slug" exact component={ProjectCommonContainer} />
          <Route path="/about" exact component={BackButton} />
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
