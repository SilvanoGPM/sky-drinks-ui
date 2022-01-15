import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Drawer, Form, FormInstance, Input, Select } from "antd";

import { trimInput } from "src/utils/trimInput";
import { UserSearchForm } from "src/types/user";

interface UsersDrawerProps {
  form: FormInstance;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onFinish: (values: UserSearchForm) => void;
}

const { Option } = Select;

export function UsersDrawer({ form, visible, setVisible, onFinish }: UsersDrawerProps) {
  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;
  const onBlur = trimInput(form);

  function clearForm() {
    form.resetFields();
  }

  function closeDrawer() {
    setVisible(false);
  }

  return (
    <Drawer
      width={drawerWidth}
      title="Pesquisar Usuário"
      placement="right"
      onClose={closeDrawer}
      visible={visible}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ flex: 1 }}
        name="search-users"
        autoComplete="off"
        initialValues={{ lockRequests: "-1" }}
      >
        <Divider orientation="left">Geral</Divider>

        <Form.Item label="Nome" name="name">
          <Input onBlur={onBlur} placeholder="ex: Roger" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input onBlur={onBlur} placeholder="ex: roger@mail.com" />
        </Form.Item>

        <Form.Item label="CPF" name="cpf">
          <Input onBlur={onBlur} />
        </Form.Item>

        <Form.Item label="Cargo" name="role">
          <Select mode="multiple">
            <Option value="USER">Usuário</Option>
            <Option value="BARMEN">Barmen</Option>
            <Option value="WAITER">Garçom</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Bloqueamento de pedidos" name="lockRequests">
          <Select>
            <Option value="1">Bloqueados</Option>
            <Option value="0">Não bloqueados</Option>
            <Option value="-1">Ambos</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Data de nascimento" name="birthDay">
          <DatePicker />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
            offset: 0,
          }}
        >
          <Button
            icon={<SearchOutlined />}
            size="large"
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Pesquisar
          </Button>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
            offset: 0,
          }}
        >
          <Button
            icon={<DeleteOutlined />}
            size="large"
            style={{ width: "100%" }}
            onClick={clearForm}
          >
            Limpar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
