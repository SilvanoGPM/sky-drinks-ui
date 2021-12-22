import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "src/api/api";
import { InputNumberSpinner } from "src/components/custom/InputNumberSpinner";
import { RequestContext } from "src/contexts/RequestContext";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

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

type RequestGrouped = { [key: string]: DrinkType[] };

const { confirm } = Modal;

export function FinalizeRequest() {
  useTitle("SkyDrinks - Finalizar Pedido");

  const { request, setRequest, clearRequest } = useContext(RequestContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (request.drinks.length === 0) {
      navigate(routes.HOME, {
        state: {
          info: { message: "O pedido precisa conter pelo menos uma bebida" },
        },
      });
    }
  }, [request, navigate]);

  function requestGroupedToArray(requestGrouped: RequestGrouped) {
    return Object.keys(requestGrouped).reduce((arr, key) => {
      return [...arr, ...requestGrouped[key]];
    }, [] as DrinkType[]);
  }

  async function createRequest() {
    try {
      const { uuid } = await endpoints.createRequest(request);

      navigate(`/${routes.REQUEST_CREATED}`, { state: { uuid } });

      clearRequest();
    } catch (e: any) {
      showNotification({
        type: "warn",
        message: "Não foi possível finalizar o seu pedido.",
      });
    }
  }

  function handleCreateRequest() {
    confirm({
      type: "success",
      title: "Realmente deseja realizar o pedido?",
      okText: "Sim",
      cancelText: "Não",
      onOk: createRequest,
    });
  }

  const drinksGrouped = getDrinksGroupedByUUID(request);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Finalizar Pedido</h2>
      </div>

      <div>
        {Object.keys(drinksGrouped).map((key, index) => {
          const [drink] = drinksGrouped[key];
          const length = drinksGrouped[key].length;

          const { picture, name, price } = drink;

          function beforeDecrement(value: number, decrement: () => void) {
            if (value === 1) {
              confirm({
                title: "Deseja remover esta bebida?",
                okText: "Sim",
                cancelText: "Não",
                onOk: decrement,
              });
            } else {
              decrement();
            }
          }

          function handleIncrement() {
            setRequest({ ...request, drinks: [...request.drinks, drink] });
          }

          function handleDecrement() {
            const [, ...drinks] = drinksGrouped[key];
            setRequest({
              ...request,
              drinks: requestGroupedToArray({
                ...drinksGrouped,
                [key]: drinks,
              }),
            });
          }

          return (
            <div
              title={name}
              key={`${key} - ${index}`}
              className={styles.drink}
            >
              <div className={styles.info}>
                <p className={styles.name}>{name}</p>
                <p className={styles.price}>
                  R$ {formatDisplayPrice(price * length)}
                </p>
                <InputNumberSpinner
                  initialValue={length}
                  decrementChildren={
                    length === 1 ? (
                      <CloseOutlined style={{ color: "#e74c3c" }} />
                    ) : (
                      <MinusOutlined />
                    )
                  }
                  incrementChildren={<PlusOutlined />}
                  beforeDecrement={beforeDecrement}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />
              </div>

              <figure>
                <img src={picture} alt={name} />
              </figure>
            </div>
          );
        })}
      </div>

      <div>
        <Button
          style={{ width: "100%" }}
          onClick={handleCreateRequest}
          size="large"
          type="primary"
        >
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
}
