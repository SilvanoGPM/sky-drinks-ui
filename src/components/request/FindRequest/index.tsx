import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { isUUID } from "src/utils/isUUID";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

const { Search } = Input;

export function FindRequest() {
  useTitle("SkyDrinks - Encontrar pedido");

  const navigate = useNavigate();

  function handleSearch(uuid: string) {
    if (isUUID(uuid)) {
      navigate(`/${routes.VIEW_REQUEST.replace(":uuid", uuid)}`, {
        state: { path: routes.FIND_REQUEST },
      });
    } else {
      showNotification({
        type: "warn",
        message: "Esse não é um código válido!",
      });
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Encontrar Pedido</h2>
      </div>

      <div className={styles.search}>
        <Search
          onSearch={handleSearch}
          size="large"
          placeholder="Código do pedido"
          allowClear
          enterButton
        />
      </div>
    </div>
  );
}
