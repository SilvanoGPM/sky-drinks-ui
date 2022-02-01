import { Link } from 'react-router-dom';
import { CloseOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Badge, Button, List, Popover, Tooltip } from 'antd';
import { animated, useSpring } from 'react-spring';

import routes from 'src/routes';
import { DrinkIcon } from 'src/components/custom/CustomIcons';
import { imageToFullURI } from 'src/utils/imageUtils';
import { getDrinksGroupedByUUID } from 'src/utils/getDrinksGroupedByUUID';
import { getStatusBadge } from 'src/utils/getStatusBadge';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { formatDisplayDate } from 'src/utils/formatDatabaseDate';

import styles from './styles.module.scss';

interface ListItemProps {
  request: RequestType;
  handleCopyRequestUUID: (uuid: string) => () => void;
  handleCancelRequest: (uuid: string) => () => void;
  index: number;
}

export function ListItem({
  request,
  handleCopyRequestUUID,
  handleCancelRequest,
  index,
}: ListItemProps): JSX.Element {
  const props = useSpring({
    to: { translateX: 0, opacity: 1 },
    from: { translateX: -300, opacity: 0.1 },
    delay: Math.min(index + 1, 5) * 200,
  });

  function getDrinksContent(requestSelected: RequestType): JSX.Element {
    const drinks = getDrinksGroupedByUUID(requestSelected);

    const elements = Object.keys(drinks).map((key) => {
      const [drink] = drinks[key];
      const { length } = drinks[key];

      return (
        <li className={styles.drinksItem} key={key}>
          <p title={drink.name}>{drink.name}</p>
          <Badge count={length} />
        </li>
      );
    });

    return (
      <div>
        <ul className={styles.drinksList}>{elements}</ul>
      </div>
    );
  }

  const {
    uuid,
    createdAt,
    status,
    drinks: [drink],
    totalPrice,
  } = request;

  const picture = imageToFullURI(drink.picture);

  const imageWidth = window.innerWidth > 700 ? 200 : 100;
  const popoverTrigger = window.innerWidth > 700 ? 'hover' : 'click';

  return (
    <animated.div style={props}>
      <List.Item
        key={uuid}
        actions={[
          <Tooltip key="copy" title="Copiar código">
            <Button onClick={handleCopyRequestUUID(uuid)}>
              <PaperClipOutlined />
            </Button>
          </Tooltip>,
          <Popover
            placement="bottom"
            trigger={popoverTrigger}
            overlayClassName={styles.drinksOverlay}
            key="drinks"
            title="Bebidas"
            content={getDrinksContent(request)}
          >
            <Button>
              <DrinkIcon />
            </Button>
          </Popover>,
          ...(status === 'PROCESSING'
            ? [
                <Tooltip key="cancel" title="Cancelar pedido">
                  <Button onClick={handleCancelRequest(uuid)}>
                    <CloseOutlined style={{ color: '#e74c3c' }} />
                  </Button>
                </Tooltip>,
              ]
            : []),
        ]}
        extra={
          <img
            width={imageWidth}
            height={imageWidth}
            src={picture}
            alt="Bebida contida no pedido"
          />
        }
      >
        <List.Item.Meta
          title={
            <Link to={`/${routes.VIEW_REQUEST.replace(':uuid', uuid)}`}>
              <h3 className={styles.itemTitle}>Ver pedido</h3>
            </Link>
          }
        />
        <div className={styles.listItemContent}>
          <div className={styles.status}>
            <p>Status: </p>
            {getStatusBadge(status)}
          </div>
          <p className={styles.info}>Código do pedido: {uuid}</p>
          <p className={styles.info}>
            Preço estimado: {formatDisplayPrice(totalPrice)}
          </p>
          <p className={styles.info}>
            Criado em {formatDisplayDate(createdAt)}
          </p>
        </div>
      </List.Item>
    </animated.div>
  );
}
