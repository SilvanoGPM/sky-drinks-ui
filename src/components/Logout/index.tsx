import { useContext } from "react";
import { HeartOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "src/contexts/AuthContext";

import routes from "src/routes";

import styles from "./styles.module.scss";

export function Logout() {
  const { handleLogout } = useContext(AuthContext);

  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  function logout() {
    handleLogout();
    navigate(routes.LOGIN);
    notification.success({
      message: "Deslogado com sucesso.",
      duration: 3,
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Você quer mesmo sair?</h2>

        <div className={styles.buttons}>
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            size="large"
            style={{
              color: "#ffffff",
              outline: "none",
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
