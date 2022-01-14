import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Modal } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import endpoints from "src/api/api";
import { Loading } from "src/components/layout/Loading";
import { QRCodeGenerator } from "src/components/other/QRCodeGenerator";
import { AuthContext } from "src/contexts/AuthContext";
import { WebSocketContext } from "src/contexts/WebSocketContext";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { RequestStatusType, RequestType } from "src/types/requests";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";
import { getStatusBadge } from "src/utils/getStatusBadge";
import { getUserPermissions } from "src/utils/getUserPermissions";
import { handleError } from "src/utils/handleError";
import { isUUID } from "src/utils/isUUID";
import { showNotification } from "src/utils/showNotification";
import { toFullPictureURI } from "src/utils/toFullPictureURI";

import styles from "./styles.module.scss";

interface UpdatedRequest {
  status?: RequestStatusType;
  delivered?: boolean;
}

const { confirm } = Modal;

export function ViewRequest() {
  useTitle("SkyDrinks - Visualizar pedido");

  const { userInfo } = useContext(AuthContext);
  const { updateRequest: updateRequestView } = useContext(WebSocketContext);

  const params = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requestFound, setRequestFound] = useState<RequestType>(
    {} as RequestType
  );

  const redirect = useCallback(() => {
    const path = location?.state?.path
      ? `/${location.state.path}`
      : routes.HOME;

    navigate(path);
  }, [location, navigate]);

  useEffect(() => {
    const uuid = params.uuid || "";

    async function loadRequest() {
      if (isUUID(uuid)) {
        try {
          const request = await endpoints.findRequestByUUID(uuid);
          setRequestFound(request);
        } catch (error: any) {
          handleError({
            error,
            fallback: "Não foi possível carregar o pedido",
          });

          redirect();
        } finally {
          setLoading(false);
        }
      } else {
        showNotification({
          type: "warn",
          message: "Pesquise por um código válido!",
        });

        redirect();
      }
    }

    if (loading) {
      loadRequest();
    }

    return () => setLoading(false);
  }, [params, loading, navigate, location, redirect]);

  useEffect(() => {
    if (updateRequestView) {
      setLoading(true);
    }
  }, [updateRequestView]);

  function updateRequest(request: UpdatedRequest) {
    setRequestFound({ ...requestFound, ...request });
  }

  function handleCancelRequest() {
    async function cancelRequest() {
      try {
        await endpoints.cancelRequest(requestFound.uuid);

        updateRequest({ status: "CANCELED" });

        showNotification({
          type: "success",
          message: "Pedido foi cancelado com sucesso!",
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível cancelar o pedido",
        });
      }
    }

    confirm({
      title: "Deseja cancelar o pedido?",
      content: "Depois de cancelado, o pedido não poderá ser finalizado!",
      okText: "Sim",
      cancelText: "Não",
      onOk: cancelRequest,
    });
  }

  function handleFinishRequest() {
    async function finishRequest() {
      try {
        await endpoints.finishRequest(requestFound.uuid);

        updateRequest({ status: "FINISHED" });

        showNotification({
          type: "success",
          message: "Pedido foi finalizado com sucesso!",
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível finalizar o pedido",
        });
      }
    }

    confirm({
      title: "Deseja finlizar o pedido?",
      okText: "Sim",
      cancelText: "Não",
      onOk: finishRequest,
    });
  }

  function handleDeliverRequest() {
    async function deliverRequest() {
      try {
        await endpoints.deliverRequest(requestFound.uuid);

        updateRequest({ status: "FINISHED", delivered: true });

        showNotification({
          type: "success",
          message: "Pedido foi entregue com sucesso!",
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível entregar o pedido",
        });
      }
    }

    confirm({
      title: "Deseja entregar o pedido?",
      content: "Depois de entregado, o pedido não poderá ser cancelado!",
      okText: "Sim",
      cancelText: "Não",
      onOk: deliverRequest,
    });
  }

  const permissions = getUserPermissions(userInfo.role);

  function showActions() {
    const { isBarmen, isWaiter } = permissions;

    const isStaff = isBarmen || isWaiter;
    const isRequestOwner = userInfo.uuid === requestFound.user?.uuid;

    const hasPermission = isStaff || isRequestOwner;

    const ownerCannotCancel =
      isRequestOwner && requestFound.status === "FINISHED" && !isStaff;

    const invalidFlags =
      requestFound.status === "CANCELED" ||
      !hasPermission ||
      ownerCannotCancel ||
      requestFound.delivered;

    if (invalidFlags) {
      return;
    }

    return (
      <>
        <Divider
          style={{ fontSize: "1.5rem", margin: "2rem 0" }}
          orientation="left"
        >
          Ações
        </Divider>

        <div className={styles.actions}>
          {isStaff &&
            requestFound.status === "FINISHED" &&
            !requestFound.delivered && (
              <Button
                onClick={handleDeliverRequest}
                shape="round"
                size="large"
                icon={<CheckOutlined style={{ color: "#2ecc71" }} />}
              >
                Entregar pedido
              </Button>
            )}

          {isStaff && requestFound.status === "PROCESSING" && (
            <Button
              onClick={handleFinishRequest}
              shape="round"
              size="large"
              icon={<CheckOutlined style={{ color: "#2ecc71" }} />}
            >
              Finalizar pedido
            </Button>
          )}

          {hasPermission && (
            <Button
              onClick={handleCancelRequest}
              shape="round"
              size="large"
              icon={<CloseOutlined style={{ color: "#e74c3c" }} />}
            >
              Cancelar pedido
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div>
            <h2 className={styles.title}>Visualizar Pedido</h2>
          </div>

          <div>
            {requestFound.status === "FINISHED" &&
              !requestFound.delivered &&
              userInfo.uuid === requestFound.user?.uuid && (
                <div className={styles.qrcode}>
                  <p className={styles.qrcodeTitle}>QRCode do pedido:</p>

                  <QRCodeGenerator text={window.location.href} />

                  <p className={styles.warnMessage}>
                    Cuidado! Apenas compartilhe o QRCode do pedido com pessoas
                    que você confia. Isso é o que garante para nossos
                    funcionários que quem o possuí tem autorização para receber
                    o pedido.
                  </p>
                </div>
              )}

            {showActions()}

            <Divider
              style={{ fontSize: "1.5rem", margin: "2rem 0" }}
              orientation="left"
            >
              Geral
            </Divider>

            <h3>
              Código do pedido:{" "}
              <span className={styles.bold}>{requestFound.uuid}</span>
            </h3>
            <p>
              Usuário:{" "}
              <span className={styles.bold}>
                {requestFound.user?.name} - {requestFound.user?.email}
              </span>
            </p>
            <div className={styles.status}>
              <p>Status: </p>
              {getStatusBadge(requestFound.status)}
            </div>

            {requestFound.status === "FINISHED" && !requestFound.delivered && (
              <p className={styles.warnMessage}>
                {requestFound.table
                  ? `Seu pedido será entregue na mesa n° ${requestFound.table?.number}!`
                  : "Vá pegar seu pedido no balcão."}
              </p>
            )}

            {requestFound.status === "CANCELED" && (
              <p className={styles.warnMessage}>
                Vá até o balcão para mais informações sobre o cancelamento.
              </p>
            )}

            {requestFound.status === "FINISHED" && requestFound.delivered && (
              <p className={styles.warnMessage}>O pedido já foi entregado.</p>
            )}

            <p>
              Pedido realizado em{" "}
              <span className={styles.bold}>
                {formatDisplayDate(requestFound?.createdAt)}
              </span>
            </p>
            <p>
              Pedido atualizado em{" "}
              <span className={styles.bold}>
                {formatDisplayDate(requestFound?.updatedAt)}
              </span>
            </p>
            <p>
              Preço estimado:{" "}
              <span className={styles.bold}>
                {formatDisplayPrice(requestFound.totalPrice)}
              </span>
            </p>

            <Divider
              style={{ fontSize: "1.5rem", margin: "2rem 0" }}
              orientation="left"
            >
              Bebidas
            </Divider>

            <div>
              {Object.keys(getDrinksGroupedByUUID(requestFound)).map(
                (key, index) => {
                  const drinksWithFullPicture =
                    requestFound.drinks.map(toFullPictureURI);

                  const drinksGrouped = getDrinksGroupedByUUID({
                    drinks: drinksWithFullPicture,
                  } as RequestType);

                  const [drink] = drinksGrouped[key];
                  const length = drinksGrouped[key].length;

                  const { picture, name, price } = drink;

                  return (
                    <div
                      title={name}
                      key={`${key} - ${index}`}
                      className={styles.drink}
                    >
                      <div className={styles.info}>
                        <Link to={routes.VIEW_DRINK.replace(":uuid", key)}>
                          <p className={styles.name}>{name}</p>
                        </Link>
                        <p className={styles.price}>
                          {formatDisplayPrice(price * length)}
                        </p>
                      </div>

                      <Badge count={length}>
                        <figure>
                          <img src={picture} alt={name} />
                        </figure>
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
