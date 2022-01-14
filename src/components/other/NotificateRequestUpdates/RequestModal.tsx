import { Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import routes from "src/routes";
import { Loading } from "src/components/layout/Loading";
import { RequestType } from "src/types/requests";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getStatusBadge } from "src/utils/getStatusBadge";

import styles from "./styles.module.scss";

interface RequestModalProps {
  title: string;
  uuid: string;
  visible: boolean;
  loading: boolean;
  request: RequestType;
  setVisible: (visible: boolean) => void;
}

export function RequestModal({
  title,
  uuid,
  visible,
  loading,
  request,
  setVisible,
}: RequestModalProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function closeModal() {
    setVisible(false);
  }

  function viewRequest(uuid: string) {
    return () => {
      const path = routes.VIEW_REQUEST.replace(":uuid", uuid);

      if (location.pathname.includes(path)) {
        navigate(0);
      } else {
        navigate(path);
      }

      closeModal();
    };
  }

  return (
    <Modal
      title={title}
      cancelText="Fechar"
      okText="Ver pedido"
      onOk={viewRequest(uuid)}
      onCancel={closeModal}
      visible={visible}
      destroyOnClose
    >
      <div className={styles.modalContainer}>
        {loading ? (
          <Loading />
        ) : request.uuid ? (
          <div className={styles.requestInfo}>
            <p>Preço: {formatDisplayPrice(request.totalPrice)}</p>

            <p>
              Status:{" "}
              <span className={styles.badge}>
                {getStatusBadge(request.status)}
              </span>
            </p>

            <p>
              Pedido realizado em: {formatDisplayDate(request.createdAt || "")}
            </p>

            {request.status === "FINISHED" &&
              (request.delivered ? (
                <p className={styles.bold}>Seu pedido foi entregue!</p>
              ) : request.table ? (
                <>
                  <p className={styles.bold}>
                    Seu pedido será entregue na mesa n° {request.table.number}!
                  </p>
                  <p className={styles.bold}>
                    Para confirmar o seu pedido, mostre seu{" "}
                    <span
                      onClick={viewRequest(request.uuid)}
                      className={styles.link}
                    >
                      QRCode do pedido
                    </span>{" "}
                    para o garçom que for entregar.
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.bold}>Vá pegar seu pedido no balcão.</p>
                  <p className={styles.bold}>
                    Lembre-se de ir com o{" "}
                    <span
                      onClick={viewRequest(request.uuid)}
                      className={styles.link}
                    >
                      QRCode do pedido
                    </span>
                    .
                  </p>
                </>
              ))}

            {request.status === "CANCELED" && (
              <p className={styles.bold}>
                Vá até o balcão para mais informações sobre o cancelamento.
              </p>
            )}
          </div>
        ) : (
          <>
            <p>Não foi possível buscar as informações do pedido!</p>
            <p className={styles.bold}>
              Vá até o balcão para obter informações sobre o pedido.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
