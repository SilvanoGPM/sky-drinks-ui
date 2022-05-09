import { useEffect } from 'react';
import { Avatar, Descriptions, Empty, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { useQuery } from 'react-query';

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { handleError } from 'src/utils/handleError';
import { isUUID } from 'src/utils/isUUID';
import { showNotification } from 'src/utils/showNotification';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';
import { formatDisplayRole } from 'src/utils/formatDisplayRole';
import { getUserAge } from 'src/utils/getUserAge';
import { formatDisplayDate } from 'src/utils/formatDatabaseDate';
import { getFirstCharOfString } from 'src/utils/getFirstCharOfString';

import styles from './styles.module.scss';

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

export function UserMetrics(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const uuid = params.uuid || '';

    if (!isUUID(uuid)) {
      showNotification({
        type: 'warn',
        message: 'Código de usuário inválido!',
      });

      navigate(-1);
    }
  }, [params, navigate]);

  const topDrinksQuery = useQuery(['topDrinks', params.uuid], () =>
    endpoints.getUserTopDrinks(params.uuid || '')
  );

  const userQuery = useQuery(['user', params.uuid], () =>
    endpoints.findUserByUUID(params.uuid || '')
  );

  function confirmNavigation(uuid: string): void {
    function onOk(): void {
      navigate(routes.VIEW_DRINK.replace(':uuid', uuid));
    }

    confirm({
      title: 'Visualizar bebida?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk,
    });
  }

  if (topDrinksQuery.isError) {
    handleError({
      error: topDrinksQuery.error,
      fallback: 'Não foi possível carregar as bebidas mais pedidas do usuário',
    });

    navigate(-1);
  }

  if (topDrinksQuery.isError) {
    handleError({
      error: userQuery.error,
      fallback: 'Não foi possível carregar as informações do usuário',
    });

    navigate(-1);
  }

  const hasRequests = Boolean(topDrinksQuery.data?.length);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Métricas</h2>

      {userQuery.isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <div className={styles.userImage}>
            <Avatar
              size={50}
              src={endpoints.getUserImage(userQuery.data?.uuid || '')}
            >
              {getFirstCharOfString(userQuery.data?.name || '')}
            </Avatar>
          </div>

          <Descriptions
            title={<h3 className={styles.infoTitle}>Informações</h3>}
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Nome">
              {userQuery.data?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Idade">
              {getUserAge(userQuery.data?.birthDay || '')} Anos
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {userQuery.data?.email}
            </Descriptions.Item>
            <Descriptions.Item label="CPF">
              {userQuery.data?.cpf}
            </Descriptions.Item>
            <Descriptions.Item label="Cargo">
              {formatDisplayRole(userQuery.data?.role)}
            </Descriptions.Item>
            <Descriptions.Item label="Pedidos">{`${
              userQuery.data?.lockRequests
                ? `Bloqueados em ${formatDisplayDate(
                    userQuery.data?.lockRequestsTimestamp
                  )}`
                : 'Não bloqueados'
            }`}</Descriptions.Item>
          </Descriptions>
        </>
      )}

      {hasRequests ? (
        <div className={styles.chart}>
          {topDrinksQuery.isLoading ? (
            <LoadingIndicator />
          ) : (
            <Doughnut
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Bebidas mais pedidas',
                    font: { size: 20 },
                  },
                },
                responsive: true,
                rotation: 180,
                onClick: (_, element) => {
                  if (element.length > 0) {
                    const { index } = element[0];
                    const item: any = topDrinksQuery.data?.[index];

                    confirmNavigation(item.drinkUUID);
                  }
                },
              }}
              data={{
                labels: topDrinksQuery.data?.map(({ name }) => name),
                datasets: [
                  {
                    data: topDrinksQuery.data?.map(({ total }) => total),
                    backgroundColor: [
                      'rgba(0, 148, 50, 0.3)',
                      'rgba(196, 229, 56, 0.3)',
                      'rgba(255, 195, 18, 0.3)',
                      'rgba(247, 159, 31, 0.3)',
                      'rgba(234, 32, 39, 0.3)',
                    ],
                    borderColor: [
                      'rgb(0, 148, 50)',
                      'rgb(196, 229, 56)',
                      'rgb(255, 195, 18)',
                      'rgb(247, 159, 31)',
                      'rgb(234, 32, 39)',
                    ],
                  },
                ],
              }}
            />
          )}
        </div>
      ) : (
        <Empty
          style={{ marginTop: '2rem' }}
          description="Nenhum pedido foi realizado"
        />
      )}
    </section>
  );
}
