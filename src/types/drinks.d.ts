interface DrinkType {
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

interface DrinkPaginatedType {
  totalElements: number;
  content: DrinkType[];
}

interface DrinkToCreate {
  volume: number;
  name: string;
  picture?: File | string;
  description: string;
  price: number;
  additional: string;
  alcoholic: boolean;
}

interface DrinkToUpdate {
  uuid: string;
  volume: number;
  name: string;
  picture?: File | string;
  description: string;
  price: number;
  additional: string;
  alcoholic: boolean;
}

interface DrinkSearchParams {
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
}

interface DrinkSearchForm {
  name: string;
  description: string;
  alcoholic: string;
  price: number[];
  volume: number[];
  additional: string[];
}
