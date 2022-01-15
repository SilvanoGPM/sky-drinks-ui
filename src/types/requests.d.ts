import { DrinkType } from "./drinks";
import { TableType } from "./tables";
import { UserType } from "./user";

export type RequestStatusType = "PROCESSING" | "FINISHED" | "CANCELED";

export interface RequestType {
  uuid: string;
  createdAt?: string;
  updatedAt?: string;
  totalPrice: number;
  delivered: boolean;
  status: RequestStatusType;
  drinks: DrinkType[];
  user?: UserType;
  table?: TableType;
}

export interface RequestPaginatedType {
  totalElements: number;
  content: RequestType[];
}

export interface RequestToCreate {
  drinks: DrinkType[];
  table?: TableType;
}

export interface RequestSearchParams {
  status?: RequestStatusType;
  drinkName?: string;
  drinkDescription?: string;
  createdAt?: string;
  createdInDateOrAfter?: string;
  createdInDateOrBefore?: string;
  price?: number;
  lessThanOrEqualToTotalPrice?: number;
  greaterThanOrEqualToTotalPrice?: number;
  userCpf?: string;
  userEmail?: string;
  userName?: string;
  delivered?: number;
  sort?: string;
  page?: number;
  size?: number;
}

export interface RequestGrouped {
  [key: string]: DrinkType[];
}

export interface TopDrinkType {
  drinkUUID: string;
  name: string;
  total: number;
}

export interface RequestLengthAndPrice {
  price: number;
  length: number;
};

export interface RequestData {
  [key: string]: RequestLengthAndPrice;
};

export interface RequestsData {
  requestsDelivered: RequestData;
  requestsCanceled: RequestData;
  requestsProcessing: RequestData;
};

export interface DataOfDrinksType {
  topDrinks: TopDrinkType[];
  mostCanceled: TopDrinkType[];
}

export interface TotalDrinkType {
  alcoholic: boolean;
  total: number;
}

export interface RequestSearchForm {
  status: RequestStatusType;
  createdAt: any;
  drinkName: string;
  drinkDescription: string;
  price: number[];
}

interface RequestSearchFormForAdmins extends RequestSearchForm {
  delivered: number;
  userName: string;
  userEmail: string;
  userCpf: string;
}
