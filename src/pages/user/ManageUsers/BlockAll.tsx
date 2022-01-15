import { useEffect, useState } from "react";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

import endpoints from "src/api/api";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

const { confirm } = Modal;

export function BlockAll() {
  const [allBlocked, setAllBlocked] = useState(false);

  useEffect(() => {
    async function loadAllBlocked() {
      try {
        const allBlocked = await endpoints.getAllBlocked();

        setAllBlocked(allBlocked);
      } catch {
        showNotification({
          type: "warn",
          message:
            "Não foi possível verificar se todos os pedidos estão bloqueados",
        });
      }
    }

    loadAllBlocked();
  }, []);

  async function toggleBlockAllRequests() {
    try {
      const allBlocked = await endpoints.toggleBlockAllRequests();
      setAllBlocked(allBlocked);
    } catch {
      showNotification({
        type: "warn",
        message:
          "Não foi possível alternar se todos os pedidos estão bloqueados",
      });
    }
  }

  function handleBlockAllRequests() {
    const title = allBlocked
      ? "Desbloquear todos os pedidos"
      : "Bloquear todos os pedidos";
    const okText = allBlocked ? "Desbloquear" : "Bloquear";
    const icon = allBlocked ? <UnlockOutlined /> : <LockOutlined />;

    confirm({
      title,
      okText,
      icon,
      cancelText: "Cancelar",
      onOk: toggleBlockAllRequests,
    });
  }

  return (
    <div className={styles.blockRequests}>
      <p>
        {allBlocked
          ? "Todos os pedidos estão bloqueados!"
          : "Todos os pedidos estão desbloqueados!"}
      </p>

      <div className={styles.fullButton}>
        <Button
          onClick={handleBlockAllRequests}
          type="dashed"
          icon={allBlocked ? <UnlockOutlined /> : <LockOutlined />}
        >
          {allBlocked ? "Desbloquear pedidos" : "Bloquear pedidos"}
        </Button>
      </div>
    </div>
  );
}
