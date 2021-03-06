import LoginPage from '../pages/login.jsx';
import TabRouter from '../pages/routes.jsx';
import HomePage from '../pages/home.jsx';
import AspenPage from '../pages/aspen.jsx';
import SettingPage from '../pages/settings.jsx';

var routes = [
  {
    path: '/logon/',
    component: LoginPage,
    transition: 'f7-dive',
  },
  {
    path: '/routes/',
    component: TabRouter,
    options: {
      transition: 'f7-dive',
    },
  },
  {
    path: '/home/',
    component: HomePage,
    options: {
      transition: 'f7-dive',
    },
  },
  {
    path: '/aspen/',
    component: AspenPage,
    options: {
      transition: 'f7-dive',
    },
  },
  {
    path: '/settings/',
    component: SettingPage,
    options: {
      transition: 'f7-dive',
    },
  },
];

export default routes;
