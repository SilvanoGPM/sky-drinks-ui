import { useContext, useEffect, useState } from 'react';
import { Button, Empty, Modal, Pagination, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { useTransition, animated, config } from 'react-spring';

import {
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { WebSocketContext } from 'src/contexts/WebSocketContext';
import { useTitle } from 'src/hooks/useTitle';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { handleError } from 'src/utils/handleError';
import { drinkImageToFullURI } from 'src/utils/imageUtils';
import { pluralize } from 'src/utils/pluralize';
import { showNotification } from 'src/utils/showNotification';

import styles from './styles.module.scss';

const INITIAL_DATA = {
  totalElements: 0,
  content: [],
};

const { confirm } = Modal;

export function ManageRequest(): JSX.Element {
  useTitle('SkyDrinks - Gerenciar pedidos');

  const { updateRequests, setUpdateRequests } = useContext(WebSocketContext);

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState<PaginationType>({
    page: 0,
    size: 9,
  });

  const [data, setData] = useState<RequestPaginatedType>(INITIAL_DATA);

  const transitions = useTransition(data.content, {
    keys: (item) => item.uuid,
    trail: 100,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    config: config.stiff,
  });

  useEffect(() => {
    async function loadRequests(): Promise<void> {
      try {
        const dataFound = await endpoints.getProcessingRequests(
          pagination.page,
          pagination.size
        );

        setData(dataFound);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar pedidos',
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadRequests();
    }
  }, [loading, pagination]);

  useEffect(() => {
    if (updateRequests) {
      setUpdateRequests(false);
      setLoading(true);
    }
  }, [updateRequests, pagination, setUpdateRequests]);

  function removeRequestOfState(uuid: string): void {
    const content = data.content.filter((item) => item.uuid !== uuid);

    setData({ ...data, content });

    if (pagination.page > 0 && content.length === 0) {
      setPagination({ ...pagination, page: pagination.page - 1 });
      setLoading(true);
    }
  }

  function handleCancelRequest(uuid: string): () => void {
    async function cancelRequest(): Promise<void> {
      try {
        await endpoints.cancelRequest(uuid);

        removeRequestOfState(uuid);

        showNotification({
          type: 'success',
          message: 'Pedido foi cancelado com sucesso!',
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível cancelar pedido',
        });
      }
    }

    return () => {
      confirm({
        title: 'Deseja cancelar o pedido?',
        content: 'Depois de cancelado, o pedido não poderá ser finalizado!',
        okText: 'Sim',
        cancelText: 'Não',
        onOk: cancelRequest,
      });
    };
  }

  function handlePaginationChange(page: number): void {
    setData({ ...INITIAL_DATA });

    setPagination((oldPagination) => {
      return { ...oldPagination, page: page - 1 };
    });

    setLoading(true);
  }

  function handleFinishRequest(uuid: string): () => void {
    async function finishRequest(): Promise<void> {
      try {
        await endpoints.finishRequest(uuid);

        removeRequestOfState(uuid);

        showNotification({
          type: 'success',
          message: 'Pedido foi finalizado com sucesso!',
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível finalizar pedido',
        });
      }
    }

    return () => {
      confirm({
        title: 'Deseja finlizar o pedido?',
        content: 'Depois de finalizado, o pedido não poderá ser cancelado!',
        okText: 'Sim',
        cancelText: 'Não',
        onOk: finishRequest,
      });
    };
  }

  function reloadRequests(): void {
    setLoading(true);
  }

  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Gerenciar Pedidos</h2>
      </div>

      {data.content.length ? (
        <>
          <ul className={styles.cardContainer}>
            {transitions(({ opacity }, { uuid, user, totalPrice, drinks }) => {
              const drinksSize = drinks.length;
              const picture = drinkImageToFullURI(drinks[0].picture);

              return (
                <animated.li style={{ opacity }}>
                  <div className={styles.card}>
                    <div className={styles.cardContent}>
                      <Link
                        to={`/${routes.VIEW_REQUEST.replace(':uuid', uuid)}`}
                      >
                        <figure className={styles.cardFigure}>
                          <img alt={`Request de id ${uuid}`} src={picture} />
                        </figure>
                      </Link>

                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardTitle}>
                          Preço: {formatDisplayPrice(totalPrice)}
                        </h3>

                        <p className={styles.cardText}>Usuário: {user?.name}</p>

                        <p className={styles.cardText}>
                          {`${drinksSize} ${pluralize(
                            drinksSize,
                            'bebida',
                            'bebidas'
                          )}`}
                        </p>

                        <div className={styles.cardActions}>
                          <Tooltip title="Finalizar pedido">
                            <Button
                              onClick={handleFinishRequest(uuid)}
                              shape="round"
                              icon={
                                <CheckOutlined style={{ color: '#2ecc71' }} />
                              }
                            />
                          </Tooltip>

                          <Tooltip title="Cancelar pedido">
                            <Button
                              onClick={handleCancelRequest(uuid)}
                              shape="round"
                              icon={
                                <CloseOutlined style={{ color: '#e74c3c' }} />
                              }
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </animated.li>
              );
            })}
          </ul>

          <div className={styles.bottomButton}>
            <Tooltip title="Recarrega os pedidos" placement="left">
              <Button
                style={{ minWidth: 50, minHeight: 50 }}
                onClick={reloadRequests}
                shape="circle"
                type="primary"
                icon={<ReloadOutlined style={{ fontSize: 25 }} />}
              />
            </Tooltip>
          </div>

          <div className={styles.paginationContainer}>
            <Pagination
              pageSize={pagination.size}
              current={pagination.page + 1}
              total={data.totalElements}
              hideOnSinglePage
              onChange={handlePaginationChange}
              responsive
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="Nenhum pedido para gerenciar" />
      )}
    </section>
  );
}
