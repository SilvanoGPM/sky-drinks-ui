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
  request: RequestToCreate;
  addDrink: (drink: DrinkType) => void;
  clearRequest: () => void;
  setRequest: (request: RequestToCreate) => void;
  changeTable: (table?: TableType) => void;
  loading: boolean;
}
