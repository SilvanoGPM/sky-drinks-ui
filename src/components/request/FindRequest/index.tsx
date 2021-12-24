import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

const { Search } = Input;

export function FindRequest() {
  useTitle("SkyDrinks - Encontrar pedido");

  const navigate = useNavigate();

  function handleSearch(uuid: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUUID = uuidRegex.test(uuid || "");

    if (isUUID) {
      navigate(`/${routes.VIEW_REQUEST.replace(":uuid", uuid)}`, {
        state: { path: routes.FIND_REQUEST },
      });
    } else {
      showNotification({
        type: "warn",
        message: "Esse não é um código válido!"
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
