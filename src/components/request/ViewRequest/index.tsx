import { Badge, Divider, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import endpoints, { toFullPictureURI } from "src/api/api";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";
import { getStatusBadge } from "src/utils/getStatusBadge";
import { isUUID } from "src/utils/isUUID";
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

type Table = {};

type UserType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type StatusType = "PROCESSING" | "FINISHED" | "CANCELED";

type RequestType = {
  drinks: DrinkType[];
  createdAt: string;
  updatedAt: string;
  uuid: string;
  status: StatusType;
  user: UserType;
  table?: Table;
  totalPrice: number;
};

export function ViewRequest() {
  useTitle("SkyDrinks - Visualizar pedido");

  const params = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requestFound, setRequestFound] = useState<RequestType>(
    {} as RequestType
  );

  const redirect = useCallback(() => {
    const path = location?.state?.path
      ? `/${location.state.path}`
      : routes.HOME;

    navigate(path);
  }, [location, navigate]);

  useEffect(() => {
    const uuid = params.uuid || "";

    async function loadRequest() {
      if (isUUID(uuid)) {
        try {
          const request = await endpoints.findRequestByUUID(uuid);
          setRequestFound(request);
        } catch (e: any) {
          showNotification({
            type: "warn",
            message: e.message,
          });

          redirect();
        } finally {
          setLoading(false);
        }
      } else {
        showNotification({
          type: "warn",
          message: "Pesquise por um código válido!",
        });

        redirect();
      }
    }

    if (loading) {
      loadRequest();
    }

    return () => setLoading(false);
  }, [params, loading, navigate, location, redirect]);

  return (
    <div className={styles.container}>
      {loading ? (
        <Spin />
      ) : (
        <>
          <div>
            <h2 className={styles.title}>Visualizar Pedido</h2>
          </div>

          <div>
            <Divider
              style={{ fontSize: "1.5rem", margin: "2rem 0" }}
              orientation="left"
            >
              Geral
            </Divider>

            <h3>
              Código do pedido:{" "}
              <span className={styles.bold}>{requestFound.uuid}</span>
            </h3>
            <p>
              Usuário:{" "}
              <span className={styles.bold}>
                {requestFound.user.name} - {requestFound.user.email}
              </span>
            </p>
            <div className={styles.status}>
              <p>Status: </p>
              {getStatusBadge(requestFound.status)}
            </div>
            <p>
              Pedido realizado em{" "}
              <span className={styles.bold}>
                {formatDisplayDate(requestFound.createdAt)}
              </span>
            </p>
            <p>
              Pedido atualizado em{" "}
              <span className={styles.bold}>
                {formatDisplayDate(requestFound.updatedAt)}
              </span>
            </p>
            <p>
              Preço estimado:{" "}
              <span className={styles.bold}>
                {formatDisplayPrice(requestFound.totalPrice)}
              </span>
            </p>

            <Divider
              style={{ fontSize: "1.5rem", margin: "2rem 0" }}
              orientation="left"
            >
              Bebidas
            </Divider>

            <div>
              {Object.keys(getDrinksGroupedByUUID(requestFound)).map(
                (key, index) => {
                  const drinksWithFullPicture =
                    requestFound.drinks.map(toFullPictureURI);
                  const drinksGrouped = getDrinksGroupedByUUID({
                    drinks: drinksWithFullPicture,
                  });
                  const [drink] = drinksGrouped[key];
                  const length = drinksGrouped[key].length;

                  const { picture, name, price } = drink;

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
                          R$ {formatDisplayPrice(price * length)}
                        </p>
                      </div>

                      <Badge count={length}>
                        <figure>
                          <img src={picture} alt={name} />
                        </figure>
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
