import { Suspense } from "react";
import { Routes } from "react-router-dom";

import Bloc from "./Bloc";
import Loader from "./Loader";

const renderLoader = () => (
  <Bloc>
    <Loader $colorType={0} />
  </Bloc>
);

const RenderSwitch = ({ location, children }) => (
  <Suspense fallback={renderLoader()}>
    <Routes location={location}>{children}</Routes>
  </Suspense>
);

const TransitionRoute = ({ location, children }) => (
  <RenderSwitch location={location}>{children}</RenderSwitch>
);

export default TransitionRoute;
