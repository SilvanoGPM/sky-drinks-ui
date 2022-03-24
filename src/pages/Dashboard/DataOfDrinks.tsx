import { Bar } from 'react-chartjs-2';
import { Divider, Empty } from 'antd';
import { useQuery } from 'react-query';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipChartJS,
  Legend,
} from 'chart.js';

import endpoints from 'src/api/api';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';

import { handleError } from 'src/utils/handleError';
import { randomHotRGBColor, randomRGB } from 'src/utils/rgbUtils';

import styles from './styles.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TooltipChartJS,
  Legend
);

export function DataOfDrinks(): JSX.Element {
  const { isLoading, isError, error, data } = useQuery('dataOfDrinks', () =>
    endpoints.getDataOfDrinksInRequests(10)
  );

  if (isError) {
    handleError({
      error,
      fallback: 'Não foi possível carregar os dados das bebidas',
    });

    return <></>;
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const hasDataOfDrinks = Boolean(Object.values(data || []).flat().length);

  return hasDataOfDrinks ? (
    <div className={styles.dataOfDrinksContainer}>
      <Divider orientation="left" style={{ fontSize: '1.6rem' }}>
        Bebidas
      </Divider>

      <div className={styles.dataOfDrinks}>
        <Bar
          options={{
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Vezes pedida',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Nome da bebida',
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: 'Bebidas mais pedidas',
                font: { size: 20 },
              },
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
          data={{
            labels: data?.topDrinks.map(({ name }) => name),
            datasets: [
              {
                data: data?.topDrinks.map(({ total }) => total),
                backgroundColor: data?.topDrinks.map(randomRGB),
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
                  text: 'Vezes cancelada',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Nome da bebida',
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: 'Bebidas mais canceladas',
                font: { size: 20 },
              },
              legend: {
                display: false,
              },
            },
            responsive: true,
          }}
          data={{
            labels: data?.mostCanceled.map(({ name }) => name),
            datasets: [
              {
                data: data?.mostCanceled.map(({ total }) => total),
                backgroundColor: data?.topDrinks.map(randomHotRGBColor),
              },
            ],
          }}
        />
      </div>
    </div>
  ) : (
    <Empty
      style={{ marginTop: '2rem' }}
      description="Nenhuma bebida encontrada"
    />
  );
}
