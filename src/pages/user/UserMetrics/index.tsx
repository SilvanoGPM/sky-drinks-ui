import { Descriptions, Empty, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import { Doughnut } from "react-chartjs-2";

import styles from "./styles.module.scss";
import { handleError } from "src/utils/handleError";
import { isUUID } from "src/utils/isUUID";
import { showNotification } from "src/utils/showNotification";
import { Loading } from "src/components/layout/Loading";
import { formatDisplayRole } from "src/utils/formatDisplayRole";
import { getUserAge } from "src/utils/getUserAge";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { TopDrinkType } from "src/types/requests";
import { UserType } from "src/types/user";

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

export function UserMetrics() {
  const [topFiveDrinks, setTopFiveDrinks] = useState<TopDrinkType[]>([]);
  const [user, setUser] = useState<UserType>({} as UserType);

  const [topFiveLoading, setTopFiveLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const uuid = params.uuid || "";

    if (!isUUID(uuid)) {
      showNotification({
        type: "warn",
        message: "Código de usuário inválido!",
      });

      navigate(-1);
    }
  }, [params, navigate]);

  useEffect(() => {
    const uuid = params.uuid || "";

    async function getData() {
      try {
        const data = await endpoints.getUserTopDrinks(uuid);
        setTopFiveDrinks(data);
      } catch (error: any) {
        handleError({
          error,
          fallback:
            "Não foi possível carregar as bebidas mais pedidas do usuário",
        });
      } finally {
        setTopFiveLoading(false);
      }
    }

    if (topFiveLoading) {
      getData();
    }
  }, [topFiveLoading, params]);

  useEffect(() => {
    const uuid = params.uuid || "";

    async function loadUser() {
      try {
        const user = await endpoints.findUserByUUID(uuid);
        setUser(user);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível carregar as informações do usuário",
        });
      } finally {
        setUserLoading(false);
      }
    }

    if (userLoading) {
      loadUser();
    }
  }, [userLoading, params]);

  useEffect(() => {
    return () => {
      setTopFiveLoading(false);
      setUserLoading(false);
    };
  }, []);

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

  const hasRequests = Boolean(topFiveDrinks.length);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Métricas</h2>

      {userLoading ? (
        <Loading />
      ) : (
        <Descriptions
          title={<h3 className={styles.infoTitle}>Informações</h3>}
          bordered
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm:1, xs: 1 }}
        >
          <Descriptions.Item label="Nome">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Idade">{getUserAge(user.birthDay)} Anos</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="CPF">{user.cpf}</Descriptions.Item>
          <Descriptions.Item label="Cargo">
            {formatDisplayRole(user.role)}
          </Descriptions.Item>
          <Descriptions.Item label="Pedidos">{`${user.lockRequests ? `Bloqueados em ${formatDisplayDate(user.lockRequestsTimestamp)}` : "Não bloqueados"}`}</Descriptions.Item>
        </Descriptions>
      )}

      {hasRequests ? (
        <>
          <div className={styles.chart}>
            {topFiveLoading ? (
              <Loading />
            ) : (
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Bebidas mais pedidas",
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
        </>
      ) : (
        <Empty description="Nenhum pedido foi realizado" />
      )}
    </div>
  );
}
