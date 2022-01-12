import moment from "moment";
import qs from "query-string";
import { BooleanParameterOfRequest } from "src/enum/BooleanParameterOfRequestEnum";

import { api } from "./api";

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

type Table = {
  uuid: string;
};

type RequestToCreate = {
  drinks: DrinkType[];
  table?: Table;
};

type StatusType = "PROCESSING" | "FINISHED" | "CANCELED";

type RequestSearchParams = {
  status?: StatusType;
  drinkName?: string;
  drinkDescription?: string;
  createdAt?: string;
  createdInDateOrAfter?: string;
  createdInDateOrBefore?: string;
  price?: number;
  lessThanOrEqualToTotalPrice?: number;
  greaterThanOrEqualToTotalPrice?: number;
  delivered?: number;
  sort?: string;
  page?: number;
  size?: number;
};

type RequestData = {
  [key: string]: {
    price: number;
    length: number;
  };
};

type RequestsData = {
  requestsDelivered: RequestData;
  requestsCanceled: RequestData;
  requestsProcessing: RequestData;
};

type RequestType = {
  createdAt: string;
  totalPrice: number;
};

const requestsEndpoints = {
  async createRequest(request: RequestToCreate) {
    const { data } = await api.post("/requests/user", request);
    return data;
  },

  async findRequestByUUID(uuid: string) {
    const { data } = await api.get(`/requests/${uuid}`);
    return data;
  },

  async getAllBlocked() {
    const { data } = await api.get("/requests/all/all-blocked");
    return data;
  },

  async getAllDates() {
    const { data } = await api.get("/requests/admin/all-dates");
    return data;
  },

  async getAllMonths() {
    const dates = await this.getAllDates();

    const months = dates.reduce((months: string[], { date }: any) => {
      const month = moment(date).format("YYYY-MM");

      if (months.includes(month)) {
        return months;
      }

      return [month, ...months];
    }, []);

    return months;
  },

  async searchRequests(
    params: RequestSearchParams = {} as RequestSearchParams
  ) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(`/requests/staff/search?${searchParams}`);

    return data;
  },

  async getMyRequests(params: RequestSearchParams = {} as RequestSearchParams) {
    const searchParams = qs.stringify(params);

    const { data } = await api.get(
      `/requests/user/my-requests?${searchParams}`
    );

    return data;
  },

  async getProcessingRequests(page = 0, size = 10) {
    return this.searchRequests({
      status: "PROCESSING",
      sort: "createdAt",
      page,
      size,
    });
  },

  async getMyTopFiveDrinks() {
    const { data } = await api.get("/requests/user/top-five-drinks");
    return data;
  },

  async getTotalOfDrinksGroupedByAlcoholic() {
    const { data } = await api.get("/requests/user/total-of-drinks-alcoholic");
    return data;
  },

  async getTopDrinks(size = 5) {
    const { data } = await api.get(`/requests/admin/top-drinks?size=${size}`);
    return data;
  },

  async getMostCanceledDrinks(size = 5) {
    const { data } = await api.get(
      `/requests/admin/most-canceled?size=${size}`
    );
    return data;
  },

  async getDataOfDrinksInRequests(size = 5) {
    const topDrinks = await this.getTopDrinks(size);
    const mostCanceled = await this.getMostCanceledDrinks(size);

    return {
      topDrinks,
      mostCanceled,
    };
  },

  async getRequestsData(
    yearAndMonth: string,
    startMonth?: string,
    endMonth?: string
  ) {
    const DATE_PATTERN = "YYYY-MM-DD";

    function toRequestData(
      dates: RequestData,
      { totalPrice, createdAt }: RequestType
    ) {
      const date = moment(createdAt).format(DATE_PATTERN);

      const value = dates[date];

      return value
        ? {
            ...dates,
            [date]: {
              length: value.length + 1,
              price: value.price + totalPrice,
            },
          }
        : { ...dates, [date]: { length: 1, price: totalPrice } };
    }

    function toRequestsData(contents: any[]) {
      return contents.map((content: []) =>
        content.reduce(toRequestData, {} as RequestData)
      );
    }

    const SIZE = 100000;

    const startOfMonth = startMonth ?? yearAndMonth;
    const endOfMonth = endMonth ?? yearAndMonth;

    const options = {
      createdInDateOrAfter: moment(startOfMonth).startOf("month").format(DATE_PATTERN),
      createdInDateOrBefore: moment(endOfMonth).endOf("month").format(DATE_PATTERN),
      // createdInDateOrAfter: "2021-12-01",
      // createdInDateOrBefore: "2022-12-01",
      size: SIZE,
    };

    const { content: deliveredContent } = await this.searchRequests({
      ...options,
      delivered: BooleanParameterOfRequest.TRUE,
    });

    const { content: canceledContent } = await this.searchRequests({
      ...options,
      status: "CANCELED",
    });

    const { content: processingContent } = await this.searchRequests({
      ...options,
      status: "PROCESSING",
    });

    const [requestsDelivered, requestsCanceled, requestsProcessing] =
      toRequestsData([deliveredContent, canceledContent, processingContent]);

    const requestsData: RequestsData = {
      requestsDelivered,
      requestsCanceled,
      requestsProcessing,
    };

    return requestsData;
  },

  async cancelRequest(uuid: string) {
    await api.patch(`/requests/all/cancel/${uuid}`);
  },

  async finishRequest(uuid: string) {
    await api.patch(`/requests/staff/finish/${uuid}`);
  },

  async deliverRequest(uuid: string) {
    await api.patch(`/requests/staff/deliver/${uuid}`);
  },

  async toggleBlockAllRequests() {
    const { data } = await api.patch("/requests/admin/toggle-all-blocked");
    return data;
  },
};

export default requestsEndpoints;
