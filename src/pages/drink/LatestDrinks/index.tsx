import { useState, useEffect, useRef } from "react";
import { Empty } from "antd";
import useDraggableScroll from "use-draggable-scroll";

import { DrinkCard } from "../DrinkCard";
import { useTitle } from "src/hooks/useTitle";

import endpoints from "src/api/api";

import routes from "src/routes";
import { showNotification } from "src/utils/showNotification";
import { useFlashNotification } from "src/hooks/useFlashNotification";
import { handleError } from "src/utils/handleError";
import { DrinkType } from "src/types/drinks";

import styles from "./styles.module.scss";
import drinkPlaceholder from "src/assets/drink-placeholder.png";

const drinkFake = {
  name: "Carregando...",
  price: 0,
  picture: drinkPlaceholder,
};

const latestDrinksFake = Array(5)
  .fill(drinkFake)
  .map((drink, uuid) => ({ ...drink, uuid }));

export function LatestDrinks() {
  useTitle("SkyDrinks - Últimas bebidas adicionadas");

  const drinksRef = useRef<HTMLUListElement>(null);

  const { onMouseDown } = useDraggableScroll(drinksRef);

  const [loading, setLoading] = useState(true);
  const [latestDrinks, setLatestDrinks] =
    useState<DrinkType[]>(latestDrinksFake);

  useFlashNotification(routes.HOME);

  useEffect(() => {
    async function loadLatestDrinks() {
      try {
        const drinks = await endpoints.getLatestDrinks(5);

        if (drinks.length === 0) {
          showNotification({
            type: "warn",
            message: "Não existem drinks cadastrados!",
          });
        }

        setLatestDrinks(drinks);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível pegar as últimas bebidas",
        });

        setLatestDrinks([]);
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadLatestDrinks();
    }

    return () => {
      setLoading(false);
    };
  }, [loading]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Últimas bebidas adicionadas:</h2>

      {Boolean(latestDrinks.length) ? (
        <ul
          ref={drinksRef}
          onMouseDown={onMouseDown}
          className={styles.latestDrinks}
        >
          {latestDrinks.map((props) => (
            <DrinkCard
              {...props}
              key={props.uuid}
              width="50%"
              minWidth={260}
              imageHeight={260}
              loading={loading}
            />
          ))}
        </ul>
      ) : (
        <Empty description="Sem drinks no momento!" />
      )}
    </div>
  );
}
