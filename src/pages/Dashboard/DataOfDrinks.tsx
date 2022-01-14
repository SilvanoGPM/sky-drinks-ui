import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Divider, Empty } from "antd";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipChartJS,
  Legend,
} from "chart.js";

import endpoints from "src/api/api";
import { Loading } from "src/components/layout/Loading";
import { DataOfDrinksType } from "src/types/requests";
import { handleError } from "src/utils/handleError";
import { randomHotRGBColor, randomRGB } from "src/utils/rgbUtils";

import styles from "./styles.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TooltipChartJS,
  Legend
);

export function DataOfDrinks() {
  const [loading, setLoading] = useState(true);
  const [dataOfDrinks, setDataOfDrinks] = useState<DataOfDrinksType>(
    {} as DataOfDrinksType
  );

  useEffect(() => {
    async function loadTopDrinks() {
      try {
        const dataOfDrinks = await endpoints.getDataOfDrinksInRequests(10);
        setDataOfDrinks(dataOfDrinks);
      } catch (error) {
        handleError({
          error,
          fallback: "Não foi possível carregar os dados das bebidas",
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadTopDrinks();
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const hasDataOfDrinks = Boolean(Object.values(dataOfDrinks).flat().length);

  if (loading) {
    return <Loading />;
  }

  return hasDataOfDrinks ? (
    <div className={styles.dataOfDrinksContainer}>
      <Divider orientation="left" style={{ fontSize: "1.6rem" }}>
        Bebidas
      </Divider>

      <div className={styles.dataOfDrinks}>
        <Bar
          options={{
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Vezes pedida",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Nome da bebida",
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Bebidas mais pedidas",
                font: { size: 20 },
              },
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
          data={{
            labels: dataOfDrinks.topDrinks.map(({ name }) => name),
            datasets: [
              {
                data: dataOfDrinks.topDrinks.map(({ total }) => total),
                backgroundColor: dataOfDrinks.topDrinks.map(randomRGB),
              },
            ],
          }}
        />
      </div>

      <div className={styles.dataOfDrinks}>
        <Bar
          options={{
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Vezes cancelada",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Nome da bebida",
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Bebidas mais canceladas",
                font: { size: 20 },
              },
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
          data={{
            labels: dataOfDrinks.mostCanceled.map(({ name }) => name),
            datasets: [
              {
                data: dataOfDrinks.mostCanceled.map(({ total }) => total),
                backgroundColor: dataOfDrinks.topDrinks.map(randomHotRGBColor),
              },
            ],
          }}
        />
      </div>
    </div>
  ) : (
    <Empty description="Nenhuma pedido encontrado" />
  );
}
