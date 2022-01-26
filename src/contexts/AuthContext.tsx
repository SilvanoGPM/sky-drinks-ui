import { createContext } from 'react';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';

import { useAuth } from './hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContenxtType>(
  {} as AuthContenxtType
);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const auth = useAuth();

  if (auth.authLoading) {
    return <LoadingIndicator />;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
