export interface DrinkType {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  volume: number;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
}

export interface DrinkPaginatedType {
  totalElements: number;
  content: DrinkType[];
};

export interface DrinkToCreate {
  volume: number;
  name: string;
  picture?: File | string;
  description: string;
  price: number;
  additional: string;
  alcoholic: boolean;
};

export interface DrinkToUpdate {
  uuid: string;
  volume: number;
  name: string;
  picture?: File | string;
  description: string;
  price: number;
  additional: string;
  alcoholic: boolean;
};

export interface DrinkSearchParams {
  name?: string;
  description?: string;
  additional?: string;
  alcoholic?: string;
  greaterThanOrEqualToPrice?: number;
  lessThanOrEqualToPrice?: number;
  greaterThanOrEqualToVolume?: number;
  lessThanOrEqualToVolume?: number;
  page?: number;
  size?: number;
};

export interface DrinkSearchForm {
  name: string;
  description: string;
  alcoholic: string;
  price: number[];
  volume: number[];
  additional: string[];
}
