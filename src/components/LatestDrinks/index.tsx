import { useState, useEffect, useRef } from "react";
import useDraggableScroll from "use-draggable-scroll";
import { Empty, notification } from "antd";

import endpoints from "src/api/api";

import styles from "./styles.module.scss";

import drinkPlaceholder from "src/assets/drink-placeholder.png";
import { DrinkCard } from "../DrinkCard";

type LatestDrinkType = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
};

const drinkFake = {
  name: "Carregando...",
  price: 0,
  picture: drinkPlaceholder,
};

const latestDrinksFake = Array(5)
  .fill(drinkFake)
  .map((drink, uuid) => ({ ...drink, uuid }));

export function LatestDrinks() {
  const drinksRef = useRef<HTMLUListElement>(null);

  const { onMouseDown } = useDraggableScroll(drinksRef);

  const [loading, setLoading] = useState(true);
  const [latestDrinks, setLatestDrinks] =
    useState<LatestDrinkType[]>(latestDrinksFake);

  useEffect(() => {
    async function loadLatestDrinks() {
      try {
        const drinks = await endpoints.getLatestDrinks(5);

        if (drinks.length === 0) {
          notification.warn({
            message: "Não existem drinks cadastrados!",
            placement: "bottomRight",
          });
        }

        setLatestDrinks(drinks);
      } catch (e: any) {
        notification.warn({
          message: "Últimas Bebidas",
          description: e.message,
          duration: 2,
          placement: "bottomRight",
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

  return (
    <div className={styles.latest}>
      <h2 className={styles.latestTitle}>Últimos Drinks Adicionados:</h2>

      {Boolean(latestDrinks.length) ? (
        <ul
          ref={drinksRef}
          onMouseDown={onMouseDown}
          className={styles.latestDrinks}
        >
          {latestDrinks.map((props) => (
            <DrinkCard {...props} key={props.uuid} width={260} height={300} loading={loading} />
          ))}
        </ul>
      ) : (
        <Empty description="Sem drinks no momento!" />
      )}
    </div>
  );
}
