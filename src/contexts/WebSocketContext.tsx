import { createContext, useMemo, useState } from 'react';

interface WebSocketContextType {
  updateRequests: boolean;
  updateRequest: boolean;
  setUpdateRequests: (updateRequests: boolean) => void;
  setUpdateRequest: (updateRequest: boolean) => void;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketContext = createContext<WebSocketContextType>(
  {} as WebSocketContextType
);

export function WebSocketProvider({
  children,
}: WebSocketProviderProps): JSX.Element {
  const [updateRequests, setUpdateRequests] = useState(false);
  const [updateRequest, setUpdateRequest] = useState(false);

  const value = useMemo(
    () => ({
      updateRequests,
      setUpdateRequests,
      updateRequest,
      setUpdateRequest,
    }),
    [updateRequests, setUpdateRequests, updateRequest, setUpdateRequest]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
