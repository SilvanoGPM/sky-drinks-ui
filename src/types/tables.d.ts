interface TableType {
  uuid: string;
  seats: number;
  number: number;
  occupied: boolean;
}

interface TablePaginetedType {
  totalElements: number;
  content: TableType[];
}

interface TableSearchParams {
  greaterThanOrEqualToSeats?: number;
  lessThanOrEqualToSeats?: number;
  occupied?: number;
  page?: number;
  size?: number;
  sort?: string;
}

interface TableToCreate {
  seats: number;
  number: number;
}

interface TableToUpdate {
  uuid: string;
  seats: number;
  number: number;
}
