import { EyeOutlined } from "@ant-design/icons";
import { Card, Image, Tooltip } from "antd";
import { Link } from "react-router-dom";

import routes from "src/routes";

type DrinkCardProps = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
  loading: boolean;
  width: string | number;
  height: string | number;
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
}: DrinkCardProps) {
  function renderCover() {
    return (
      <Image
        height={height}
        width={width}
        alt={`Drink - ${name}`}
        src={picture}
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
            <Link to={`${routes.SOME_DRINK}`.replace(":uuid", uuid)}>
              <EyeOutlined />
            </Link>
          </Tooltip>,
        ]}
        cover={renderCover()}
        loading={loading}
      >
        <Meta title={name} description={`Preço: R$ ${price.toLocaleString("pt-BR")}`} />
      </Card>
    </Tooltip>
  );
}
