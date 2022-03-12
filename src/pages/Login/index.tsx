import { useContext, useState } from 'react';
import { Input, Form, Button, Checkbox, Spin, Tooltip } from 'antd';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useSpring, animated, useChain, useSpringRef } from 'react-spring';

import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';

import routes from 'src/routes';
import { AuthContext } from 'src/contexts/AuthContext';
import { useTitle } from 'src/hooks/useTitle';
import { showNotification } from 'src/utils/showNotification';
import { useFlashNotification } from 'src/hooks/useFlashNotification';
import { handleError } from 'src/utils/handleError';
import { ShakeIcon } from 'src/components/other/ShakeIcon';
import { DrinkIcon } from 'src/components/custom/CustomIcons';

import loginImage from 'src/assets/login-image.jpg';
import styles from './styles.module.scss';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

const animationConfig = {
  tension: 300,
  friction: 20,
};

export function Login(): JSX.Element {
  useTitle('SkyDrinks - Login');

  const location = useLocation();

  const slideInRef = useSpringRef();
  const showRef = useSpringRef();
  const inputRef = useSpringRef();

  const slideInProps = useSpring({
    ref: slideInRef,
    from: { y: 200 },
    to: { y: 0 },
    config: animationConfig,
  });

  const showOptions = {
    from: { opacity: 0.5, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: animationConfig,
  };

  const showProps = useSpring({
    ref: showRef,
    ...showOptions,
  });

  const inputProps = useSpring({
    ref: inputRef,
    ...showOptions,
  });

  useChain([slideInRef, showRef, inputRef], [0, 0.2, 0.4]);

  const { authLoading, handleLogin, authenticated } = useContext(AuthContext);

  const [loadingImage, setLoadingImage] = useState(true);

  useFlashNotification(routes.LOGIN);

  async function handleFormLogin(values: LoginValues): Promise<void> {
    try {
      await handleLogin(values);

      showNotification({
        type: 'success',
        message: 'Login efetuado com sucesso!',
      });
    } catch (error: any) {
      handleError({
        error,
        fallback: 'Não foi possível efetuar o login',
      });
    }
  }

  function endImageLoad(): void {
    setLoadingImage(false);
  }

  if (authenticated) {
    const path = location?.state?.path || routes.HOME;
    return <Navigate to={path} />;
  }

  return (
    <>
      <main className={styles.mainContainer}>
        <animated.section
          className={styles.formContainer}
          style={{ ...slideInProps, ...showProps }}
        >
          <div className={styles.form}>
            <div className={styles.header}>
              <ShakeIcon>
                <UserOutlined style={{ fontSize: '3rem' }} />
              </ShakeIcon>

              <h1 className={styles.title}>Login</h1>

              <svg
                className={styles.curve}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="#ffffff"
                  fillOpacity="1"
                  d="M0,96L80,80C160,64,320,32,480,58.7C640,85,800,171,960,181.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                />
              </svg>
            </div>

            <Form
              style={{ padding: '1rem' }}
              name="login"
              layout="vertical"
              onFinish={handleFormLogin}
              initialValues={{ remember: true }}
            >
              <animated.div style={inputProps}>
                <Form.Item
                  hasFeedback
                  label="Email"
                  name="email"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Insiria um E-mail válido!',
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="joao@mail.com"
                  />
                </Form.Item>
              </animated.div>

              <animated.div style={inputProps}>
                <Form.Item
                  label="Senha"
                  name="password"
                  hasFeedback
                  rules={[{ required: true, message: 'Insira sua senha!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
              </animated.div>

              <animated.div style={inputProps}>
                <div className={styles.forgotPassword}>
                  <Link
                    className={styles.animatedLink}
                    to={routes.FORGOT_PASSWORD}
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              </animated.div>

              <animated.div style={inputProps}>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Lembrar de mim</Checkbox>
                </Form.Item>
              </animated.div>

              <animated.div style={inputProps}>
                <Form.Item
                  wrapperCol={{
                    span: 24,
                    offset: 0,
                  }}
                >
                  <Button
                    style={{ width: '100%' }}
                    icon={<LoginOutlined />}
                    type="primary"
                    htmlType="submit"
                    loading={authLoading}
                    shape="round"
                    size="large"
                  >
                    Entrar
                  </Button>
                </Form.Item>
              </animated.div>
            </Form>
          </div>

          <figure className={styles.figure}>
            {loadingImage && <Spin />}
            <img alt="" src={loginImage} onLoad={endImageLoad} />
          </figure>
        </animated.section>
      </main>

      <div className={styles.bottomButton}>
        <Tooltip title="Ver últimas bebidas" placement="left">
          <Link to={routes.HOME}>
            <Button
              style={{ minWidth: 50, minHeight: 50 }}
              shape="circle"
              type="primary"
              icon={<DrinkIcon style={{ fontSize: 25 }} />}
            />
          </Link>
        </Tooltip>
      </div>
    </>
  );
}
