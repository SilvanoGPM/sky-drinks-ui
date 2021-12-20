const routes = {
  HOME: "/",

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
};

export default routes;
