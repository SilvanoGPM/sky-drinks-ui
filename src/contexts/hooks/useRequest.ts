import { Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { getUserAge } from "src/utils/getUserAge";
import { getUserPermissions } from "src/utils/getUserPermissions";
import { showNotification } from "src/utils/showNotification";
import { AuthContext } from "../AuthContext";

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

export const MINORITY = 18;

const { confirm } = Modal;

export function useRequest() {
  const { userInfo } = useContext(AuthContext);

  const [request, setRequest] = useState<RequestType>({
    drinks: [],
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

  const permissions = getUserPermissions(userInfo.role);

  function add(drink: DrinkType) {
    setRequest({ ...request, drinks: [...request.drinks, drink] });

    showNotification({
      type: "success",
      message: "Bebida foi adicionada ao pedido com sucesso!",
      duration: 2,
    });

    if (permissions.isUser) {
      const userAge = getUserAge(userInfo.birthDay);
      const isAlcoholicAndUserIsMinor = drink.alcoholic && userAge < MINORITY;

      if (isAlcoholicAndUserIsMinor) {
        showNotification({
          type: "info",
          message: `Usuário não possuí ${MINORITY} anos!`,
          description: `É preciso ter ${MINORITY} anos ou mais para fazer o pedido de uma bebida alcoólica!`,
          duration: 2,
        });

        return;
      }
    } else {
      showNotification({
        type: "info",
        message: "Somente usuários podem realizar pedidos!",
        duration: 2,
      });
    }
  }

  function clearRequest() {
    setRequest({ drinks: [] });
  }

  function addDrink(drink: DrinkType) {
    if (permissions.isUser) {
      const userAge = getUserAge(userInfo.birthDay);
      const isAlcoholicAndUserIsMinor = drink.alcoholic && userAge < MINORITY;

      if (isAlcoholicAndUserIsMinor) {
        showNotification({
          type: "info",
          message: `Usuário não possuí ${MINORITY} anos!`,
          description: `É preciso ter ${MINORITY} anos ou mais para fazer o pedido de uma bebida alcoólica!`,
          duration: 2,
        });

        return;
      }

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
    } else {
      showNotification({
        type: "info",
        message: "Somente usuários podem realizar pedidos!",
        duration: 2,
      });
    }
  }

  return { request, setRequest, addDrink, clearRequest };
}
