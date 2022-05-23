import moment from 'moment';
import qs from 'query-string';

import { api } from './api';

interface RequestDateType {
  date: string;
}

const requestsEndpoints = {
  async createRequest(request: RequestToCreate): Promise<RequestType> {
    const { data } = await api.post<RequestType>('/requests/user', request);
    return data;
  },

  async findRequestByUUID(uuid: string): Promise<RequestType> {
    const { data } = await api.get<RequestType>(`/requests/${uuid}`);
    return data;
  },

  async getAllBlocked(): Promise<boolean> {
    const { data } = await api.get<boolean>('/requests/all/all-blocked');
    return data;
  },

  async getAllDates(): Promise<RequestDateType[]> {
    const { data } = await api.get<RequestDateType[]>(
      '/requests/admin/all-dates'
    );

    return data;
  },

  async getAllMonths(): Promise<string[]> {
    const dates = await this.getAllDates();

    const mappedMonths = dates.reduce(
      (months: string[], { date }: RequestDateType) => {
        const month = moment(date).format('YYYY-MM');

        if (months.includes(month)) {
          return months;
        }

        return [month, ...months];
      },
      []
    );

    return mappedMonths;
  },

  async searchRequests(
    params: RequestSearchParams = {}
  ): Promise<RequestPaginatedType> {
    const searchParams = qs.stringify(params);

    const { data } = await api.get<RequestPaginatedType>(
      `/requests/staff/search?${searchParams}`
    );

    return data;
  },

  async getMyRequests(
    params: RequestSearchParams = {}
  ): Promise<RequestPaginatedType> {
    const searchParams = qs.stringify(params);

    const { data } = await api.get<RequestPaginatedType>(
      `/requests/user/my-requests?${searchParams}`
    );

    return data;
  },

  async getProcessingRequests(
    page = 0,
    size = 10
  ): Promise<RequestPaginatedType> {
    return this.searchRequests({
      status: 'PROCESSING',
      sort: 'createdAt',
      page,
      size,
    });
  },

  async getMyTopFiveDrinks(): Promise<TopDrinkType[]> {
    const { data } = await api.get<TopDrinkType[]>(
      '/requests/user/top-five-drinks'
    );

    return data;
  },

  async getUserTopDrinks(uuid: string): Promise<TopDrinkType[]> {
    const { data } = await api.get<TopDrinkType[]>(
      `/requests/admin/top-five-drinks/${uuid}`
    );

    return data;
  },

  async getTotalOfDrinksGroupedByAlcoholic(): Promise<TotalDrinkType[]> {
    const { data } = await api.get<TotalDrinkType[]>(
      '/requests/user/total-of-drinks-alcoholic'
    );

    return data;
  },

  async getTopDrinks(size = 5): Promise<TopDrinkType[]> {
    const { data } = await api.get<TopDrinkType[]>(
      `/requests/top-drinks?size=${size}`
    );

    return data;
  },

  async getMostCanceledDrinks(size = 5): Promise<TopDrinkType[]> {
    const { data } = await api.get<TopDrinkType[]>(
      `/requests/admin/most-canceled?size=${size}`
    );

    return data;
  },

  async getDataOfDrinksInRequests(size = 5): Promise<DataOfDrinksType> {
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
  ): Promise<RequestsData> {
    const DATE_PATTERN = 'YYYY-MM-DD';

    function toRequestData(
      dates: RequestData,
      { totalPrice, createdAt }: RequestType
    ): RequestData {
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

    function toRequestsData(contents: RequestType[][]): RequestData[] {
      return contents.map((content) =>
        content.reduce(toRequestData, {} as RequestData)
      );
    }

    const SIZE = 100000;

    const startOfMonth = startMonth ?? yearAndMonth;
    const endOfMonth = endMonth ?? yearAndMonth;

    const createdInDateOrAfter = moment(startOfMonth)
      .startOf('month')
      .format(DATE_PATTERN);

    const createdInDateOrBefore = moment(endOfMonth)
      .endOf('month')
      .format(DATE_PATTERN);

    const options = {
      createdInDateOrAfter,
      createdInDateOrBefore,
      size: SIZE,
    };

    const { content: deliveredContent } = await this.searchRequests({
      ...options,
      delivered: 1,
    });

    const { content: canceledContent } = await this.searchRequests({
      ...options,
      status: 'CANCELED',
    });

    const { content: processingContent } = await this.searchRequests({
      ...options,
      status: 'PROCESSING',
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

  async cancelRequest(uuid: string): Promise<void> {
    await api.patch(`/requests/all/cancel/${uuid}`);
  },

  async startRequest(uuid: string): Promise<void> {
    await api.patch(`/requests/staff/start/${uuid}`);
  },

  async finishRequest(uuid: string): Promise<void> {
    await api.patch(`/requests/staff/finish/${uuid}`);
  },

  async deliverRequest(uuid: string): Promise<void> {
    await api.patch(`/requests/staff/deliver/${uuid}`);
  },

  async toggleBlockAllRequests(): Promise<boolean> {
    const { data } = await api.patch<boolean>(
      '/requests/admin/toggle-all-blocked'
    );

    return data;
  },
};

export default requestsEndpoints;
