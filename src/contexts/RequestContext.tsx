import { createContext } from "react";
import { useRequest } from "./hooks/useRequest";

type RequestProviderProps = {
  children: React.ReactNode;
};

type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

type TableType = {
  uuid: string;
  number: number;
};

type RequestType = {
  drinks: DrinkType[];
  table?: TableType;
};

type RequestContextProps = {
  request: RequestType;
  addDrink: (drink: DrinkType) => void;
  clearRequest: () => void;
  setRequest: (request: RequestType) => void;
  changeTable: (table?: TableType) => void;
};

export const RequestContext = createContext<RequestContextProps>(
  {} as RequestContextProps
);

export function RequestProvider({ children }: RequestProviderProps) {
  const value = useRequest();

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
}
