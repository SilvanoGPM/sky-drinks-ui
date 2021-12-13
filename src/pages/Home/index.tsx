import { useEffect, useState } from "react";
import { CloseOutlined, EyeOutlined, MenuOutlined } from "@ant-design/icons";
import { Card, Image, Empty, notification } from "antd";

import { NavMenu } from "src/components/NavMenu";

import api from "src/api/api";

import styles from "./styles.module.scss";

import drinkPlaceholder from "src/assets/drink-placeholder.png";

type LatestDrinkType = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
};

const { Meta } = Card;

const drinkFake = { name: "Carregando...", price: 0 };
const latestDrinksFake = Array(5)
  .fill(drinkFake)
  .map((drink, uuid) => ({ ...drink, uuid }));

export function Home() {
  const [menuShow, setMenuShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latestDrinks, setLatestDrinks] =
    useState<LatestDrinkType[]>(latestDrinksFake);

  useEffect(() => {
    async function loadLatestDrinks() {
      try {
        const drinks = await api.getLatestDrinks();

        if (drinks.length === 0) {
          notification.warn({
            message: "Não existem drinks cadastrados!",
          });
        }

        setLatestDrinks(drinks);
      } catch (e: any) {
        notification.warn({
          message: e.message,
        });

        setLatestDrinks([]);
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadLatestDrinks();
    }
  }, [loading]);

  function switchMenu() {
    setMenuShow(!menuShow);
  }

  return (
    <div className={styles.container}>
      <NavMenu menuShow={menuShow} />

      <button
        onClick={switchMenu}
        className={`${styles.menuToggle} ${menuShow ? styles.active : ""}`}
      >
        {menuShow ? (
          <CloseOutlined style={{ fontSize: 20, color: "#e74c3c" }} />
        ) : (
          <MenuOutlined style={{ fontSize: 20 }} />
        )}
      </button>

      <div className={styles.drinksContainer}>
        <div className={`${styles.spacer} ${menuShow ? styles.active : ""}`} />

        <div className={styles.drinksInfo}>
          Total de Drinks: 3 Preço estimado: R$ 34,50
        </div>

        <div className={styles.latest}>
          <h2 className={styles.latestTitle}>Últimos Drinks Adicionados:</h2>

          {Boolean(latestDrinks.length) ? (
            <ul className={styles.latestDrinks}>
              {latestDrinks.map(({ uuid, name, picture, price }) => (
                <Card
                  key={uuid}
                  hoverable
                  loading={loading}
                  className={styles.latestDrinkCard}
                  actions={[<EyeOutlined key="view-drink" />]}
                  cover={
                    <Image
                      height={300}
                      width={loading ? "100%" : 260}
                      loading="lazy"
                      alt={`Drink - ${name}`}
                      src={loading ? drinkPlaceholder : picture}
                    />
                  }
                >
                  <Meta title={name} description={`Preço: R$ ${price}`} />
                </Card>
              ))}
            </ul>
          ) : (
            <Empty description="Sem drinks no momento!" />
          )}
        </div>
      </div>
    </div>
  );
}
