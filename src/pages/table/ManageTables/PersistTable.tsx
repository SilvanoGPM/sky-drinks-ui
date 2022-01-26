import { useEffect } from 'react';
import { Form, InputNumber, Modal } from 'antd';

interface PersistTableProps {
  visible: boolean;
  title: string;
  seats?: number;
  number?: number;
  loading?: boolean;
  onFinish?: (values: any) => void;
  onCancel?: () => void;
}

export function PersistTable({
  visible,
  title,
  seats = 1,
  number = 1,
  loading = false,
  onFinish = () => undefined,
  onCancel = () => undefined,
}: PersistTableProps): JSX.Element {
  const [form] = Form.useForm();

  useEffect(() => {
    // eslint-disable-next-line
    if (form.__INTERNAL__.name) {
      form.setFieldsValue({
        seats,
        number,
      });
    }
  }, [form, seats, number]);

  function onOk(): void {
    form.submit();

    const allIsValid = Object.values(form.getFieldsValue()).every(
      (value) => value !== undefined
    );

    if (allIsValid) {
      onFinish(form.getFieldsValue());
    }
  }

  return (
    <Modal
      confirmLoading={loading}
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        name="create-table"
        initialValues={{
          number,
          seats,
        }}
      >
        <Form.Item
          name="number"
          label="Número"
          hasFeedback
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          name="seats"
          label="Assentos"
          hasFeedback
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={50} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
