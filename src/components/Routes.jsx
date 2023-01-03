import {
  Route,
  HashRouter as Router,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { ReactComponent as BackArrow } from "Assets/svg/arrow.svg";
import TransitionRoute from "./TransitionRoute";
import ButtonNavigation from "./ButtonNavigation";
import FooterContainer from "../containers/FooterContainer";
import ProjectCommonContainer from "../containers/ProjectCommonContainer";
import SignatureContainer from "../containers/SignatureContainer";
import routes from "../constants/routes";
import { getIsTouchDevice } from "../selectors";

const Arrow = styled(BackArrow)`
  height: 1em;
  fill: ${(p) => p.theme.getColor};
`;

const MinHeight = styled.div`
  min-height: 100vh;
`;

const renderRoute = (route) => {
  const Comp = route.component;
  return (
    <Route
      key={route.path}
      path={route.path}
      exact={route.exact}
      element={<Comp />}
    />
  );
};

const RedirectionHome = () => <Navigate to="/" />;

const Center = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 700px;
  ${(p) => p.hide && `visibility: hidden; pointer-events: none;`}
`;

const BackButton = () => {
  const location = useLocation();
  const labelBack = useSelector((state) => state.content.back);
  return (
    <Center
      hide={
        location.pathname === "/" ||
        location.pathname.indexOf("/category/") !== -1
      }
    >
      <ButtonNavigation to="/" label={labelBack} $colorType={0}>
        <Arrow $colorType={0} />
        <Arrow $colorType={0} />
      </ButtonNavigation>
    </Center>
  );
};

const Common = () => (
  <>
    <BackButton />
    <SignatureContainer />
  </>
);

const MainRoutes = () => {
  const isTouchDevice = getIsTouchDevice();
  return (
    <Router>
      <>
        <MinHeight className="min-height">
          <Routes>
            <Route path="/qrcode" exact element={<BackButton />} />
            <Route path="/about" exact element={<Common />} />
            <Route path="/category/:slug" exact element={<Common />} />
            <Route path="/" exact element={<Common />} />
            <Route
              path="/project/:slug"
              exact
              element={<ProjectCommonContainer />}
            />
          </Routes>
          <TransitionRoute $isTouchDevice={isTouchDevice}>
            {routes.map(renderRoute)}
            <Route path="*" element={<RedirectionHome />} />
          </TransitionRoute>
        </MinHeight>
        <FooterContainer />
      </>
    </Router>
  );
};

export default MainRoutes;
