import { createContext, useState } from "react";

type WebSocketContextProps = {
  updateRequests: boolean;
  setUpdateRequests: (updateRequests: boolean) => void;
};

type WebSocketProviderProps = {
  children: React.ReactNode;
};

export const WebSocketContext = createContext<WebSocketContextProps>(
  {} as WebSocketContextProps
);

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [updateRequests, setUpdateRequests] = useState(false);

  return (
    <WebSocketContext.Provider value={{ updateRequests, setUpdateRequests }}>
      {children}
    </WebSocketContext.Provider>
  );
}
