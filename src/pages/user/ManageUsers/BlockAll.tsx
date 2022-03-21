import { useEffect, useState } from 'react';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import endpoints from 'src/api/api';
import { showNotification } from 'src/utils/showNotification';
import { ModalWithPassword } from 'src/components/custom/ConfirmWithPassword';

import styles from './styles.module.scss';

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

  return (
    <div className={styles.blockRequests}>
      <p>
        {allBlocked
          ? 'Todos os pedidos estão bloqueados!'
          : 'Todos os pedidos estão desbloqueados!'}
      </p>

      <ModalWithPassword
        title={
          allBlocked ? (
            <div>
              <UnlockOutlined style={{ marginRight: '0.5rem' }} />
              Desbloquear todos os pedidos
            </div>
          ) : (
            <div>
              <LockOutlined style={{ marginRight: '0.5rem' }} />
              Bloquear todos os pedidos
            </div>
          )
        }
        callback={toggleBlockAllRequests}
      >
        <div className={styles.fullButton}>
          <Button
            type="dashed"
            icon={allBlocked ? <UnlockOutlined /> : <LockOutlined />}
          >
            {allBlocked
              ? 'Desbloquear todos os pedidos'
              : 'Bloquear todos os pedidos'}
          </Button>
        </div>
      </ModalWithPassword>
    </div>
  );
}
