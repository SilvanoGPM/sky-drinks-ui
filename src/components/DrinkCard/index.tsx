import { EyeOutlined } from "@ant-design/icons";
import { Card, Image, Tooltip } from "antd";
import { Link } from "react-router-dom";

import routes from "src/routes";
import drinkPlaceholder from "src/assets/drink-placeholder.png";

type DrinkCardProps = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
  loading: boolean;
  width: string | number;
  height: string | number;
  moreActions?: React.ReactNode[],
};

const { Meta } = Card;

export function DrinkCard({
  uuid,
  name,
  picture,
  price,
  loading,
  height,
  width,
  moreActions = []
}: DrinkCardProps) {
  function renderCover() {
    return (
      <Image
        height={height}
        width={width}
        alt={`Drink - ${name}`}
        src={picture && !picture.endsWith('null') ? picture : drinkPlaceholder}
      />
    );
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
        style={{ minWidth: width, width }}
        actions={[
          <Tooltip title="Abrir Página" key="view-drink">
            <Link to={`${routes.VIEW_DRINK}`.replace(":uuid", uuid)}>
              <EyeOutlined />
            </Link>
          </Tooltip>,
          ...moreActions
        ]}
        cover={renderCover()}
        loading={loading}
      >
        <Meta title={name} description={`Preço: R$ ${price.toLocaleString("pt-BR")}`} />
      </Card>
    </Tooltip>
  );
}
