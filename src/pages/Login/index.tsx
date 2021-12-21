import { useContext } from "react";
import { LoginOutlined } from "@ant-design/icons";
import { Input, Form, Button, Checkbox, notification } from "antd";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "src/contexts/AuthContext";
import { useTitle } from "src/hooks/useTitle";

import routes from "src/routes";

import styles from "./styles.module.scss";
import loginImage from "src/assets/login-image.jpg";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function Login() {
  useTitle("SkyDrinks - Login");

  const location = useLocation();

  const { authLoading, handleLogin, authenticated } = useContext(AuthContext);

  async function handleFormLogin(values: LoginValues) {
    try {
      await handleLogin(values);

      notification.success({
        message: "Login efetuado com sucesso!",
        duration: 3,
        placement: "bottomRight",
      });
    } catch (e: any) {
      notification.error({
        message: e.message,
        duration: 4,
        placement: "bottomRight",
      });
    }

  }

  if (authenticated) {
    const path = location?.state?.path || routes.HOME;
    return <Navigate to={path} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <h1 className={styles.title}>Seja bem vindo!</h1>

          <h2 className={styles.subtitle}>Login</h2>

          <Form
            name="login"
            layout="vertical"
            onFinish={handleFormLogin}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Insiria um E-mail válido!",
                },
              ]}
            >
              <Input placeholder="joao@mail.com" />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: "Insira sua senha!" }]}
            >
              <Input.Password />
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
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </div>

        <figure className={styles.figure}>
          <img
            alt="login form"
            src={loginImage}
          />
        </figure>
      </div>
    </div>
  );
}
