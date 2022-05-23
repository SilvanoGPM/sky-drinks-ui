import { useContext, useEffect, useState } from 'react';
import { Button, notification } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from 'react-stomp-hooks';

import routes from 'src/routes';
import endpoints from 'src/api/api';
import { AuthContext } from 'src/contexts/AuthContext';
import { WebSocketContext } from 'src/contexts/WebSocketContext';
import { useAudio } from 'src/hooks/useAudio';
import { useBrowserNotification } from 'src/hooks/useBrowserNotification';
import { useTitle } from 'src/hooks/useTitle';

import { RequestModal } from './RequestModal';

type RequestNotificationType = 'FINISHED' | 'CANCELED';

const publicPath = process.env.PUBLIC_URL;

const requestStatusChanged = {
  FINISHED: {
    title: 'Seu pedido foi finalizado!',
  },

  CANCELED: {
    title: 'Seu pedido foi cancelado!',
  },

  DELIVERED: {
    title: 'Pedido foi entregue!',
  },

  STARTED: {
    title: 'Pedido foi iniciado!',
  },
};

export function NotificateRequestUpdates(): JSX.Element {
  const { userInfo, token } = useContext(AuthContext);
  const { setUpdateRequests, setUpdateRequest } = useContext(WebSocketContext);

  const { createBrowsetNotification } = useBrowserNotification();

  const [toggleFinished] = useAudio(
    `${publicPath}/noises/request-finished.wav`
  );

  const [toggleCanceled] = useAudio(
    `${publicPath}/noises/request-canceled.mp3`
  );

  const [toggleUpdated] = useAudio(`${publicPath}/noises/requests-updated.mp3`);

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  const [modalInfo, setModalInfo] = useState({
    title: '',
    uuid: '',
  });

  const [request, setRequest] = useState<RequestType>({} as RequestType);

  useTitle(title);

  useEffect(() => {
    async function loadRequest(): Promise<void> {
      try {
        const requestFound = await endpoints.findRequestByUUID(modalInfo.uuid);
        setRequest(requestFound);
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

  function goToManageRequests(): void {
    navigate(routes.MANAGE_REQUESTS);
    notification.destroy();
  }

  useSubscription(
    [
      `/topic/updated/${userInfo.email}`,
      `/topic/request-changed/${userInfo.email}`,
    ],
    (message) => {
      const body = JSON.parse(message.body);

      if (body.uuid) {
        const key = body.message as RequestNotificationType;
        const requestTitle = requestStatusChanged[key].title;

        const toggle = key === 'CANCELED' ? toggleCanceled : toggleFinished;

        toggle();

        createBrowsetNotification(requestTitle);

        setModalInfo({
          title: requestTitle,
          uuid: body.uuid,
        });

        setTitle(`SkyDrinks - ${requestTitle.toString()}`);
        setLoading(true);
        setVisible(true);

        const path = routes.VIEW_REQUEST.replace(':uuid', body.uuid);
        const onPath = location.pathname.includes(path);

        if (onPath) {
          setUpdateRequest(true);
        }
      } else if (body.message === 'requests-changed') {
        const notificationMessage = 'Aconteceu uma alteração nos pedidos!';

        setTitle(`SkyDrinks - ${notificationMessage}`);

        toggleUpdated();

        const path = routes.MANAGE_REQUESTS;

        const onPath = location.pathname.includes(path);

        createBrowsetNotification(notificationMessage);

        notification.open({
          key: 'UPDATED',
          type: 'success',
          message: notificationMessage,
          duration: onPath ? 2 : 0,
          placement: 'bottomRight',
          description: !onPath ? (
            <p style={{ textAlign: 'right' }}>
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
    <RequestModal
      {...modalInfo}
      visible={visible}
      setVisible={setVisible}
      loading={loading}
      request={request}
    />
  );
}
