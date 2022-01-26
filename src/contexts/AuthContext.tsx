import { createContext } from 'react';

import { useAuth } from './hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContenxtType>(
  {} as AuthContenxtType
);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
