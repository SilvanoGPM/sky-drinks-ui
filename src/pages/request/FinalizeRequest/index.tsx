import { Button, Modal } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { InputNumberSpinner } from 'src/components/custom/InputNumberSpinner';
import { AuthContext } from 'src/contexts/AuthContext';
import { RequestContext } from 'src/contexts/RequestContext';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { getDrinksGroupedByUUID } from 'src/utils/getDrinksGroupedByUUID';
import { handleError } from 'src/utils/handleError';
import { showNotification } from 'src/utils/showNotification';
import { isUUID } from 'src/utils/isUUID';
import { useTitle } from 'src/hooks/useTitle';

import { FetchTables } from './FetchTables';

import styles from './styles.module.scss';

const { confirm } = Modal;

export function FinalizeRequest(): JSX.Element {
  useTitle('SkyDrinks - Finalizar Pedido');

  const { userInfo } = useContext(AuthContext);

  const { request, setRequest, clearRequest, changeTable } =
    useContext(RequestContext);

  const [loading, setLoading] = useState(false);
  const [allBlocked, setAllBlocked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (request.drinks.length === 0) {
      navigate(routes.HOME, {
        state: {
          info: { message: 'O pedido precisa conter pelo menos uma bebida' },
        },
      });
    }
  }, [request, navigate]);

  useEffect(() => {
    async function loadAllBlocked(): Promise<void> {
      try {
        const allBlockedFound = await endpoints.getAllBlocked();

        setAllBlocked(allBlockedFound);
      } catch (exception: any) {
        handleError(exception);
      }
    }

    loadAllBlocked();
  }, []);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  function requestGroupedToArray(requestGrouped: RequestGrouped): DrinkType[] {
    return Object.keys(requestGrouped).reduce((arr, key) => {
      return [...arr, ...requestGrouped[key]];
    }, [] as DrinkType[]);
  }

  async function createRequest(): Promise<void> {
    try {
      setLoading(true);

      const { uuid } = await endpoints.createRequest(request);

      navigate(`/${routes.REQUEST_CREATED}`, { state: { uuid } });

      clearRequest();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        const regex = /Bebida com id: ([\w-]*), não foi encontrada\./gm;
        const message = error.response?.data?.details;

        const values = regex.exec(message);

        if (values && isUUID(values[1])) {
          const uuid = values[1];

          const drinks = request.drinks.filter((drink) => drink.uuid !== uuid);

          setRequest({ ...request, drinks });

          showNotification({
            type: 'info',
            message: 'Bebida removida do pedido',
            description:
              'No seu pedido, havia uma bebida que foi removida do nosso servidor, ou que não foi encontrada, então removemos ela. Tente realizar o pedido novamente',
          });

          return;
        }
      }

      handleError({
        error,
        fallback: 'Não foi possível finalizar o pedido',
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCreateRequest(): void {
    if (userInfo.lockRequests) {
      showNotification({
        type: 'info',
        message: 'Seus pedidos foram temporariamente desabilitados',
      });

      return;
    }

    confirm({
      type: 'success',
      title: 'Realmente deseja realizar o pedido?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: createRequest,
    });
  }

  const drinksGrouped = getDrinksGroupedByUUID(request);

  const lockFinishRequestsMessage = userInfo.lockRequests
    ? 'Seus pedidos foram temporariamente bloqueados.'
    : allBlocked
    ? 'Todos os pedidos foram temporariamente bloqueados.'
    : '';

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>Finalizar Pedido</h2>
      </div>

      <div>
        {Object.keys(drinksGrouped).map((key) => {
          const [drink] = drinksGrouped[key];
          const { length } = drinksGrouped[key];

          const { picture, name, price } = drink;

          function beforeDecrement(value: number, decrement: () => void): void {
            if (value === 1) {
              confirm({
                title: 'Deseja remover esta bebida?',
                okText: 'Sim',
                cancelText: 'Não',
                onOk: decrement,
              });
            } else {
              decrement();
            }
          }

          function handleIncrement(): void {
            setRequest({ ...request, drinks: [...request.drinks, drink] });
          }

          function handleDecrement(): void {
            const [, ...drinks] = drinksGrouped[key];
            setRequest({
              ...request,
              drinks: requestGroupedToArray({
                ...drinksGrouped,
                [key]: drinks,
              }),
            });
          }

          return (
            <div title={name} key={key} className={styles.drink}>
              <div className={styles.info}>
                <Link to={routes.VIEW_DRINK.replace(':uuid', key)}>
                  <p className={styles.name}>{name}</p>
                </Link>
                <p className={styles.price}>
                  {formatDisplayPrice(price * length)}
                </p>
                <InputNumberSpinner
                  initialValue={length}
                  decrementChildren={
                    length === 1 ? (
                      <CloseOutlined style={{ color: '#e74c3c' }} />
                    ) : (
                      <MinusOutlined />
                    )
                  }
                  incrementChildren={<PlusOutlined />}
                  beforeDecrement={beforeDecrement}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />
              </div>

              <figure>
                <img src={picture} alt={name} />
              </figure>
            </div>
          );
        })}
      </div>

      <div className={styles.table}>
        <p>Mesa em que você se encontra:</p>
        <FetchTables defaultTable={request.table} onChange={changeTable} />
      </div>

      <div className={styles.warnMessage}>
        <p className={styles.bold}>Atenção:</p>
        <p className={styles.italic}>
          Você pode pedir os adicionais na hora de pegar o pedido.
        </p>

        {Boolean(lockFinishRequestsMessage) && (
          <p className={styles.lockRequests}>{lockFinishRequestsMessage}</p>
        )}
      </div>

      <div>
        <Button
          style={{ width: '100%' }}
          disabled={userInfo.lockRequests || allBlocked}
          onClick={handleCreateRequest}
          size="large"
          type="primary"
          icon={<ShoppingCartOutlined />}
          loading={loading}
        >
          Finalizar Pedido
        </Button>
      </div>
    </section>
  );
}
