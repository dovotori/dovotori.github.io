import { lazy } from "react";

const routes = [
  {
    path: ["/", "/category/:slug"],
    component: lazy(() => import("../components/Home")),
    exact: true,
  },
  {
    path: "/about",
    component: lazy(() => import("../containers/AboutContainer")),
    exact: true,
  },
  {
    path: "/project/:slug",
    component: lazy(() => import("../containers/ProjectContainer")),
    exact: false,
  },
];

export default routes;
