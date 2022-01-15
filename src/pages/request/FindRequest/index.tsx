import { Input } from "antd";
import { useNavigate } from "react-router-dom";

import routes from "src/routes";
import { useTitle } from "src/hooks/useTitle";
import { isUUID } from "src/utils/isUUID";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

const { Search } = Input;

export function FindRequest() {
  useTitle("SkyDrinks - Encontrar pedido");

  const navigate = useNavigate();

  function handleSearch(uuid: string) {
    const trimUUID = uuid.trim();

    if (isUUID(trimUUID)) {
      navigate(`/${routes.VIEW_REQUEST.replace(":uuid", trimUUID)}`, {
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
    <section className={styles.container}>
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
    </section>
  );
}
