import { Modal } from "antd";
import { useEffect, useState } from "react";
import { showNotification } from "src/utils/showNotification";

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

type Table = {};

type RequestType = {
  drinks: DrinkType[];
  table?: Table;
};

export const REQUEST_KEY = "request";

const { confirm } = Modal;

export function useRequest() {
  const [request, setRequest] = useState<RequestType>({
    drinks: []
  });

  useEffect(() => {
    const request = localStorage.getItem(REQUEST_KEY);

    if (request) {
      setRequest(JSON.parse(request));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REQUEST_KEY, JSON.stringify(request));
  }, [request]);

  function add(drink: DrinkType) {
    setRequest({ ...request, drinks: [...request.drinks, drink] });
    showNotification({
      type: "success",
      message: "Bebida foi adicionada ao pedido com sucesso!",
      duration: 2,
    });
  }

  function clearRequest() {
    setRequest({ drinks: [] });
  }

  function addDrink(drink: DrinkType) {
    const containsDrink = request.drinks.some(
      ({ uuid }) => uuid === drink.uuid
    );

    if (containsDrink) {
      confirm({
        title: "Essa bebida já está no pedido, adicionar mais uma?",
        onOk: () => add(drink),
      });

      return;
    }

    add(drink);
  }

  return { request, setRequest, addDrink, clearRequest };
}
