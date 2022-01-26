import { useState, useEffect, useRef } from 'react';
import { Empty } from 'antd';
import useDraggableScroll from 'use-draggable-scroll';

import { useTitle } from 'src/hooks/useTitle';

import endpoints from 'src/api/api';

import routes from 'src/routes';
import { showNotification } from 'src/utils/showNotification';
import { useFlashNotification } from 'src/hooks/useFlashNotification';
import { handleError } from 'src/utils/handleError';

import { LoadingIndicator } from 'src/components/other/LoadingIndicator';
import { DrinkCard } from '../components/DrinkCard';

import styles from './styles.module.scss';

export function LatestDrinks(): JSX.Element {
  useTitle('SkyDrinks - Últimas bebidas adicionadas');

  const drinksRef = useRef<HTMLUListElement>(null);

  const { onMouseDown } = useDraggableScroll(drinksRef);

  const [loading, setLoading] = useState(true);
  const [latestDrinks, setLatestDrinks] = useState<DrinkType[]>([]);

  useFlashNotification(routes.HOME);

  useEffect(() => {
    async function loadLatestDrinks(): Promise<void> {
      try {
        const drinks = await endpoints.getLatestDrinks(5);

        if (drinks.length === 0) {
          showNotification({
            type: 'warn',
            message: 'Não existem drinks cadastrados!',
          });
        }

        setLatestDrinks(drinks);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível pegar as últimas bebidas',
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

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Últimas bebidas adicionadas:</h2>

      {loading ? (
        <LoadingIndicator />
      ) : latestDrinks.length ? (
        <ul
          role="listbox"
          ref={drinksRef}
          onMouseDown={onMouseDown}
          className={styles.latestDrinks}
        >
          {latestDrinks.map((props: DrinkType) => (
            <DrinkCard
              key={props.uuid}
              width="50%"
              minWidth={260}
              imageHeight={260}
              loading={loading}
              {...props}
            />
          ))}
        </ul>
      ) : (
        <Empty description="Sem drinks no momento!" />
      )}
    </section>
  );
}
