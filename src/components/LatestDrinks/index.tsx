import { useState, useEffect, useRef } from "react";
import useDraggableScroll from 'use-draggable-scroll';
import { EyeOutlined } from "@ant-design/icons";
import { Card, Image, Empty, Tooltip, notification } from "antd";

import api from "src/api/api";

import styles from "./styles.module.scss";

import drinkPlaceholder from "src/assets/drink-placeholder.png";

type LatestDrinkType = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
};

type RenderCoverProps = {
  name: string;
  picture: string;
};

const { Meta } = Card;

const CARD_WIDTH = 260;

const drinkFake = {
  name: "Carregando...",
  price: 0,
  picture: drinkPlaceholder,
};

const latestDrinksFake = Array(5)
  .fill(drinkFake)
  .map((drink, uuid) => ({ ...drink, uuid }));

function renderCover({ name, picture }: RenderCoverProps) {
  return (
    <Image
      height={300}
      width={CARD_WIDTH}
      alt={`Drink - ${name}`}
      src={picture}
    />
  );
}

export function LatestDrinks() {
  const drinksRef = useRef<HTMLUListElement>(null);

  const [loading, setLoading] = useState(true);
  const [latestDrinks, setLatestDrinks] =
    useState<LatestDrinkType[]>(latestDrinksFake);

  useEffect(() => {
    async function loadLatestDrinks() {
      try {
        const drinks = await api.getLatestDrinks(5);

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

  const { onMouseDown } = useDraggableScroll(drinksRef);

  return (
    <div className={styles.latest}>
      <h2 className={styles.latestTitle}>Últimos Drinks Adicionados:</h2>

      {Boolean(latestDrinks.length) ? (
        <ul ref={drinksRef} onMouseDown={onMouseDown} className={styles.latestDrinks}>
          {latestDrinks.map(({ uuid, name, picture, price }) => (
            <Tooltip
              key={uuid}
              mouseEnterDelay={1}
              placement="rightTop"
              arrowPointAtCenter
              title={name}
            >
              <Card
                hoverable
                className={styles.latestDrinkCard}
                actions={[<EyeOutlined key="view-drink" />]}
                cover={renderCover({ name, picture })}
                loading={loading}
              >
                <Meta title={name} description={`Preço: R$ ${price}`} />
              </Card>
            </Tooltip>
          ))}
        </ul>
      ) : (
        <Empty description="Sem drinks no momento!" />
      )}
    </div>
  );
}
