import {
  DeleteOutlined,
  DownOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';

import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
} from 'antd';

import { trimInput } from 'src/utils/trimInput';

interface UsersDrawerProps {
  form: FormInstance;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onFinish: (values: UserSearchForm) => void;
}

const { Option } = Select;

export function UsersDrawer({
  form,
  visible,
  setVisible,
  onFinish,
}: UsersDrawerProps): JSX.Element {
  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;
  const onBlur = trimInput(form);

  function clearForm(): void {
    form.resetFields();
  }

  function closeDrawer(): void {
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
        initialValues={{
          lockRequests: '-1',
          sort: {
            order: 'createdAt',
            sort: 'asc',
          },
        }}
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

        <Divider orientation="left">Organizar</Divider>

        <Form.Item label="Organizar por">
          <Space>
            <Form.Item name={['sort', 'order']}>
              <Select>
                <Option value="createdAt">Data de criação</Option>
                <Option value="updatedAt">Data de atualização</Option>
                <Option value="name">Nome</Option>
                <Option value="email">Email</Option>
                <Option value="birthDay">Data de nasicmento</Option>
              </Select>
            </Form.Item>

            <Form.Item name={['sort', 'sort']}>
              <Select>
                <Option value="asc">
                  <p>
                    <UpOutlined /> Ascendente
                  </p>
                </Option>

                <Option value="desc">
                  <p>
                    <DownOutlined /> Descendente
                  </p>
                </Option>
              </Select>
            </Form.Item>
          </Space>
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
            style={{ width: '100%' }}
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
            style={{ width: '100%' }}
            onClick={clearForm}
          >
            Limpar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
