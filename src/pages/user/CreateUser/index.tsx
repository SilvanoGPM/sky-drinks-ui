import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Result, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import routes from "src/routes";
import endpoints from "src/api/api";
import { useTitle } from "src/hooks/useTitle";
import { useFavicon } from "src/hooks/useFavicon";
import { cpfMask } from "src/utils/cpfMask";
import { formatToDatabaseDate } from "src/utils/formatDatabaseDate";
import { getFieldErrorsDescription, handleError } from "src/utils/handleError";
import { showNotification } from "src/utils/showNotification";
import { trimInput } from "src/utils/trimInput";

import styles from "./styles.module.scss";

interface UserCreateForm {
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
  birthDay: any;
}

export function CreateUser() {
  useTitle("SkyDrinks - Criar usuário");
  useFavicon("green");

  const [form] = useForm();

  const navigate = useNavigate();

  const [createLoading, setCreateLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function handleCPFChange(any: React.ChangeEvent<HTMLInputElement>) {
    form.setFieldsValue({ cpf: cpfMask(any.target.value) });
  }

  function goBack() {
    navigate(`/${routes.MANAGE_USERS}`);
  }

  function stay() {
    form.resetFields();
    setCreated(false);
  }

  async function handleFormFinish(values: UserCreateForm) {
    try {
      setCreateLoading(true);

      const user = await endpoints.createUser({
        ...values,
        birthDay: formatToDatabaseDate(values.birthDay._d),
      });

      showNotification({
        type: "success",
        message: "Usuário(s) criado(s) com sucesso",
        description: `Nome: ${user.name} / Email: ${user.email}`,
        duration: 2,
      });

      setCreated(true);
    } catch (error: any) {
      const description = getFieldErrorsDescription(error);
      const fallback = "Aconteceu um erro ao tentar criar o usuário";

      handleError({ error, fallback, description });
    } finally {
      setCreateLoading(false);
    }
  }

  const onBlur = trimInput(form);

  return (
    <section className={styles.container}>
      {created ? (
        <div>
          <Result
            icon={<UserAddOutlined style={{ color: "#52c41a" }} />}
            title="Usuário foi criado com sucesso!"
            subTitle="Você deseja voltar para o gerenciamento de usuários, ou continuar criando usuários?"
            extra={[
              <Button onClick={stay} type="primary" key="continue">
                Continuar
              </Button>,
              <Button onClick={goBack} key="back">
                Voltar
              </Button>,
            ]}
          />
        </div>
      ) : (
        <>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Criar Usuário</h1>
          </div>

          <div>
            <Form
              form={form}
              labelCol={{ span: 8 }}
              onFinish={handleFormFinish}
              layout="horizontal"
              name="create-user"
              initialValues={{ role: "USER" }}
            >
              <Form.Item
                name="name"
                label="Nome"
                hasFeedback
                rules={[
                  { required: true, message: "Insira o nome do usuário" },
                  {
                    min: 3,
                    max: 250,
                    message: "O nome precisa ter entre 3 e 250 caracteres",
                  },
                ]}
              >
                <Input onBlur={onBlur} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                hasFeedback
                rules={[
                  { required: true, message: "Insira o email do usuário" },
                  { type: "email", message: "Insira um email válido" },
                ]}
              >
                <Input onBlur={onBlur} />
              </Form.Item>

              <Form.Item
                name="password"
                label="Senha"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Insira uma senha para o usuário",
                  },
                  {
                    min: 8,
                    message: "A senha precisa ter pelo menos 8 caracteres",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirmar Senha"
                hasFeedback
                rules={[
                  { required: true, message: "Confirme a senha do usuário" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("As senhas não são iguais!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="cpf"
                label="CPF"
                hasFeedback
                rules={[
                  { required: true, message: "Insira o CPF do usuário" },
                  {
                    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                    message: "Insira um CPF válido",
                  },
                ]}
              >
                <Input
                  placeholder="123.456.789-10"
                  onChange={handleCPFChange}
                />
              </Form.Item>

              <Form.Item
                name="birthDay"
                label="Data de nascimento"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Insira a data de nascimento do usuário",
                  },
                ]}
              >
                <DatePicker placeholder="ex: 2004/09/12" format="DD/MM/yyyy" />
              </Form.Item>

              <Form.Item
                name="role"
                label="Tipo"
                hasFeedback
                rules={[
                  { required: true, message: "Escolha o tipo do usuário" },
                ]}
              >
                <Select>
                  <Select.Option value="USER">Usuário</Select.Option>
                  <Select.Option value="BARMEN">Barmen</Select.Option>
                  <Select.Option value="WAITER">Garçom</Select.Option>
                  <Select.Option value="USER,BARMEN,WAITER,ADMIN">
                    Admin
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  span: 24,
                  offset: 0,
                }}
              >
                <Button
                  loading={createLoading}
                  icon={<PlusOutlined />}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Criar Usuário
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </section>
  );
}
