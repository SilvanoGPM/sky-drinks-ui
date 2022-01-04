import { createContext } from "react";

import { useAuth } from "./hooks/useAuth";

type UserInfoProps = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
  lockRequestsTimestamp: string;
  lockRequests: boolean;
};

type LoginProps = { email: string; password: string; remember: boolean };

type AuthContextProps = {
  userInfo: UserInfoProps;
  authenticated: boolean;
  authLoading: boolean;
  token: string;
  setUserInfo: (userInfo: UserInfoProps) => void;
  setAuthenticated: (authenticated: boolean) => void;
  handleLogin: (values: LoginProps) => Promise<void>;
  handleLogout: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
