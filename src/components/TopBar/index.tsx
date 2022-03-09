import { useContext } from 'react';
import { Avatar, Badge, Button, Modal, Popover, Tooltip } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import routes from 'src/routes';
import { RequestContext } from 'src/contexts/RequestContext';
import { getDrinksGroupedByUUID } from 'src/utils/getDrinksGroupedByUUID';
import { calculateDrinksPrice } from 'src/utils/calculateDrinkPrice';
import { AuthContext } from 'src/contexts/AuthContext';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import endpoints from 'src/api/api';
import { getFirstCharOfString } from 'src/utils/getFirstCharOfString';

import styles from './styles.module.scss';

const { confirm } = Modal;

export function TopBar(): JSX.Element {
  const { userInfo } = useContext(AuthContext);
  const { request, clearRequest } = useContext(RequestContext);

  function handleClearRequest(): void {
    confirm({
      title: 'Deseja mesmo limpar esse pedido?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: clearRequest,
    });
  }

  function getDrinksContent(): JSX.Element {
    const drinks = getDrinksGroupedByUUID(request);

    const elements = Object.keys(drinks).map((key) => {
      const [drink] = drinks[key];
      const { length } = drinks[key];

      return (
        <li className={styles.drinksItem} key={`${key}`}>
          <p title={drink.name}>{drink.name}</p>
          <Badge count={length} />
        </li>
      );
    });

    return (
      <div>
        <ul className={styles.drinksList}>{elements}</ul>
        <div className={styles.clearRequest}>
          <Tooltip title="Limpar Pedido" placement="bottom">
            <Button onClick={handleClearRequest} shape="round">
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }

  const permissions = getUserPermissions(userInfo.role);

  const containsRequest = request.drinks.length > 0;
  const popoverTrigger = window.innerWidth > 700 ? 'hover' : 'click';

  if (!permissions.isUser && !permissions.isGuest) {
    return <></>;
  }

  return (
    <div className={`${styles.requestInfo}`}>
      {containsRequest && permissions.isUser ? (
        <>
          <Popover
            trigger={popoverTrigger}
            content={getDrinksContent()}
            overlayClassName={styles.drinksOverlay}
            title="Bebidas"
          >
            <div className={styles.requestInfoTotal}>
              <p>Total de bebidas:</p>
              <Badge
                style={{ backgroundColor: '#52c41a' }}
                count={request.drinks.length}
              />
            </div>

            <p className={styles.requestInfoPrice}>
              Preço estimado: {calculateDrinksPrice(request.drinks)}
            </p>
          </Popover>

          <Link to={routes.FINALIZE_REQUEST}>
            <Button type="primary" icon={<CheckOutlined />}>
              Finalizar Pedido
            </Button>
          </Link>
        </>
      ) : (
        <div className={styles.noRequest}>
          {permissions.isUser ? (
            <>
              <p className={styles.message}>
                Adicione{' '}
                <Link className={styles.animatedLink} to={routes.SEARCH_DRINKS}>
                  bebidas
                </Link>{' '}
                ao seu pedido
              </p>

              <Tooltip title={userInfo.name} placement="left">
                <Link to={routes.MY_ACCOUNT}>
                  <Avatar src={endpoints.getUserImage(userInfo.uuid)}>
                    {getFirstCharOfString(userInfo.name)}
                  </Avatar>
                </Link>
              </Tooltip>
            </>
          ) : (
            <p className={`${styles.message} ${styles.centeredMessage}`}>
              Faça{' '}
              <Link className={styles.animatedLink} to={routes.LOGIN}>
                login
              </Link>{' '}
              para realizar pedidos
            </p>
          )}
        </div>
      )}
    </div>
  );
}
