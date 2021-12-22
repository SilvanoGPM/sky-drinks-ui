import { Badge, Button, Popover, Tooltip } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";
import { useContext } from "react";
import { RequestContext } from "src/contexts/RequestContext";
import { Link } from "react-router-dom";
import routes from "src/routes";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";

export function RequestInfo() {
  const { request, clearRequest } = useContext(RequestContext);

  function calculateRequestPrice() {
    return request.drinks.reduce((total, { price }) => total + price, 0);
  }

  function getDrinksContent() {
    const drinks = getDrinksGroupedByUUID(request);

    const elements = Object.keys(drinks).map((key, index) => {
      const [drink] = drinks[key];
      const { length } = drinks[key];

      return (
        <li className={styles.drinksItem} key={`${key} - ${index}`}>
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
            <Button onClick={clearRequest} shape="round">
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }

  const containsRequest = request.drinks.length > 0;
  const popoverTrigger = window.innerWidth > 700 ? "hover" : "click";

  return (
    <div className={`${styles.requestInfo}`}>
      {containsRequest ? (
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
                style={{ backgroundColor: "#52c41a" }}
                count={request.drinks.length}
              />
            </div>

            <p className={styles.requestInfoPrice}>
              Preço estimado: R$ {formatDisplayPrice(calculateRequestPrice())}
            </p>
          </Popover>

          <Link to={routes.FINALIZE_REQUEST}>
            <Button type="primary" icon={<CheckOutlined />}>
              Finalizar Pedido
            </Button>
          </Link>
        </>
      ) : (
        <>
          <div className={styles.noRequest}>
            <p>Nenhum pedido no momento</p>
          </div>
        </>
      )}
    </div>
  );
}
