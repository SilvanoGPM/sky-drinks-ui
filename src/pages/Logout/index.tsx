import { useContext } from 'react';
import { HeartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { animated } from 'react-spring';

import routes from 'src/routes';
import { AuthContext } from 'src/contexts/AuthContext';
import { useZoomInAnimation } from 'src/hooks/useZoomInAnimation';
import { useTitle } from 'src/hooks/useTitle';
import { showNotification } from 'src/utils/showNotification';
import { RequestContext } from 'src/contexts/RequestContext';

import styles from './styles.module.scss';

export function Logout(): JSX.Element {
  useTitle('SkyDrinks - Sair');

  const { handleLogout } = useContext(AuthContext);
  const { clearRequest, request } = useContext(RequestContext);

  const navigate = useNavigate();

  const [props] = useZoomInAnimation();

  function goBack(): void {
    navigate(-1);
  }

  function logout(): void {
    clearRequest();
    handleLogout();

    navigate(routes.LOGIN);

    showNotification({
      type: 'success',
      message: 'Deslogado com sucesso',
    });
  }

  return (
    <section className={styles.container}>
      <animated.div className={styles.card} style={props}>
        <h2>Você quer mesmo sair?</h2>

        {Boolean(request.drinks.length) && (
          <p className={styles.warn}>
            Seu pedido não foi efetuado, logo, será perdido caso você deslogue.
          </p>
        )}

        <div className={styles.buttons}>
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            size="large"
            style={{
              color: '#ffffff',
              borderColor: '#e74c3c',
              backgroundColor: '#e74c3c',
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
      </animated.div>
    </section>
  );
}
