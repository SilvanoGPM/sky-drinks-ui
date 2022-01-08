import { Divider, Empty, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "src/api/api";
import routes from "src/routes";

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

import styles from "./styles.module.scss";

type TopFiveDrinkType = {
  drinkUUID: string;
  name: string;
  total: number;
};

type TotalDrinkType = {
  alcoholic: boolean;
  total: number;
};

ChartJS.register(
  ArcElement,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const { confirm } = Modal;

export function Statistics() {
  const [loadingTopFive, setLoadingTopFive] = useState(true);
  const [topFiveDrinks, setTopFiveDrinks] = useState<TopFiveDrinkType[]>([]);

  const [loadingTotalDrinks, setLoadingTotalDrinks] = useState(true);
  const [totalDrinks, setTotalDrinks] = useState<TotalDrinkType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const data = await endpoints.getMyTopFiveDrinks();

      setTopFiveDrinks(data);
      setLoadingTopFive(false);
    }

    if (loadingTopFive) {
      getData();
    }
  }, [loadingTopFive]);

  useEffect(() => {
    async function getData() {
      const data = await endpoints.getTotalOfDrinksGroupedByAlcoholic();

      setTotalDrinks(data);
      setLoadingTotalDrinks(false);
    }

    if (loadingTotalDrinks) {
      getData();
    }
  }, [loadingTotalDrinks]);

  function confirmNavigation(uuid: string) {
    function onOk() {
      navigate(routes.VIEW_DRINK.replace(":uuid", uuid));
    }

    confirm({
      title: "Visualizar bebida?",
      okText: "Sim",
      cancelText: "Não",
      onOk,
    });
  }

  const hasRequests =
    Boolean(topFiveDrinks.length) && Boolean(totalDrinks.length);

  return (
    <>
      <Divider orientation="left" style={{ fontSize: "1.5rem" }}>
        Estatísticas
      </Divider>

      {hasRequests ? (
        <>
          <div className={styles.chart}>
            {loadingTopFive ? (
              <Spin />
            ) : (
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Suas bebidas mais pedidas",
                      font: { size: 20 },
                    },
                  },
                  responsive: true,
                  rotation: 180,
                  onClick: (_, element) => {
                    if (element.length > 0) {
                      const { index } = element[0];
                      const item: any = topFiveDrinks[index];

                      confirmNavigation(item.drinkUUID);
                    }
                  },
                }}
                data={{
                  labels: topFiveDrinks.map(({ name }) => name),
                  datasets: [
                    {
                      data: topFiveDrinks.map(({ total }) => total),
                      backgroundColor: [
                        "rgba(0, 148, 50, 0.3)",
                        "rgba(196, 229, 56, 0.3)",
                        "rgba(255, 195, 18, 0.3)",
                        "rgba(247, 159, 31, 0.3)",
                        "rgba(234, 32, 39, 0.3)",
                      ],
                      borderColor: [
                        "rgb(0, 148, 50)",
                        "rgb(196, 229, 56)",
                        "rgb(255, 195, 18)",
                        "rgb(247, 159, 31)",
                        "rgb(234, 32, 39)",
                      ],
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className={styles.chart}>
            {loadingTopFive ? (
              <Spin />
            ) : (
              <Bar
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: true,
                      text: "Total de bebidas pedidas",
                      font: { size: 20 },
                    },
                  },
                }}
                data={{
                  labels: totalDrinks.map(({ alcoholic }) =>
                    alcoholic ? "Alcoólico" : "Não alcoólico"
                  ),
                  datasets: [
                    {
                      data: totalDrinks.map(({ total }) => total),
                      backgroundColor: totalDrinks.map(({ alcoholic }) =>
                        alcoholic ? "#e74c3c" : "#2ecc71"
                      ),
                    },
                  ],
                }}
              />
            )}
          </div>
        </>
      ) : (
        <Empty description="Nenhum pedido foi realizado" />
      )}
    </>
  );
}
