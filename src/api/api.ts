import axios from "axios";

import drinksEndpoints from "./drinks";
import filesEndpoints from "./files";
import usersEndpoints from "./users";

import { tokenExpirationInterceptor } from "./tokenExpirationInterceptor";
import requestsEndpoints from "./requests";
import tablesEndpoints from "./tables";
import { normalizeImage } from "src/utils/imageUtils";

type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

export const baseURL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL,
});

export function imageToFullURI(image: string) {
  return `${baseURL}/files/images/${normalizeImage(image)}`;
}

export function toFullPictureURI(drink: DrinkType) {
  return {
    ...drink,
    picture: `${baseURL}/files/images/${drink.picture}`,
  };
}

tokenExpirationInterceptor();

const endpoints = {
  ...drinksEndpoints,
  ...usersEndpoints,
  ...filesEndpoints,
  ...requestsEndpoints,
  ...tablesEndpoints,
};

export default endpoints;
