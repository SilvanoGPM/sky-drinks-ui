import { useContext, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';
import { AuthContext } from 'src/contexts/AuthContext';
import { useFavicon } from 'src/hooks/useFavicon';
import { useTitle } from 'src/hooks/useTitle';
import { cpfMask } from 'src/utils/cpfMask';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import { getFieldErrorsDescription, handleError } from 'src/utils/handleError';
import { isUUID } from 'src/utils/isUUID';
import { showNotification } from 'src/utils/showNotification';
import { trimInput } from 'src/utils/trimInput';

import styles from './styles.module.scss';

interface UserEditForm {
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
  birthDay: any;
}

export function EditUser(): JSX.Element {
  useTitle('SkyDrinks - Editar usuário');
  useFavicon('blue');

  const [form] = useForm();

  const navigate = useNavigate();

  const location = useLocation();

  const params = useParams();

  const { userInfo, setUserInfo } = useContext(AuthContext);

  const [user, setUser] = useState<UserType>({} as UserType);
  const [infoLoading, setInfoLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  const permissions = getUserPermissions(userInfo.role);

  const isOwner = params.uuid === userInfo.uuid;
  const isOwnerOrAdmin = isOwner || permissions.isAdmin;

  useEffect(() => {
    if (!isOwnerOrAdmin) {
      navigate(routes.HOME, {
        state: { warnMessage: 'Você não possui permissão!' },
      });
    }
  }, [params, navigate, isOwnerOrAdmin]);

  useEffect(() => {
    const uuid = params.uuid || '';

    async function loadUser(): Promise<void> {
      if (isUUID(uuid)) {
        try {
          const userFound = await endpoints.findUserByUUID(uuid);
          setUser(userFound);
        } catch (error: any) {
          handleError({
            error,
            fallback: 'Não foi possível encontrar o usuário pelo UUID',
          });

          navigate(`/${location?.state?.back || routes.MANAGE_USERS}`);
        } finally {
          setInfoLoading(false);
        }
      } else {
        showNotification({
          type: 'warn',
          message: 'Insira um código de usuário válido!',
        });

        navigate(`/${location?.state?.back || routes.MANAGE_USERS}`);
      }
    }

    if (infoLoading) {
      loadUser();
    }
  }, [infoLoading, params, navigate, location]);

  useEffect(() => {
    return () => setInfoLoading(false);
  }, []);

  function handleCPFChange(any: any): void {
    form.setFieldsValue({ cpf: cpfMask(any.target.value) });
  }

  async function handleFormFinish(values: UserEditForm): Promise<void> {
    try {
      setEditLoading(true);

      const userWantsUpdate = {
        uuid: userInfo.uuid,
        email: userInfo.email,
        password: values.password,
      };

      await endpoints.replaceUser(
        {
          ...values,
          uuid: params.uuid || '',
          role: values.role || user.role,
          birthDay: values.birthDay
            ? moment(values.birthDay._d).format('yyyy-MM-DD')
            : user.birthDay,
        },
        userWantsUpdate
      );

      if (params.uuid === userInfo.uuid) {
        const userInfoFound = await endpoints.getUserInfo();
        setUserInfo(userInfoFound);
      }

      showNotification({
        type: 'success',
        message: 'Usuário foi atualizado com sucesso',
      });

      navigate(`/${location?.state?.back || routes.MANAGE_USERS}`);
    } catch (error: any) {
      const description = getFieldErrorsDescription(error);

      handleError({
        error,
        title: error.login ? 'Senha incorreta!' : undefined,
        description,
        fallback: 'Não foi possível editar o usuário',
      });
    } finally {
      setEditLoading(false);
    }
  }

  const onBlur = trimInput(form);

  return (
    <section className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Editar Usuário</h1>
      </div>

      {infoLoading ? (
        <LoadingIndicator />
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
              birthDay: moment(user.birthDay),
            }}
          >
            <Form.Item
              name="name"
              label="Nome"
              hasFeedback
              rules={[
                { required: true, message: 'Insira o nome do usuário' },
                {
                  min: 3,
                  max: 250,
                  message: 'O nome precisa ter entre 3 e 250 caracteres',
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
                { required: true, message: 'Insira o email do usuário' },
                { type: 'email', message: 'Insira um email válido' },
              ]}
            >
              <Input onBlur={onBlur} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              tooltip="Digite sua senha para confimar as alterações"
              hasFeedback
              rules={[{ required: true, message: 'Insira a senha do usuário' }]}
            >
              <Input.Password />
            </Form.Item>

            {isOwner && (
              <Form.Item
                name="newPassword"
                label="Nova senha"
                tooltip="Deixe em branco caso não queria alterar a senha"
                hasFeedback
                rules={[
                  {
                    min: 8,
                    message: 'A senha precisa ter pelo menos 8 caracteres',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item
              name="cpf"
              label="CPF"
              hasFeedback
              rules={[
                { required: true, message: 'Insira o CPF do usuário' },
                {
                  pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: 'Insira um CPF válido',
                },
              ]}
            >
              <Input placeholder="123.456.789-10" onChange={handleCPFChange} />
            </Form.Item>

            {permissions.isAdmin && (
              <>
                <Form.Item
                  name="birthDay"
                  label="Data de nascimento"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Insira a data de nascimento do usuário',
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="ex: 2004/09/12"
                    format="DD/MM/yyyy"
                  />
                </Form.Item>
                <Form.Item
                  name="role"
                  label="Tipo"
                  hasFeedback
                  rules={[
                    { required: true, message: 'Escolha o tipo do usuário' },
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
              </>
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
                style={{ width: '100%' }}
              >
                Editar Usuário
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </section>
  );
}
