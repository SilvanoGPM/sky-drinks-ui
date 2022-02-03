import { useContext } from 'react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';

import routes from 'src/routes';
import { useTitle } from 'src/hooks/useTitle';
import { isUUID } from 'src/utils/isUUID';
import { showNotification } from 'src/utils/showNotification';
import { QRCodeScanner } from 'src/components/other/QRCodeScanner';
import { AuthContext } from 'src/contexts/AuthContext';
import { getUserPermissions } from 'src/utils/getUserPermissions';

import styles from './styles.module.scss';

const { Search } = Input;

export function FindRequest(): JSX.Element {
  useTitle('SkyDrinks - Encontrar pedido');

  const { userInfo } = useContext(AuthContext);

  const navigate = useNavigate();

  function handleSearch(uuid: string): void {
    const trimUUID = uuid.trim();

    if (isUUID(trimUUID)) {
      navigate(`/${routes.VIEW_REQUEST.replace(':uuid', trimUUID)}`, {
        state: { path: routes.FIND_REQUEST },
      });
    } else {
      showNotification({
        type: 'warn',
        message: 'Esse não é um código válido!',
      });
    }
  }

  function goToRequest(requestURL: string): void {
    const requestUUID = requestURL.split('/').pop() || '';

    navigate(`/${routes.VIEW_REQUEST.replace(':uuid', requestUUID)}`);
  }

  function handleQRCodeScannerError(): void {
    showNotification({
      type: 'warn',
      message: 'Aconteceu um erro no escaneador de QRCode',
    });
  }

  const { isAdmin, isBarmen, isWaiter } = getUserPermissions(userInfo.role);
  const isStaff = isAdmin || isBarmen || isWaiter;

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

      {isStaff && (
        <div className={styles.qrcodeScanner}>
          <QRCodeScanner
            fps={10}
            qrbox={250}
            onSuccess={goToRequest}
            onError={handleQRCodeScannerError}
          />
        </div>
      )}
    </section>
  );
}
