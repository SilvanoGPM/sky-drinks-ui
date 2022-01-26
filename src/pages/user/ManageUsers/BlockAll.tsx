import { useEffect, useState } from 'react';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

import endpoints from 'src/api/api';
import { showNotification } from 'src/utils/showNotification';

import styles from './styles.module.scss';

const { confirm } = Modal;

export function BlockAll(): JSX.Element {
  const [allBlocked, setAllBlocked] = useState(false);

  useEffect(() => {
    async function loadAllBlocked(): Promise<void> {
      try {
        const allBlockedFound = await endpoints.getAllBlocked();

        setAllBlocked(allBlockedFound);
      } catch {
        showNotification({
          type: 'warn',
          message:
            'Não foi possível verificar se todos os pedidos estão bloqueados',
        });
      }
    }

    loadAllBlocked();
  }, []);

  async function toggleBlockAllRequests(): Promise<void> {
    try {
      const allBlockedFound = await endpoints.toggleBlockAllRequests();
      setAllBlocked(allBlockedFound);
    } catch {
      showNotification({
        type: 'warn',
        message:
          'Não foi possível alternar se todos os pedidos estão bloqueados',
      });
    }
  }

  function handleBlockAllRequests(): void {
    const title = allBlocked
      ? 'Desbloquear todos os pedidos'
      : 'Bloquear todos os pedidos';
    const okText = allBlocked ? 'Desbloquear' : 'Bloquear';
    const icon = allBlocked ? <UnlockOutlined /> : <LockOutlined />;

    confirm({
      title,
      okText,
      icon,
      cancelText: 'Cancelar',
      onOk: toggleBlockAllRequests,
    });
  }

  return (
    <div className={styles.blockRequests}>
      <p>
        {allBlocked
          ? 'Todos os pedidos estão bloqueados!'
          : 'Todos os pedidos estão desbloqueados!'}
      </p>

      <div className={styles.fullButton}>
        <Button
          onClick={handleBlockAllRequests}
          type="dashed"
          icon={allBlocked ? <UnlockOutlined /> : <LockOutlined />}
        >
          {allBlocked ? 'Desbloquear pedidos' : 'Bloquear pedidos'}
        </Button>
      </div>
    </div>
  );
}
