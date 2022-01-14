import axios from "axios";

import drinksEndpoints from "./drinks";
import filesEndpoints from "./files";
import usersEndpoints from "./users";
import requestsEndpoints from "./requests";
import tablesEndpoints from "./tables";
import { tokenExpirationInterceptor } from "./tokenExpirationInterceptor";

export const baseURL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL,
});

tokenExpirationInterceptor();

const endpoints = {
  ...drinksEndpoints,
  ...usersEndpoints,
  ...filesEndpoints,
  ...requestsEndpoints,
  ...tablesEndpoints,
};

export default endpoints;
