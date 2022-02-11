import {
  DeleteOutlined,
  DownOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';

import {
  Form,
  Button,
  Drawer,
  Input,
  Divider,
  Select,
  Slider,
  FormInstance,
  DatePicker,
  Space,
} from 'antd';

import { getStatusBadge } from 'src/utils/getStatusBadge';
import { trimInput } from 'src/utils/trimInput';

interface MyRequestsDrawerProps {
  form: FormInstance;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onFinish: (values: RequestSearchForm) => void;
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const status = ['PROCESSING', 'FINISHED', 'CANCELED'] as RequestStatusType[];

export function MyRequestsDrawer({
  form,
  visible,
  setVisible,
  onFinish,
}: MyRequestsDrawerProps): JSX.Element {
  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;

  function closeDrawer(): void {
    setVisible(false);
  }

  function clearForm(): void {
    form.resetFields();
  }

  const onBlur = trimInput(form);

  return (
    <Drawer
      width={drawerWidth}
      title="Pesquisar pedido"
      placement="right"
      onClose={closeDrawer}
      visible={visible}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ flex: 1 }}
        initialValues={{
          price: [0, 200],
          sort: {
            order: 'updatedAt',
            sort: 'desc',
          },
        }}
        name="search-requests"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Divider orientation="left">Pedido</Divider>

        <Form.Item label="Pedido realizado em" name="createdAt">
          <RangePicker />
        </Form.Item>

        <Form.Item label="Status do pedido" name="status">
          <Select allowClear>
            {status.map((value) => (
              <Option key={value} value={value}>
                {getStatusBadge(value)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Preço" name="price">
          <Slider
            range={{ draggableTrack: true }}
            min={1}
            max={1000}
            tipFormatter={(value) => `R$ ${value}`}
            marks={{
              1: 'R$ 1',
              250: 'R$ 250',
              500: 'R$ 500',
              1000: 'R$ 1000',
            }}
          />
        </Form.Item>

        <Divider orientation="left">Bebida</Divider>

        <Form.Item label="Nome da bebida" name="drinkName">
          <Input onBlur={onBlur} placeholder="ex: Blood Mary" />
        </Form.Item>

        <Form.Item label="Descrição da bebida" name="drinkDescription">
          <Input.TextArea onBlur={onBlur} placeholder="ex: Drink Refrescante" />
        </Form.Item>

        <Divider orientation="left">Organizar</Divider>

        <Form.Item label="Organizar por">
          <Space>
            <Form.Item name={['sort', 'order']}>
              <Select>
                <Option value="createdAt">Data de criação</Option>
                <Option value="updatedAt">Data de atualização</Option>
                <Option value="totalPrice">Preço total</Option>
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
