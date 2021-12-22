const routes = {
  HOME: "/",
  NOT_AUTHORIZED: "/not-authorized",

  LOGIN: "/login",
  LOGOUT: "logout",

  SEARCH_DRINKS: "drinks/search",
  MANAGE_DRINKS: "drinks/manage",
  VIEW_DRINK: "/drinks/:uuid",
  CREATE_DRINK: "/drinks/create",
  EDIT_DRINK: "/drinks/edit/:uuid",

  MANAGE_USERS: "users/manage",
  CREATE_USER: "/users/create",
  EDIT_USER: "/users/edit/:uuid",
  MY_ACCOUNT: "my-account",

  FINALIZE_REQUEST: "request/finish",
  REQUEST_CREATED: "request/created",
  VIEW_REQUEST: "request/view/:uuid",
  FIND_REQUEST: "request/find/",
};

export default routes;
