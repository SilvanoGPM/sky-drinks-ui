import { createContext } from "react";

import { useAuth } from "./hooks/useAuth";

type LoginProps = { email: string; password: string; remember: boolean };

type AuthContextProps = {
  authenticated: boolean;
  authLoading: boolean;
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
