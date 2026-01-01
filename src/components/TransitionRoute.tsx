import { Suspense } from "react";
import { Routes } from "react-router-dom";

import Bloc from "./Bloc";
import Loader from "./Loader";

const renderLoader = () => (
  <Bloc>
    <Loader />
  </Bloc>
);

const RenderSwitch = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={renderLoader()}>
    <Routes>{children}</Routes>
  </Suspense>
);

const TransitionRoute = ({ children }: { children: React.ReactNode }) => (
  <RenderSwitch>{children}</RenderSwitch>
);

export default TransitionRoute;
