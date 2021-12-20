import axios from "axios";

import drinksEndpoints from "./drinks";
import filesEndpoints from "./files";
import usersEndpoints from "./users";

import "./refreshToken";

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

export function toFullPictureURI(drink: DrinkType) {
  return {
    ...drink,
    picture: `${baseURL}/files/images/${drink.picture}`,
  };
}

const endpoints = {
  ...drinksEndpoints,
  ...usersEndpoints,
  ...filesEndpoints,
};

export default endpoints;
