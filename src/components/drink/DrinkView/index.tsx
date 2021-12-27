import { useState, useEffect, useRef, useContext } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Skeleton, Tag, Divider, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useDraggableScroll from "use-draggable-scroll";

import { useTitle } from "src/hooks/useTitle";

import endpoints from "src/api/api";
import { formatDatabaseDate } from "src/utils/formatDatabaseDate";
import { formatDrinkVolume } from "src/utils/formatDrinkVolume";
import { getAdditionalTagColor } from "src/utils/getAdditionalTagColor";

import styles from "./styles.module.scss";
import drinkPlaceholder from "src/assets/drink-placeholder.png";
import { showNotification } from "src/utils/showNotification";
import { RequestContext } from "src/contexts/RequestContext";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { isUUID } from "src/utils/isUUID";
import routes from "src/routes";

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

export function DrinkView() {
  useTitle("SkyDrinks - Visualizar bebida");

  const infoRef = useRef<HTMLDivElement>(null);

  const { onMouseDown } = useDraggableScroll(infoRef);

  const params = useParams();

  const navigate = useNavigate();

  const [drink, setDrink] = useState<DrinkType>({} as DrinkType);
  const [loading, setLoading] = useState(true);

  const { addDrink } = useContext(RequestContext);

  useEffect(() => {
    async function findDrink() {
      const uuid = params.uuid || "";

      if (isUUID(uuid)) {
        try {
          const drinkFound = await endpoints.findDrinkByUUID(uuid);
          setDrink(drinkFound);
        } catch (exception: any) {
          navigate(routes.HOME);

          showNotification({
            type: "warn",
            message: "Visualização de Bebida",
            description: exception.message,
          });
        } finally {
          setLoading(false);
        }
      } else {
        navigate(routes.HOME);

        showNotification({
          type: "warn",
          message: "Insira um código de uma bebida válida!",
        });
      }
    }

    if (loading) {
      findDrink();
    }
  }, [loading, params, navigate]);

  function addDrinkToRequest() {
    addDrink(drink);
  }

  const picture =
    drink.picture && !drink.picture.endsWith("null")
      ? drink.picture
      : drinkPlaceholder;

  return (
    <section className={styles.container}>
      {loading ? (
        <>
          <Skeleton.Image
            style={{ maxWidth: "700px", width: "60vw", height: "100vh" }}
          />
          <Skeleton title paragraph loading={loading} />
        </>
      ) : (
        <>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${picture})` }}
          />

          <div ref={infoRef} onMouseDown={onMouseDown} className={styles.info}>
            <h2>{drink.name}</h2>
            <p>
              A bebida foi adicionada em{" "}
              <span className={styles.bold}>
                {formatDatabaseDate(drink.createdAt)}.
              </span>
            </p>
            <p>{drink.description}</p>
            <p>
              Está bebida{" "}
              <span className={styles.bold}>
                {drink.alcoholic ? "contém" : "não contém"}
              </span>{" "}
              alcóol.
            </p>
            <p>
              A bebida contém{" "}
              <span className={styles.bold}>
                {formatDrinkVolume(drink.volume)}
              </span>
            </p>
            <p>
              Preço:{" "}
              <span className={styles.bold}>
                R$ {formatDisplayPrice(drink.price)}
              </span>
            </p>

            <Divider orientation="left">Adicionais</Divider>

            <div className={styles.additional}>
              {drink.additionalList.map((additional) => (
                <Tag
                  color={getAdditionalTagColor(additional)}
                  key={`Adicional - ${additional}`}
                >
                  {additional}
                </Tag>
              ))}
            </div>

            <Button
              onClick={addDrinkToRequest}
              icon={<PlusOutlined />}
              type="primary"
            >
              Adicionar ao Pedido
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
