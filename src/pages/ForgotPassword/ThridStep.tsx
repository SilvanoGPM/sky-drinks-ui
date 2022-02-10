import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useNavigate } from 'react-router-dom';

import { CheckOutlined, SafetyOutlined } from '@ant-design/icons';

import { useTitle } from 'src/hooks/useTitle';
import endpoints from 'src/api/api';
import { getFieldErrorsDescription, handleError } from 'src/utils/handleError';
import routes from 'src/routes';

import styles from './styles.module.scss';

interface ResetPasswordValues {
  password: string;
}

interface ThridStepProps {
  info: ResetPasswordType;
}

export function ThridStep({ info }: ThridStepProps): JSX.Element {
  useTitle('SkyDrinks - Resetar senha');

  const navigate = useNavigate();

  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  async function handleSendToken(values: ResetPasswordValues): Promise<void> {
    try {
      setLoading(true);

      await endpoints.confirmPasswordResetToken({
        ...info,
        password: values.password.trim(),
      });

      navigate(routes.LOGIN, {
        state: { success: { message: 'Senha alterada com sucesso!' } },
      });
    } catch (error: any) {
      const fallback = 'Erro ao tentar enviar alterar senha.';

      const description = getFieldErrorsDescription(error);
      handleError({ error, fallback, description });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.header}>
        <SafetyOutlined style={{ fontSize: '3rem' }} />

        <h2 className={styles.title}>Restaurar Senha</h2>

        <p className={styles.disclaimer}>
          O código de confirmação é válido. Você já pode restaurar a sua senha.
        </p>

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
        form={form}
        style={{ padding: '1rem' }}
        name="reset-password"
        layout="vertical"
        onFinish={handleSendToken}
      >
        <Form.Item
          name="password"
          label="Senha"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Insira a nova senha',
            },
            {
              min: 8,
              message: 'A senha precisa ter pelo menos 8 caracteres',
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
            { required: true, message: 'Confirme a nova senha' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('As senhas não são iguais!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div className={styles.sendToken}>
          <Button
            loading={loading}
            icon={<CheckOutlined />}
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Restaurar senha
          </Button>
        </div>
      </Form>
    </>
  );
}
