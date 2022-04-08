interface SortType {
  order: string;
  sort: string;
}

interface UserPermissions {
  isGuest: boolean;
  isAdmin: boolean;
  isBarmen: boolean;
  isWaiter: boolean;
  isUser: boolean;
}

interface PaginationType {
  page: number;
  size: number;
}

interface PaginationReturn {
  totalElements: any;
  content: any[];
}

interface LoginProps {
  email: string;
  password: string;
  remember: boolean;
}

interface ActionRenderType {
  uuid: string;
  data: DrinkPaginatedType;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}

interface ResetPasswordType {
  email: string;
  token: string;
}

type ImageType = 'USER' | 'DRINK';
