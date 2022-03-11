const routes = {
  HOME: '/',
  NOT_AUTHORIZED: '/not-authorized',

  LOGIN: '/login',
  LOGOUT: 'logout',

  MANAGE_IMAGES: 'images/manage',

  SEARCH_DRINKS: 'drinks/search',
  MANAGE_DRINKS: 'drinks/manage',
  VIEW_DRINK: '/drinks/:uuid',
  CREATE_DRINK: '/drinks/create',
  EDIT_DRINK: '/drinks/edit/:uuid',

  MANAGE_USERS: 'users/manage',
  CREATE_USER: '/users/create',
  EDIT_USER: '/users/edit/:uuid',
  USER_METRICS: '/users/metrics/:uuid',
  MY_ACCOUNT: 'my-account',

  FINALIZE_REQUEST: 'requests/finish',
  REQUEST_CREATED: 'requests/created',
  VIEW_REQUEST: 'requests/view/:uuid',
  FIND_REQUEST: 'requests/find/',
  MANAGE_REQUESTS: 'requests/manage',
  SEARCH_REQUESTS: 'requests/search',
  MY_REQUESTS: 'my-requests',

  MANANGE_TABLES: 'tables/manage',

  DASHBOARD: 'dashboard',

  FORGOT_PASSWORD: '/forgot-password',
};

export default routes;
