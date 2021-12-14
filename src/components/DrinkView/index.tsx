import { PlusOutlined } from "@ant-design/icons";
import { Skeleton, Tag, Divider, Button, notification } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "src/api/api";
import routes from "src/routes";
import { chooseRandomColor } from "src/utils/chooseRandomColor";
import { formatDatabaseDate } from "src/utils/formatDatabaseDate";
import { formatDrinkVolume } from "src/utils/formatDrinkVolume";

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

const additionals = new Map<string, string>(
  Object.entries({
    gelo: "cyan",
    limao: "green",
    limão: "green",
    amora: "red",
    "amora vermelha": "red",
    "amora roxa": "purple",
    canela: "orange",
    blueberry: "geekblue",
  })
);

function getTagColor(additional: string) {
  return additionals.has(additional)
    ? additionals.get(additional)
    : chooseRandomColor();
}

export function DrinkView() {
  const params = useParams();
  const navigation = useNavigate();

  const [drink, setDrink] = useState<DrinkType>({} as DrinkType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findDrink() {
      try {
        const drinkFound = await api.findDrinkByUUID(params.uuid);
        setDrink(drinkFound);
      } catch (exception: any) {
        navigation(routes.HOME);

        notification.warn({
          message: 'Visualização de Drink',
          description: exception.message,
          duration: 2
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

          <div className={styles.info}>
            <h2>{drink.name}</h2>
            <p>
              A bebida foi adicionada em <span className={styles.bold}>{formatDatabaseDate(drink.createdAt)}.</span>
            </p>
            <p>{drink.description}</p>
            <p>
              Está bebida <span className={styles.bold}>{drink.alcoholic ? "contém" : "não contém"}</span>{" "}
              alcóol.
            </p>
            <p>
              A bebida contém <span className={styles.bold}>{formatDrinkVolume(drink.volume)}</span>
            </p>
            <p>
              Preço: <span className={styles.bold}>R$ {drink.price.toLocaleString("pt-BR")}</span>
            </p>

            <Divider orientation="left">Adicionais</Divider>

            <div className={styles.additional}>
              {drink.additionalList.map((additional) => (
                <Tag
                  color={getTagColor(additional)}
                  key={`Adicional - ${additional}`}
                >
                  {additional}
                </Tag>
              ))}
            </div>

            <Button icon={<PlusOutlined />} type="primary">Adicionar ao Pedido</Button>
          </div>
        </>
      )}
    </section>
  );
}
