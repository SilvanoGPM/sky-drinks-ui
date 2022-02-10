import { useState } from 'react';
import { CheckOutlined, MailFilled, WalletOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import endpoints from 'src/api/api';
import { useTitle } from 'src/hooks/useTitle';
import { getFieldErrorsDescription, handleError } from 'src/utils/handleError';
import { ShakeIcon } from 'src/components/other/ShakeIcon';

import styles from './styles.module.scss';

interface VerifyTokenValues {
  token: string;
}

interface SecondStepProps {
  info: ResetPasswordType;
  setInfo: (info: ResetPasswordType) => void;
  setCurrent: (current: number) => void;
}

export function SecondStep({
  info,
  setInfo,
  setCurrent,
}: SecondStepProps): JSX.Element {
  useTitle('SkyDrinks - Confirmar código');

  const [form] = useForm();

  const [verify, setVerify] = useState(false);

  function goBack(): void {
    setCurrent(0);
  }

  async function handleVerifyToken(values: VerifyTokenValues): Promise<void> {
    try {
      setVerify(true);

      await endpoints.verifyPasswordResetToken({
        email: info.email,
        token: values.token.trim(),
      });

      setCurrent(2);
      setInfo({ ...info, token: values.token.trim() });
    } catch (error: any) {
      const fallback = 'Erro ao tentar verificar código.';

      const description = getFieldErrorsDescription(error);
      handleError({ error, fallback, description });
    } finally {
      setVerify(false);
    }
  }

  return (
    <>
      <div className={styles.header}>
        <ShakeIcon>
          <MailFilled style={{ fontSize: '3rem' }} />
        </ShakeIcon>

        <h2 className={styles.title}>Código de Confirmação</h2>

        <p className={styles.disclaimer}>
          O código de confirmação foi enviado para o E-mail{' '}
          <strong>{info.email}</strong>
          <br />
          Caso não tenha recebido,{' '}
          <span
            role="link"
            tabIndex={0}
            className={styles.link}
            onClick={goBack}
          >
            tente enviar novamente
          </span>
          .
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
        name="confirm-token"
        layout="vertical"
        onFinish={handleVerifyToken}
      >
        <Form.Item
          name="token"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o código de confirmação',
            },
          ]}
        >
          <Input
            placeholder="Insira o código de confirmação"
            prefix={<WalletOutlined />}
          />
        </Form.Item>

        <div className={styles.sendToken}>
          <Button
            loading={verify}
            icon={<CheckOutlined />}
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Confirmar código
          </Button>
        </div>
      </Form>
    </>
  );
}
