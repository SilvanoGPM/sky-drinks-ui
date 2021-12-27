import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Spin } from "antd";

import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import endpoints from "src/api/api";
import { AuthContext } from "src/contexts/AuthContext";
import { useFavicon } from "src/hooks/useFavicon";

import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";

import { cpfMask } from "src/utils/cpfMask";
import { getBirthDayDate } from "src/utils/formatDatabaseDate";
import { getUserPermissions } from "src/utils/getUserPermissions";
import { isUUID } from "src/utils/isUUID";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

type UserType = {
  uuid: string;
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
  birthDay: string;
};

type UserToUpdate = {
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
  birthDay: any;
};

export function EditUser() {
  useTitle("SkyDrinks - Editar usuário");
  useFavicon("blue");

  const [form] = useForm();

  const navigate = useNavigate();

  const location = useLocation();

  const params = useParams();

  const { userInfo, setUserInfo } = useContext(AuthContext);

  const [user, setUser] = useState<UserType>({} as UserType);
  const [infoLoading, setInfoLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  const permissions = getUserPermissions(userInfo.role);

  useEffect(() => {
    const isOwnerOrAdmin = params.uuid === userInfo.uuid || permissions.isAdmin;

    if (!isOwnerOrAdmin) {
      navigate(routes.HOME, {
        state: { warnMessage: "Você não possui permissão!" },
      });

      return () => setInfoLoading(false);
    }
  }, [userInfo, params, navigate, permissions]);

  useEffect(() => {
    const uuid = params.uuid || "";

    async function loadUser() {
      if (isUUID(uuid)) {
        try {
          const user = await endpoints.findUserByUUID(uuid);
          setUser(user);
        } catch (e: any) {
          showNotification({
            type: "warn",
            message: "Atualização de Usuário",
            description: e.message,
          });

          navigate(`/${location?.state?.back || routes.MANAGE_USERS}`);
        } finally {
          setInfoLoading(false);
        }
      } else {
        showNotification({
          type: "warn",
          message: "Insira um código de usuário válido!",
        });

        navigate(`/${location?.state?.back || routes.MANAGE_USERS}`);
      }
    }

    if (infoLoading) {
      loadUser();
    }
  }, [infoLoading, params, navigate, location]);

  function handleCPFChange(any: any) {
    form.setFieldsValue({ cpf: cpfMask(any.target.value) });
  }

  async function handleFormFinish(values: UserToUpdate) {
    try {
      setEditLoading(true);

      await endpoints.replaceUser({
        ...values,
        uuid: params.uuid || "",
        role: values.role || user.role,
        birthDay: moment(values.birthDay._d).format("yyyy-MM-DD"),
      });

      if (params.uuid === userInfo.uuid) {
        const userInfo = await endpoints.getUserInfo();
        setUserInfo(userInfo);
      }

      showNotification({
        type: "success",
        message: "Usuário foi atualizado com sucesso",
      });

      navigate(`/${location?.state?.back || routes.MANAGE_USERS}`);
    } catch (e: any) {
      const errors = e?.response?.data?.fieldErrors;

      const message = e?.response?.data?.details || e.message;

      const description = errors ? Object.values(errors).flat().join("\n") : "";

      showNotification({
        type: "error",
        message,
        description,
      });
    } finally {
      setEditLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Editar Usuário</h1>
      </div>

      {infoLoading ? (
        <div className={styles.loading}>
          <Spin />
        </div>
      ) : (
        <div>
          <Form
            form={form}
            labelCol={{ span: 8 }}
            onFinish={handleFormFinish}
            layout="horizontal"
            name="create-user"
            initialValues={{
              name: user.name,
              email: user.email,
              role: user.role,
              cpf: user.cpf,
              birthDay: moment(getBirthDayDate(user.birthDay, true)),
            }}
          >
            <Form.Item
              name="name"
              label="Nome"
              rules={[
                { required: true, message: "Insira o nome do usuário" },
                {
                  min: 3,
                  max: 250,
                  message: "O nome precisa ter entre 3 e 250 caracteres",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Insira o email do usuário" },
                { type: "email", message: "Insira um email válido" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              tooltip="Digite a senha para confimar as alterações"
              rules={[{ required: true, message: "Insira a senha do usuário" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Nova senha"
              tooltip="Deixe em branco caso não queria alterar a senha"
              rules={[
                {
                  min: 8,
                  message: "A senha precisa ter pelo menos 8 caracteres",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="cpf"
              label="CPF"
              rules={[
                { required: true, message: "Insira o CPF do usuário" },
                {
                  pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: "Insira um CPF válido",
                },
              ]}
            >
              <Input placeholder="123.456.789-10" onChange={handleCPFChange} />
            </Form.Item>

            <Form.Item
              name="birthDay"
              label="Data de nascimento"
              rules={[
                {
                  required: true,
                  message: "Insira a data de nascimento do usuário",
                },
              ]}
            >
              <DatePicker placeholder="ex: 2004/09/12" format="DD/MM/yyyy" />
            </Form.Item>

            {permissions.isAdmin && (
              <Form.Item
                name="role"
                label="Tipo"
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
            )}

            <Form.Item
              wrapperCol={{
                span: 24,
                offset: 0,
              }}
            >
              <Button
                loading={editLoading}
                icon={<PlusOutlined />}
                size="large"
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Editar Usuário
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
