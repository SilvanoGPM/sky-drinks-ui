interface AuthContenxtType {
  userInfo: UserType;
  authenticated: boolean;
  authLoading: boolean;
  token: string;
  setUserInfo: (userInfo: UserType) => void;
  setAuthenticated: (authenticated: boolean) => void;
  handleLogin: (values: LoginProps) => Promise<void>;
  handleLogout: () => void;
}

interface RequestContextType {
  request: RequestType;
  addDrink: (drink: DrinkType) => void;
  clearRequest: () => void;
  setRequest: (request: RequestType) => void;
  changeTable: (table?: TableType) => void;
  loading: boolean;
}
