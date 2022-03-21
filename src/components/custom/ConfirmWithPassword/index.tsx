import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Modal, ModalProps } from 'antd';
import { useContext, useState } from 'react';
import endpoints from 'src/api/api';
import { AuthContext } from 'src/contexts/AuthContext';

import styles from './styles.module.scss';

interface ConfirmWithPasswordProps extends Omit<ModalProps, 'onOk'> {
  children: React.ReactNode;
  callback: () => void | Promise<void>;
}

export function ModalWithPassword({
  children,
  callback,
  ...props
}: ConfirmWithPasswordProps): JSX.Element {
  const { userInfo } = useContext(AuthContext);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  function openModal(): void {
    setVisible(true);
  }

  function closeModal(): void {
    setVisible(false);
  }

  async function handleOk(): Promise<void> {
    const { password } = form.getFieldsValue();

    try {
      setConfirmLoading(true);

      await endpoints.login(userInfo.email, password);

      await callback();

      form.resetFields();

      closeModal();
    } catch {
      form.setFields([
        { name: 'password', value: password, errors: ['Senha incorreta!'] },
      ]);
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <>
      <div
        className={styles.button}
        role="button"
        tabIndex={0}
        onClick={openModal}
      >
        {children}
      </div>

      <Modal
        {...props}
        visible={visible}
        onOk={handleOk}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
      >
        <Form name="modal-confirm" layout="vertical" form={form}>
          <Form.Item label="Senha" name="password" hasFeedback>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
