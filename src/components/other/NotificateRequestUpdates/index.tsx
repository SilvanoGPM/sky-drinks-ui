import { Button, Modal, notification, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "react-stomp-hooks";
import endpoints from "src/api/api";
import { AuthContext } from "src/contexts/AuthContext";
import { WebSocketContext } from "src/contexts/WebSocketContext";
import { useAudio } from "src/hooks/useAudio";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getStatusBadge } from "src/utils/getStatusBadge";

import styles from "./styles.module.scss";

type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

type UserType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type StatusType = "PROCESSING" | "FINISHED" | "CANCELED";

type RequestType = {
  drinks: DrinkType[];
  createdAt: string;
  updatedAt: string;
  status: StatusType;
  uuid: string;
  user: UserType;
  totalPrice: number;
};

type RequestNotificationType = "FINISHED" | "CANCELED";

const requestStatusChanged = {
  FINISHED: {
    title: "Seu pedido foi finalizado!",
  },

  CANCELED: {
    title: "Seu pedido foi cancelado!",
  },
};

export function NotificateRequestUpdates() {
  const { userInfo, token } = useContext(AuthContext);
  const { setUpdateRequests } = useContext(WebSocketContext);

  const { playing, toggle } = useAudio(
    `${process.env.PUBLIC_URL}/request-status-changed.wav`
  );

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("SkyDrinks - Notificação");

  const [modalInfo, setModalInfo] = useState({
    title: "",
    uuid: "",
  });

  const [request, setRequest] = useState<RequestType>({} as RequestType);

  useTitle(title);

  useEffect(() => {
    async function loadRequest() {
      try {
        const request = await endpoints.findRequestByUUID(modalInfo.uuid);
        setRequest(request);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    if (loading && modalInfo.uuid) {
      loadRequest();
    }
  }, [loading, modalInfo]);

  const location = useLocation();
  const navigate = useNavigate();

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

  function goToManageRequests() {
    navigate(routes.MANAGE_REQUESTS);
    notification.destroy();
  }

  useSubscription(
    [`/topic/updated/${userInfo.email}`, `/topic/finished/${userInfo.email}`],
    (message) => {
      const body = JSON.parse(message.body);

      if (body.uuid) {
        const key = body.message as RequestNotificationType;
        const { title } = requestStatusChanged[key];

        if (!playing) {
          toggle();
        }

        setModalInfo({
          title,
          uuid: body.uuid,
        });

        setTitle(`SkyDrinks - ${title.toString()}`);
        setLoading(true);
        setVisible(true);
      } else if (body.message === "requests-changed") {
        const notificationMessage = "Aconteceu um alteração nos pedidos!";

        setTitle(`SkyDrinks - ${notificationMessage}`);

        if (!playing) {
          toggle();
        }

        const path = routes.MANAGE_REQUESTS;

        const onPath = location.pathname.includes(path);

        notification.open({
          type: "success",
          message: notificationMessage,
          duration: onPath ? 2 : 0,
          placement: "bottomRight",
          description: !onPath ? (
            <p style={{ textAlign: "right" }}>
              <Button onClick={goToManageRequests} type="link">
                Ver pedidos
              </Button>
            </p>
          ) : undefined,
        });

        if (onPath) {
          setUpdateRequests(true);
        }
      }
    },
    { Authorization: token }
  );

  return (
    <Modal
      title={modalInfo.title}
      cancelText="Fechar"
      okText="Ver pedido"
      onOk={viewRequest(modalInfo.uuid)}
      onCancel={closeModal}
      visible={visible}
      destroyOnClose
    >
      <div className={styles.modalContainer}>
        {loading ? (
          <Spin />
        ) : request.uuid ? (
          <div className={styles.requestInfo}>
            <p>Preço: {formatDisplayPrice(request.totalPrice)}</p>
            <p>Criado em: {formatDisplayDate(request.createdAt)}</p>
            <p>
              Status:{" "}
              <span className={styles.badge}>
                {getStatusBadge(request.status)}
              </span>
            </p>
            <p>Código: {request.uuid}</p>
          </div>
        ) : (
          <p>Não foi possível buscar as informações do pedido!</p>
        )}
      </div>
    </Modal>
  );
}
