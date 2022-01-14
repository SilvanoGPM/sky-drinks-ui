import { createContext } from "react";

import { DrinkType } from "src/types/drinks";
import { RequestType } from "src/types/requests";
import { TableType } from "src/types/tables";

import { useRequest } from "./hooks/useRequest";

interface RequestProviderProps {
  children: React.ReactNode;
}

interface RequestContextProps {
  request: RequestType;
  addDrink: (drink: DrinkType) => void;
  clearRequest: () => void;
  setRequest: (request: RequestType) => void;
  changeTable: (table?: TableType) => void;
}

export const RequestContext = createContext<RequestContextProps>(
  {} as RequestContextProps
);

export function RequestProvider({ children }: RequestProviderProps) {
  const value = useRequest();

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
}
