import { lazy } from 'react';

import LangRedirect from '../components/LangRedirect';

const About = lazy(() => import('../containers/AboutContainer'));
const Project = lazy(() => import('../containers/ProjectContainer'));
const Home = lazy(() => import('../components/Home'));

const routes = [
  {
    path: '/en',
    component: LangRedirect,
  },
  {
    path: '/jp',
    component: LangRedirect,
  },
  {
    path: '/fr',
    component: LangRedirect,
  },
  {
    path: '/fr/about',
    component: LangRedirect,
  },
  {
    path: '/en/about',
    component: LangRedirect,
  },
  {
    path: '/jp/about',
    component: LangRedirect,
  },
  {
    path: '/fr/project/:slug',
    component: LangRedirect,
  },
  {
    path: '/en/project/:slug',
    component: LangRedirect,
  },
  {
    path: '/jp/project/:slug',
    component: LangRedirect,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/project/:slug',
    component: Project,
  },
  {
    path: '/category/:slug',
    component: Home,
  },
  {
    path: '/project/:slug',
    component: Project,
  },
  {
    path: '/',
    component: Home,
  },
];

export default routes;
