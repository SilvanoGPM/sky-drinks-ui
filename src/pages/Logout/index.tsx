import { useContext } from "react";
import { HeartOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "src/contexts/AuthContext";
import { useTitle } from "src/hooks/useTitle";

import routes from "src/routes";

import styles from "./styles.module.scss";
import { showNotification } from "src/utils/showNotification";
import { RequestContext } from "src/contexts/RequestContext";

export function Logout() {
  useTitle("SkyDrinks - Sair");

  const { handleLogout } = useContext(AuthContext);
  const { clearRequest, request } = useContext(RequestContext);

  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  function logout() {
    clearRequest();
    handleLogout();

    navigate(routes.LOGIN);

    showNotification({
      type: "success",
      message: "Deslogado com sucesso",
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Você quer mesmo sair?</h2>

        {Boolean(request.drinks.length) && (
          <p className={styles.warn}>Seu pedido não foi efetuado, logo, será perdido caso você deslogue.</p>
        )}

        <div className={styles.buttons}>
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            size="large"
            style={{
              color: "#ffffff",
              borderColor: "#e74c3c",
              backgroundColor: "#e74c3c",
            }}
          >
            Sim, eu quero sair
          </Button>

          <Button
            icon={<HeartOutlined />}
            onClick={goBack}
            size="large"
            type="primary"
          >
            Não, quero continuar
          </Button>
        </div>
      </div>
    </div>
  );
}