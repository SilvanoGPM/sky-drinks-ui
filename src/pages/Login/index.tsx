import { useContext, useState } from "react";
import {
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Form, Button, Checkbox, Spin } from "antd";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "src/contexts/AuthContext";
import { useTitle } from "src/hooks/useTitle";

import routes from "src/routes";

import styles from "./styles.module.scss";
import loginImage from "src/assets/login-image.jpg";
import { showNotification } from "src/utils/showNotification";
import { useFlashNotification } from "src/hooks/useFlashNotification";
import { handleError } from "src/utils/handleError";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function Login() {
  useTitle("SkyDrinks - Login");

  const location = useLocation();

  const { authLoading, handleLogin, authenticated } = useContext(AuthContext);

  const [loadingImage, setLoadingImage] = useState(true);

  useFlashNotification(routes.LOGIN);

  async function handleFormLogin(values: LoginValues) {
    try {
      await handleLogin(values);

      showNotification({
        type: "success",
        message: "Login efetuado com sucesso!",
      });
    } catch (error: any) {
      handleError({
        error,
        fallback: "Não foi possível efetuar o login",
      });
    }
  }

  function endImageLoad() {
    setLoadingImage(false);
  }

  if (authenticated) {
    const path = location?.state?.path || routes.HOME;
    return <Navigate to={path} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <UserOutlined />
            </div>

            <h1 className={styles.title}>Login</h1>

            <svg className={styles.curve} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L80,80C160,64,320,32,480,58.7C640,85,800,171,960,181.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              ></path>
            </svg>
          </div>

          <Form
            style={{ padding: "1rem" }}
            name="login"
            layout="vertical"
            onFinish={handleFormLogin}
            initialValues={{ remember: true }}
          >
            <Form.Item
              hasFeedback
              label="Email"
              name="email"
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Insiria um E-mail válido!",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="joao@mail.com" />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              hasFeedback
              rules={[{ required: true, message: "Insira sua senha!" }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Lembrar de mim</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
                offset: 0,
              }}
            >
              <Button
                style={{ width: "100%" }}
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
          </Form>
        </div>

        <figure className={styles.figure}>
          {loadingImage && <Spin />}
          <img alt="" src={loginImage} onLoad={endImageLoad} />
        </figure>
      </div>
    </div>
  );
}
