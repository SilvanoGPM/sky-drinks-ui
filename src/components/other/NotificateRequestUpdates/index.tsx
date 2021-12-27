import { Button, notification } from "antd";
import { ArgsProps } from "antd/lib/notification";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "react-stomp-hooks";
import { AuthContext } from "src/contexts/AuthContext";
import { useAudio } from "src/hooks/useAudio";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { showNotification } from "src/utils/showNotification";

type RequestNotificationType = "FINISHED" | "CANCELED";

export function NotificateRequestUpdates() {
  const { userInfo, token } = useContext(AuthContext);
  const { playing, toggle } = useAudio(
    `${process.env.PUBLIC_URL}/request-status-changed.wav`
  );

  const [title, setTitle] = useState("SkyDrinks - Notificação");

  useTitle(title);

  const location = useLocation();
  const navigate = useNavigate();

  function viewRequest(uuid: string) {
    return () => {
      const path = routes.VIEW_REQUEST.replace(":uuid", uuid);

      notification.destroy();

      if (location.pathname.includes(path)) {
        navigate(0);
        return;
      }

      navigate(path);
    };
  }

  const requestStatusChanged: { [key: string]: ArgsProps } = {
    FINISHED: {
      type: "success",
      message: "Seu pedido foi finalizado!",
    },

    CANCELED: {
      type: "info",
      message: "Seu pedido foi cancelado!",
    },
  };

  useSubscription(
    [`/topic/updated/${userInfo.email}`, `/topic/finished/${userInfo.email}`],
    (message) => {
      const fallback = () => ({ message: "???" });

      const body = JSON.parse(message.body);

      if (body.uuid) {
        const key = body.message as RequestNotificationType;
        const content = requestStatusChanged[key] || fallback;

        if (!playing) {
          toggle();
        }

        const newTitle = content.message?.toString()
          ? `SkyDrinks - ${content.message?.toString()}`
          : title;

        setTitle(newTitle);

        notification.open({
          ...content,
          placement: "bottomRight",
          duration: 0,
          description: (
            <Button type="primary" onClick={viewRequest(body.uuid)}>
              Ver pedido
            </Button>
          ),
        });
      } else if (body.message === "requests-changed") {
        const notificationMessage = "Aconteceu um alteração nos pedidos!";

        setTitle(`SkyDrinks - ${notificationMessage}`);

        showNotification({
          type: "success",
          message: notificationMessage,
        });
      }
    },
    { Authorization: token }
  );

  return <></>;
}
