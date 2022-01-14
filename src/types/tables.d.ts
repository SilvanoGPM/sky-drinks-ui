export interface TableType {
  uuid?: string;
  seats: number;
  number: number;
  occupied: boolean;
}

export interface TablePaginetedType {
  totalElements: number;
  content: TableType[];
}

export interface TableSearchParams {
  greaterThanOrEqualToSeats?: number;
  lessThanOrEqualToSeats?: number;
  occupied?: number;
  page?: number;
  size?: number;
}

export interface TableToCreate {
  seats: number;
  number: number;
}

export interface TableToUpdate {
  uuid: string;
  seats: number;
  number: number;
}
