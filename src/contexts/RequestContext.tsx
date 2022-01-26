import { createContext } from 'react';

import { useRequest } from './hooks/useRequest';

interface RequestProviderProps {
  children: React.ReactNode;
}

export const RequestContext = createContext<RequestContextType>(
  {} as RequestContextType
);

export function RequestProvider({
  children,
}: RequestProviderProps): JSX.Element {
  const value = useRequest();

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
}
