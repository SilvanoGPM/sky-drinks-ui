import {
  CheckOutlined,
  CloseOutlined,
  LockOutlined,
  ReloadOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Empty, Modal, Pagination, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import endpoints from "src/api/api";
import { WebSocketContext } from "src/contexts/WebSocketContext";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { RequestPaginatedType } from "src/types/requests";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { handleError } from "src/utils/handleError";
import { imageToFullURI } from "src/utils/imageUtils";
import { pluralize } from "src/utils/pluralize";
import { showNotification } from "src/utils/showNotification";
import styles from "./styles.module.scss";

const { confirm } = Modal;

export function ManageRequest() {
  useTitle("SkyDrinks - Gerenciar pedidos");

  const { updateRequests, setUpdateRequests } = useContext(WebSocketContext);

  const [loading, setLoading] = useState(true);
  const [allBlocked, setAllBlocked] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 9,
  });

  const [data, setData] = useState<RequestPaginatedType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await endpoints.getProcessingRequests(
          pagination.page,
          pagination.size
        );

        setData(data);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível carregar pedidos",
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

  useEffect(() => {
    async function loadAllBlocked() {
      try {
        const allBlocked = await endpoints.getAllBlocked();

        setAllBlocked(allBlocked);
      } catch {
        showNotification({
          type: "warn",
          message:
            "Não foi possível verificar se todos os pedidos estão bloqueados",
        });
      }
    }

    loadAllBlocked();
  }, []);

  function removeRequestOfState(uuid: string) {
    const content = data.content.filter((item) => item.uuid !== uuid);

    if (content.length > 0) {
      setData({ ...data, content });
    } else if (pagination.page > 0) {
      setPagination({ ...pagination, page: pagination.page - 1 });
      setLoading(true);
    }
  }

  function handleCancelRequest(uuid: string) {
    async function cancelRequest() {
      try {
        await endpoints.cancelRequest(uuid);

        removeRequestOfState(uuid);

        showNotification({
          type: "success",
          message: "Pedido foi cancelado com sucesso!",
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível cancelar pedido",
        });
      }
    }

    return () => {
      confirm({
        title: "Deseja cancelar o pedido?",
        content: "Depois de cancelado, o pedido não poderá ser finalizado!",
        okText: "Sim",
        cancelText: "Não",
        onOk: cancelRequest,
      });
    };
  }

  function handlePaginationChange(page: number) {
    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });

    setLoading(true);
  }

  function handleFinishRequest(uuid: string) {
    async function finishRequest() {
      try {
        await endpoints.finishRequest(uuid);

        removeRequestOfState(uuid);

        showNotification({
          type: "success",
          message: "Pedido foi finalizado com sucesso!",
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível finalizar pedido",
        });
      }
    }

    return () => {
      confirm({
        title: "Deseja finlizar o pedido?",
        content: "Depois de finalizado, o pedido não poderá ser cancelado!",
        okText: "Sim",
        cancelText: "Não",
        onOk: finishRequest,
      });
    };
  }

  function reloadRequests() {
    setLoading(true);
  }

  async function toggleBlockAllRequests() {
    try {
      const allBlocked = await endpoints.toggleBlockAllRequests();
      setAllBlocked(allBlocked);
    } catch {
      showNotification({
        type: "warn",
        message:
          "Não foi possível alternar se todos os pedidos estão bloqueados",
      });
    }
  }

  function handleBlockAllRequests() {
    const title = allBlocked
      ? "Desbloquear todos os pedidos"
      : "Bloquear todos os pedidos";
    const okText = allBlocked ? "Desbloquear" : "Bloquear";
    const icon = allBlocked ? <UnlockOutlined /> : <LockOutlined />;

    confirm({
      title,
      okText,
      icon,
      cancelText: "Cancelar",
      onOk: toggleBlockAllRequests,
    });
  }

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Gerenciar Pedidos</h2>
      </div>

      {Boolean(data.content.length) ? (
        <>
          <ul className={styles.cardContainer}>
            {data.content.map(({ uuid, user, totalPrice, drinks }) => {
              const drinksSize = drinks.length;
              const picture = imageToFullURI(drinks[0].picture);

              return (
                <li key={uuid}>
                  <div className={styles.card}>
                    <div className={styles.cardContent}>
                      <Link
                        to={`/${routes.VIEW_REQUEST.replace(":uuid", uuid)}`}
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
                            "bebida",
                            "bebidas"
                          )}`}
                        </p>

                        <div className={styles.cardActions}>
                          <Tooltip title="Finalizar pedido">
                            <Button
                              onClick={handleFinishRequest(uuid)}
                              shape="round"
                              icon={
                                <CheckOutlined style={{ color: "#2ecc71" }} />
                              }
                            />
                          </Tooltip>

                          <Tooltip title="Cancelar pedido">
                            <Button
                              onClick={handleCancelRequest(uuid)}
                              shape="round"
                              icon={
                                <CloseOutlined style={{ color: "#e74c3c" }} />
                              }
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
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

      <div className={styles.blockRequests}>
        <p>
          {allBlocked
            ? "Todos os pedidos estão bloqueados!"
            : "Todos os pedidos estão desbloqueados!"}
        </p>

        <div className={styles.fullButton}>
          <Button
            onClick={handleBlockAllRequests}
            type="dashed"
            icon={allBlocked ? <UnlockOutlined /> : <LockOutlined />}
          >
            {allBlocked ? "Desbloquear pedidos" : "Bloquear pedidos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
