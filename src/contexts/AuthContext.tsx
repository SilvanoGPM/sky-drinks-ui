import { createContext } from "react";

import { UserType } from "src/types/user";

import { useAuth } from "./hooks/useAuth";

interface LoginProps { email: string; password: string; remember: boolean };

interface AuthContextProps {
  userInfo: UserType;
  authenticated: boolean;
  authLoading: boolean;
  token: string;
  setUserInfo: (userInfo: UserType) => void;
  setAuthenticated: (authenticated: boolean) => void;
  handleLogin: (values: LoginProps) => Promise<void>;
  handleLogout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
