import { useQuery } from 'react-query';
import { useContext } from 'react';
import { Space } from 'antd';

import {
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

import { useTitle } from 'src/hooks/useTitle';

import endpoints from 'src/api/api';

import routes from 'src/routes';
import { useFlashNotification } from 'src/hooks/useFlashNotification';
import { AuthContext } from 'src/contexts/AuthContext';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import { useStorage } from 'src/hooks/useStorage';

import { HorizontalList } from './HorizontalList';

import styles from './styles.module.scss';

export function DrinksInfo(): JSX.Element {
  useTitle('SkyDrinks - Ínicio');

  const { userInfo } = useContext(AuthContext);

  const { isUser } = getUserPermissions(userInfo.role);

  const latestDrinksQuery = useQuery('latestDrinks', () =>
    endpoints.getLatestDrinks(10)
  );

  const [playing, setPlaying] = useStorage<boolean>(
    '@SkyDrinks/HORIZONTAL_LIST_PLAYING',
    true
  );

  function mapTopDrinksToDrink(
    topDrinksFound: TopDrinkType[]
  ): Promise<DrinkType[]> {
    const topDrinksMapped = topDrinksFound.map(({ drinkUUID }) =>
      endpoints.findDrinkByUUID(drinkUUID)
    );

    return Promise.all(topDrinksMapped);
  }

  const topDrinksQuery = useQuery('topDrinks', async () => {
    const topDrinksFound = await endpoints.getTopDrinks(5);
    return mapTopDrinksToDrink(topDrinksFound);
  });

  const myTopDrinksQuery = useQuery(
    ['topDrinks', userInfo.uuid],
    async () => {
      const topDrinksFound = await endpoints.getMyTopFiveDrinks();
      return mapTopDrinksToDrink(topDrinksFound);
    },
    { enabled: isUser }
  );

  useFlashNotification(routes.HOME);

  return (
    <section className={styles.container}>
      <HorizontalList
        title={
          <Space align="center">
            <ClockCircleOutlined style={{ fontSize: '1.5rem' }} />
            <h3 className={styles.listTitle}>Últimas bebidas adicionadas:</h3>
          </Space>
        }
        emptyDescription="Nenhuma bebida foi adicionada recentemente"
        fallbackErrorMessage="Não foi possível carregar as últimas bebidas"
        isError={latestDrinksQuery.isError}
        error={latestDrinksQuery.error}
        drinks={latestDrinksQuery.data}
        loading={latestDrinksQuery.isLoading}
        playing={playing}
        setPlaying={setPlaying}
      />

      <HorizontalList
        title={
          <Space align="center">
            <FireOutlined style={{ fontSize: '1.5rem' }} />
            <h3 className={styles.listTitle}>Bebidas mais pedidas:</h3>
          </Space>
        }
        emptyDescription="Nenhuma bebida foi pedida recentemente"
        fallbackErrorMessage="Não foi possível carregas as bebidas mais pedidas"
        isError={topDrinksQuery.isError}
        error={topDrinksQuery.error}
        drinks={topDrinksQuery.data}
        loading={topDrinksQuery.isLoading}
        playing={playing}
        setPlaying={setPlaying}
      />

      {isUser && (
        <HorizontalList
          title={
            <Space align="center">
              <TrophyOutlined style={{ fontSize: '1.5rem' }} />
              <h3 className={styles.listTitle}>Suas bebidas mais pedidas:</h3>
            </Space>
          }
          emptyDescription="Você não pediu bebidas recentemente"
          fallbackErrorMessage="Não foi possível carregas as suas bebidas mais pedidas"
          isError={myTopDrinksQuery.isError}
          error={myTopDrinksQuery.error}
          drinks={myTopDrinksQuery.data}
          loading={myTopDrinksQuery.isLoading}
          playing={playing}
          setPlaying={setPlaying}
        />
      )}
    </section>
  );
}
