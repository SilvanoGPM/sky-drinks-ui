interface UserType {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
  lockRequestsTimestamp?: string;
  lockRequests?: boolean;
}

interface UserToCreate {
  name: string;
  email: string;
  password: string;
  role: string;
  birthDay: string;
  cpf: string;
}

interface UserToUpdate {
  uuid: string;
  name: string;
  email: string;
  password: string;
  newPassword?: string;
  role: string;
  birthDay: string;
  cpf: string;
}

interface UserSearchParams {
  name?: string;
  email?: string;
  cpf?: string;
  role?: string;
  birthDay?: string;
  page?: number;
  size?: number;
  lockRequests?: number;
}

interface UserPaginatedType {
  totalElements: number;
  content: UserType[];
}

interface UserSearchForm {
  name: string;
  email: string;
  cpf: string;
  role: string[];
  birthDay: any;
  lockRequests: number;
}
