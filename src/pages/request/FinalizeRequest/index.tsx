import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "src/api/api";
import { InputNumberSpinner } from "src/components/custom/InputNumberSpinner";
import { AuthContext } from "src/contexts/AuthContext";
import { RequestContext } from "src/contexts/RequestContext";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";
import { handleError } from "src/utils/handleError";
import { showNotification } from "src/utils/showNotification";
import { FetchTables } from "./FetchTables";

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

  const { userInfo } = useContext(AuthContext);

  const { request, setRequest, clearRequest, changeTable } =
    useContext(RequestContext);

  const [loading, setLoading] = useState(false);
  const [allBlocked, setAllBlocked] = useState(false);

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

  useEffect(() => {
    async function loadAllBlocked() {
      try {
        const allBlocked = await endpoints.getAllBlocked();

        setAllBlocked(allBlocked);
      } catch {}
    }

    loadAllBlocked();
  }, []);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  function requestGroupedToArray(requestGrouped: RequestGrouped) {
    return Object.keys(requestGrouped).reduce((arr, key) => {
      return [...arr, ...requestGrouped[key]];
    }, [] as DrinkType[]);
  }

  async function createRequest() {
    try {
      setLoading(true);

      const { uuid } = await endpoints.createRequest(request);

      navigate(`/${routes.REQUEST_CREATED}`, { state: { uuid } });

      clearRequest();
    } catch (error: any) {
      handleError({
        error,
        fallback: "Não foi possível finalizar o pedido",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCreateRequest() {
    if (userInfo.lockRequests) {
      showNotification({
        type: "info",
        message: "Seus pedidos foram temporariamente desabilitados",
      });

      return;
    }

    confirm({
      type: "success",
      title: "Realmente deseja realizar o pedido?",
      okText: "Sim",
      cancelText: "Não",
      onOk: createRequest,
    });
  }

  const drinksGrouped = getDrinksGroupedByUUID(request);

  const lockFinishRequestsMessage = userInfo.lockRequests
    ? "Seus pedidos foram temporariamente bloqueados."
    : allBlocked
    ? "Todos os pedidos foram temporariamente bloqueados."
    : "";

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
                <Link to={routes.VIEW_DRINK.replace(":uuid", key)}>
                  <p className={styles.name}>{name}</p>
                </Link>
                <p className={styles.price}>
                  {formatDisplayPrice(price * length)}
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

      <div className={styles.table}>
        <p>Mesa em que você se encontra:</p>
        <FetchTables defaultTable={request.table} onChange={changeTable} />
      </div>

      <div className={styles.warnMessage}>
        <p className={styles.bold}>Atenção:</p>
        <p className={styles.italic}>
          Você pode pedir os adicionais na hora de pegar o pedido.
        </p>

        {Boolean(lockFinishRequestsMessage) && (
          <p className={styles.lockRequests}>{lockFinishRequestsMessage}</p>
        )}
      </div>

      <div>
        <Button
          style={{ width: "100%" }}
          disabled={userInfo.lockRequests || allBlocked}
          onClick={handleCreateRequest}
          size="large"
          type="primary"
          icon={<ShoppingCartOutlined />}
          loading={loading}
        >
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
}
