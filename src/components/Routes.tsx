import { ReactComponent as BackArrow } from "Assets/svg/arrow.svg";
import { Suspense } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import routes from "../constants/routes";
import FooterContainer from "../containers/FooterContainer";
import ProjectCommonContainer from "../containers/ProjectCommonContainer";
import SignatureContainer from "../containers/SignatureContainer";
import { getContentBack } from "../selectors";
import Bloc from "./Bloc";
import ButtonNavigation from "./ButtonNavigation";
import Loader from "./Loader";

const Arrow = styled(BackArrow)<{ $colorType: number }>`
  height: 1em;
  fill: ${(p) => p.theme.getColor};
`;

const MinHeight = styled.main`
  min-height: 100vh;
`;

const Center = styled.div<{ $isHide: boolean }>`
  position: relative;
  margin: 0 auto;
  max-width: 700px;
  ${(p) => p.$isHide && `visibility: hidden; pointer-events: none;`}
`;

const renderRoute = (route) => {
  const Comp = route.component;
  return <Route key={route.path} path={route.path} element={<Comp />} />;
};

const RedirectionHome = () => <Navigate to="/" />;

const BackButton = () => {
  const location = useLocation();
  const labelBack = getContentBack();
  const isHide = location.pathname === "/" || location.pathname.indexOf("/category/") !== -1;
  return (
    <Center $isHide={isHide}>
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

const fallback = () => (
  <Bloc>
    <Loader />
  </Bloc>
);

const MainRoutes = () => {
  return (
    <HashRouter>
      <MinHeight className="min-height">
        <Routes>
          <Route path="/qrcode" element={<BackButton />} />
          <Route path="/about" element={<Common />} />
          <Route path="/category/:slug" element={<Common />} />
          <Route path="/" element={<Common />} />
          <Route path="/project/:slug" element={<ProjectCommonContainer />} />
        </Routes>
        <Suspense fallback={fallback()}>
          <Routes>
            {routes.map(renderRoute)}
            <Route path="*" element={<RedirectionHome />} />
          </Routes>
        </Suspense>
      </MinHeight>
      <FooterContainer />
    </HashRouter>
  );
};

export default MainRoutes;
