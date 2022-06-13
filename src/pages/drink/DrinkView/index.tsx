import { useState, useEffect, useRef, useContext } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Skeleton, Tag, Divider, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import useDraggableScroll from 'use-draggable-scroll';
import { animated, useSpring } from 'react-spring';
import { blue } from '@ant-design/colors';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { useTitle } from 'src/hooks/useTitle';
import { showNotification } from 'src/utils/showNotification';
import { RequestContext } from 'src/contexts/RequestContext';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { isUUID } from 'src/utils/isUUID';
import { AuthContext } from 'src/contexts/AuthContext';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import { handleError } from 'src/utils/handleError';
import { formatDatabaseDate } from 'src/utils/formatDatabaseDate';
import { formatDrinkVolume } from 'src/utils/formatDrinkVolume';
import { getAdditionalTagColor } from 'src/utils/getAdditionalTagColor';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';

import drinkPlaceholder from 'src/assets/drink-placeholder.png';
import styles from './styles.module.scss';

export function DrinkView(): JSX.Element {
  useTitle('SkyDrinks - Visualizar bebida');

  const { userInfo } = useContext(AuthContext);
  const { addDrink, request } = useContext(RequestContext);

  const infoRef = useRef<HTMLDivElement>(null);

  const { onMouseDown } = useDraggableScroll(infoRef);

  const params = useParams();
  const navigate = useNavigate();

  const [drink, setDrink] = useState<DrinkType>({} as DrinkType);
  const [loading, setLoading] = useState(true);

  const imageProps = useSpring({
    to: { translateX: 0, opacity: 1 },
    from: { translateX: -300, opacity: 0.1 },
  });

  const infoProps = useSpring({
    to: { translateX: 0, opacity: 1 },
    from: { translateX: 300, opacity: 0.1 },
  });

  useEffect(() => {
    async function findDrink(): Promise<void> {
      const uuid = params.uuid || '';

      if (isUUID(uuid)) {
        try {
          const drinkFound = await endpoints.findDrinkByUUID(uuid);
          setDrink(drinkFound);
        } catch (error: any) {
          handleError({ error, fallback: 'Não foi possível encontrar bebida' });

          navigate(routes.HOME);
        } finally {
          setLoading(false);
        }
      } else {
        navigate(routes.HOME);

        showNotification({
          type: 'warn',
          message: 'Insira um código de uma bebida válida!',
        });
      }
    }

    if (loading) {
      findDrink();
    }
  }, [loading, params, navigate]);

  function addDrinkToRequest(): void {
    addDrink(drink);
  }

  const picture =
    drink.picture && !drink.picture.endsWith('null')
      ? drink.picture
      : drinkPlaceholder;

  const permissions = getUserPermissions(userInfo.role);

  const totalOfDrinks = request.drinks.filter(
    (innerDrink) => drink.uuid === innerDrink.uuid
  ).length;

  return (
    <section className={styles.container}>
      {loading ? (
        <>
          <LoadingIndicator />

          <div style={{ margin: 'auto' }}>
            <Skeleton.Image
              style={{ maxWidth: '700px', width: '60vw', height: '100vh' }}
            />
            <Skeleton title paragraph loading={loading} />
          </div>
        </>
      ) : (
        <>
          <animated.div
            style={{ ...imageProps, backgroundImage: `url(${picture})` }}
            className={styles.image}
          />

          <animated.div
            ref={infoRef}
            role="button"
            tabIndex={0}
            onMouseDown={onMouseDown}
            style={infoProps}
            className={styles.info}
          >
            <h2>{drink.name}</h2>
            <p>
              A bebida foi adicionada em{' '}
              <span className={styles.bold}>
                {formatDatabaseDate(drink.createdAt)}.
              </span>
            </p>
            <p>{drink.description}</p>
            <p>
              Está bebida{' '}
              <span className={styles.bold}>
                {drink.alcoholic ? 'contém' : 'não contém'}
              </span>{' '}
              alcóol.
            </p>
            <p>
              A bebida contém{' '}
              <span className={styles.bold}>
                {formatDrinkVolume(drink.volume)}
              </span>
            </p>
            <p>
              Preço:{' '}
              <span className={styles.bold}>
                {formatDisplayPrice(drink.price)}
              </span>
            </p>

            {drink.additionalList.length ? (
              <>
                <Divider orientation="left">Adicionais</Divider>

                <div className={styles.additional}>
                  {drink.additionalList.map((additional) => (
                    <Tag
                      color={getAdditionalTagColor(additional)}
                      key={`Adicional - ${additional}`}
                    >
                      {additional}
                    </Tag>
                  ))}
                </div>
              </>
            ) : (
              <p>
                <span className={`${styles.italic} ${styles.bold}`}>
                  Não contém
                </span>{' '}
                adicionais
              </p>
            )}

            <div className={styles.addButtonContainer}>
              <Button
                onClick={addDrinkToRequest}
                icon={<PlusOutlined />}
                disabled={!permissions.isUser}
                type="primary"
              >
                Adicionar ao Pedido
                <span className={styles.totalOfDrinks}>{totalOfDrinks}</span>
              </Button>
            </div>
          </animated.div>
        </>
      )}
    </section>
  );
}
