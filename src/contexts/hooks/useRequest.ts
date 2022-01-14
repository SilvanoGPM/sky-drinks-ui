import { Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { DrinkType } from "src/types/drinks";
import { RequestType } from "src/types/requests";
import { TableType } from "src/types/tables";
import { getUserAge } from "src/utils/getUserAge";
import { getUserPermissions } from "src/utils/getUserPermissions";
import { showNotification } from "src/utils/showNotification";
import { AuthContext } from "../AuthContext";

export const REQUEST_KEY = "request";

export const MINORITY = 18;

const { confirm } = Modal;

const initialRequestState = {
  drinks: [] as DrinkType[],
  status: "PROCESSING",
} as RequestType;

export function useRequest() {
  const { userInfo } = useContext(AuthContext);

  const [request, setRequest] = useState<RequestType>(initialRequestState);

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
  }

  function addDrink(drink: DrinkType) {
    if (userInfo.lockRequests) {
      showNotification({
        type: "info",
        message: "Seus pedidos foram temporariamente desabilitados!",
        duration: 2,
      });

      return;
    }

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

  function clearRequest() {
    setRequest(initialRequestState);
  }

  function changeTable(table?: TableType) {
    setRequest({ ...request, table });
  }

  return { request, setRequest, addDrink, clearRequest, changeTable };
}
