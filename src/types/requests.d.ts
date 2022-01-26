type RequestStatusType = 'PROCESSING' | 'FINISHED' | 'CANCELED';

interface RequestType {
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

interface RequestPaginatedType {
  totalElements: number;
  content: RequestType[];
}

interface RequestToCreate {
  drinks: DrinkType[];
  table?: TableType;
}

interface RequestSearchParams {
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

interface RequestGrouped {
  [key: string]: DrinkType[];
}

interface TopDrinkType {
  drinkUUID: string;
  name: string;
  total: number;
}

interface RequestLengthAndPrice {
  price: number;
  length: number;
}

interface RequestData {
  [key: string]: RequestLengthAndPrice;
}

interface RequestsData {
  requestsDelivered: RequestData;
  requestsCanceled: RequestData;
  requestsProcessing: RequestData;
}

interface DataOfDrinksType {
  topDrinks: TopDrinkType[];
  mostCanceled: TopDrinkType[];
}

interface TotalDrinkType {
  alcoholic: boolean;
  total: number;
}

interface RequestSearchForm {
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
