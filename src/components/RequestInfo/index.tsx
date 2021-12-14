import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";

export function RequestInfo() {
  return (
    <div className={styles.requestInfo}>
      <div>
        <p className={styles.requestInfoTotal}>Total de Drinks: 3</p>

        <p className={styles.requestInfoPrice}>Preço estimado: R$ 34,50</p>
      </div>

      <Button type="primary" icon={<CheckOutlined />}>
        Finalizar Pedido
      </Button>
    </div>
  );
}
