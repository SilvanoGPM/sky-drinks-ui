import { PlusOutlined } from "@ant-design/icons";
import { Skeleton, Tag, Divider, Button, notification } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDraggableScroll from "use-draggable-scroll";

import endpoints from "src/api/api";
import routes from "src/routes";
import { formatDatabaseDate } from "src/utils/formatDatabaseDate";
import { formatDrinkVolume } from "src/utils/formatDrinkVolume";
import { getAdditionalTagColor } from "src/utils/getAdditionalTagColor";

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

export function DrinkView() {
  const infoRef = useRef<HTMLDivElement>(null);

  const { onMouseDown } = useDraggableScroll(infoRef);

  const params = useParams();
  const navigation = useNavigate();

  const [drink, setDrink] = useState<DrinkType>({} as DrinkType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findDrink() {
      try {
        const drinkFound = await endpoints.findDrinkByUUID(params.uuid);
        setDrink(drinkFound);
      } catch (exception: any) {
        navigation(routes.HOME);

        notification.warn({
          message: "Visualização de Bebida",
          description: exception.message,
          duration: 2,
          placement: "bottomRight",
        });

        return;
      }

      setLoading(false);
    }

    if (loading) {
      findDrink();
    }
  }, [loading, params, navigation]);

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
            style={{ backgroundImage: `url(${drink.picture})` }}
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
                R$ {drink.price.toLocaleString("pt-BR")}
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

            <Button icon={<PlusOutlined />} type="primary">
              Adicionar ao Pedido
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
