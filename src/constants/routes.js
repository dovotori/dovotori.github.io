import { lazy } from 'react';

const About = lazy(() => import('../containers/AboutContainer'));
const Project = lazy(() => import('../containers/ProjectContainer'));
const Home = lazy(() => import('../components/Home'));
const LangRedirect = lazy(() => import('../containers/LangRedirectContainer'));

const routes = [
  {
    path: '/en',
    component: LangRedirect,
    exact: true,
  },
  {
    path: '/jp',
    component: LangRedirect,
    exact: true,
  },
  {
    path: '/about',
    component: About,
    exact: true,
  },
  {
    path: '/project/:slug',
    component: Project,
    exact: true,
  },
  {
    path: '/category/:slug',
    component: Home,
    exact: true,
  },
  {
    path: '/',
    component: Home,
    exact: true,
  },
];

export default routes;
