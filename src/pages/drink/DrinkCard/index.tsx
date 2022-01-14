import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Image, Tooltip } from "antd";
import { Link } from "react-router-dom";

import routes from "src/routes";

import drinkPlaceholder from "src/assets/drink-placeholder.png";
import drinkErrorImage from "src/assets/imageError.png";
import { showNotification } from "src/utils/showNotification";
import endpoints from "src/api/api";
import { useContext } from "react";
import { RequestContext } from "src/contexts/RequestContext";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";

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
}: DrinkCardProps) {
  const { addDrink } = useContext(RequestContext);

  function renderCover() {
    return (
      <Image
        height={imageHeight}
        width="100%"
        alt={`Drink - ${name}`}
        onError={(event) => event.currentTarget.src = drinkErrorImage}
        src={picture && !picture.endsWith("null") ? picture : drinkPlaceholder}
      />
    );
  }

  async function addDrinkToRequest() {
    try {
      const drink = await endpoints.findDrinkByUUID(uuid);
      addDrink(drink);
    } catch (e: any) {
      showNotification({
        type: "warn",
        message: "Não foi possível adicionar bebida ao pedido",
      });
    }
  }

  return (
    <Tooltip
      mouseEnterDelay={1}
      placement="rightTop"
      arrowPointAtCenter
      title={name}
    >
      <Card
        hoverable
        style={{ minWidth: minWidth, width }}
        actions={[
          <Tooltip title="Abrir Página" key="view-drink">
            <Link to={`${routes.VIEW_DRINK}`.replace(":uuid", uuid)}>
              <Button type="link">
                <EyeOutlined />
              </Button>
            </Link>
          </Tooltip>,
          ...(showBuyAction
            ? [
                <Tooltip title="Adicionar ao Pedido" key="add-to-request">
                  <Button onClick={addDrinkToRequest} type="link">
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
          description={`Preço: ${formatDisplayPrice(price)}`}
        />
      </Card>
    </Tooltip>
  );
}
