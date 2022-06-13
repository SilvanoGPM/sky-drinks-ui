import { useContext } from 'react';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Image, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

import routes from 'src/routes';
import endpoints from 'src/api/api';
import { showNotification } from 'src/utils/showNotification';
import { RequestContext } from 'src/contexts/RequestContext';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { animated } from 'react-spring';

import drinkPlaceholder from 'src/assets/drink-placeholder.png';
import drinkErrorImage from 'src/assets/image-error.png';
import { useZoomInAnimation } from 'src/hooks/useZoomInAnimation';

import styles from './styles.module.scss';

interface DrinkCardProps {
  uuid: string;
  name: string;
  picture: string;
  price: number;
  loading: boolean;
  width: string | number;
  minWidth?: string | number;
  imageHeight: string | number;
  showBuyAction?: boolean;
  moreActions?: React.ReactNode[];
}

const { Meta } = Card;

export function DrinkCard({
  uuid,
  name,
  picture,
  price,
  loading,
  imageHeight,
  width,
  minWidth = width,
  showBuyAction = true,
  moreActions = [],
}: DrinkCardProps): JSX.Element {
  const [props] = useZoomInAnimation();

  const { addDrink, request } = useContext(RequestContext);

  function renderCover(): JSX.Element {
    const totalOfDrinks = request.drinks.filter(
      (drink) => uuid === drink.uuid
    ).length;

    return (
      <div className={styles.container}>
        <Image
          loading="lazy"
          height={imageHeight}
          width="100%"
          alt={`Drink - ${name}`}
          onError={(event) => {
            // eslint-disable-next-line
            event.currentTarget.src = drinkErrorImage;
          }}
          src={picture || drinkPlaceholder}
        />

        <div className={styles.totalOfDrinks}>
          <Badge count={totalOfDrinks} />
        </div>
      </div>
    );
  }

  async function addDrinkToRequest(): Promise<void> {
    try {
      const drink = await endpoints.findDrinkByUUID(uuid);
      addDrink(drink);
    } catch (e: any) {
      showNotification({
        type: 'warn',
        message: 'Não foi possível adicionar bebida ao pedido',
      });
    }
  }

  return (
    <animated.div style={loading ? {} : props}>
      <Tooltip
        mouseEnterDelay={1}
        placement="rightTop"
        arrowPointAtCenter
        title={name}
      >
        <Card
          hoverable
          style={{ minWidth, width }}
          actions={[
            <Tooltip title="Abrir Página" key="view-drink">
              <Link to={`${routes.VIEW_DRINK}`.replace(':uuid', uuid)}>
                <Button type="link">
                  <EyeOutlined />
                </Button>
              </Link>
            </Tooltip>,
            ...(showBuyAction
              ? [
                  <Tooltip title="Adicionar ao Pedido">
                    <Button
                      onClick={addDrinkToRequest}
                      type="link"
                      key="add-to-request"
                    >
                      <ShoppingCartOutlined />
                    </Button>
                  </Tooltip>,
                ]
              : []),
            ...moreActions,
          ]}
          cover={renderCover()}
          loading={loading}
        >
          <Meta
            title={name}
            description={`Preço: ${formatDisplayPrice(price || 0)}`}
          />
        </Card>
      </Tooltip>
    </animated.div>
  );
}
