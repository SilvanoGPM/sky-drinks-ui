import { useEffect, useState } from 'react';
import { Card, Col, Divider, Empty, Modal, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';

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
import { sum } from 'src/utils/sum';
import { Loading } from 'src/components/layout/Loading';

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

export function Statistics(): JSX.Element {
  const [loadingTopFive, setLoadingTopFive] = useState(true);
  const [topFiveDrinks, setTopFiveDrinks] = useState<TopDrinkType[]>([]);

  const [loadingTotalDrinks, setLoadingTotalDrinks] = useState(true);
  const [totalDrinks, setTotalDrinks] = useState<TotalDrinkType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getData(): Promise<void> {
      try {
        const data = await endpoints.getMyTopFiveDrinks();
        setTopFiveDrinks(data);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar as suas bebidas mais pedidas',
        });
      } finally {
        setLoadingTopFive(false);
      }
    }

    if (loadingTopFive) {
      getData();
    }
  }, [loadingTopFive]);

  useEffect(() => {
    async function getData(): Promise<void> {
      try {
        const data = await endpoints.getTotalOfDrinksGroupedByAlcoholic();
        setTotalDrinks(data);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar o seu total de bebidas',
        });
      } finally {
        setLoadingTotalDrinks(false);
      }
    }

    if (loadingTotalDrinks) {
      getData();
    }
  }, [loadingTotalDrinks]);

  useEffect(() => {
    return () => {
      setLoadingTopFive(false);
      setLoadingTotalDrinks(false);
    };
  }, []);

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

  function toTotal(n: TotalDrinkType): number {
    return n.total;
  }

  const hasRequests =
    Boolean(topFiveDrinks.length) && Boolean(totalDrinks.length);

  return (
    <>
      <Divider orientation="left" style={{ fontSize: '1.5rem' }}>
        Estatísticas
      </Divider>

      {hasRequests ? (
        <>
          <div className={styles.chart}>
            {loadingTopFive ? (
              <Loading />
            ) : (
              <Doughnut
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: 'Suas bebidas mais pedidas',
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

          <div className={styles.totalDrinks}>
            <h2>Total de bebidas</h2>

            {loadingTotalDrinks ? (
              <Loading />
            ) : (
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Total"
                      value={sum(totalDrinks, toTotal)}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8}>
                  <Card>
                    <Statistic
                      title="Não alcoólica"
                      value={sum(
                        totalDrinks.filter(({ alcoholic }) => !alcoholic),
                        toTotal
                      )}
                      valueStyle={{ color: '#2ecc71' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8}>
                  <Card>
                    <Statistic
                      title="Alcoólica"
                      value={sum(
                        totalDrinks.filter(({ alcoholic }) => alcoholic),
                        toTotal
                      )}
                      valueStyle={{ color: '#e74c3c' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </>
      ) : (
        <Empty description="Nenhum pedido foi realizado" />
      )}
    </>
  );
}
