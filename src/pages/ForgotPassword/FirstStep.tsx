import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import {
  LockFilled,
  MailOutlined,
  SendOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import endpoints from 'src/api/api';
import { getFieldErrorsDescription, handleError } from 'src/utils/handleError';

import styles from './styles.module.scss';

interface FirstStepProps {
  setCurrent: (current: number) => void;
}

interface SendTokenValues {
  email: string;
}

export function FirstStep({ setCurrent }: FirstStepProps): JSX.Element {
  const [form] = useForm();

  const [sending, setSending] = useState(false);

  async function nextStep(): Promise<void> {
    try {
      await form.validateFields();
      setCurrent(1);
    } catch (error: any) {
      console.error(error);
    }
  }

  async function handleSendToken(values: SendTokenValues): Promise<void> {
    const { email } = values;

    try {
      setSending(true);

      await endpoints.sendPasswordResetToken(email);
      await nextStep();

      setSending(false);
    } catch (error: any) {
      const description = getFieldErrorsDescription(error);
      handleError({ error, description });
    }
  }

  return (
    <>
      <div className={styles.header}>
        <LockFilled style={{ fontSize: '3rem' }} />

        <h2 className={styles.title}>Restaurar Senha</h2>

        <p className={styles.disclaimer}>
          Enviaremos seu código de restauração para o seu E-mail. Você precisa
          conter uma conta com esse E-mail em nossa plataforma.
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
        name="send-reset-token"
        layout="vertical"
        onFinish={handleSendToken}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'Insira um E-mail válido!',
            },
            {
              required: true,
              message: 'Por favor, insira um E-mail!',
            },
          ]}
        >
          <Input placeholder="Insira seu e-mail" prefix={<MailOutlined />} />
        </Form.Item>

        <div className={styles.sendToken}>
          <Button
            loading={sending}
            icon={<SendOutlined />}
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Enviar código de recuperação
          </Button>
        </div>

        <div className={styles.sendToken}>
          <Button
            loading={sending}
            onClick={nextStep}
            icon={<WalletOutlined />}
            style={{ width: '100%' }}
          >
            Já possuo um código
          </Button>
        </div>
      </Form>
    </>
  );
}
