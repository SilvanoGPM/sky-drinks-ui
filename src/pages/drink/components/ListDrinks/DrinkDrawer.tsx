import {
  DeleteOutlined,
  DownOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';

import {
  Button,
  Divider,
  Drawer,
  Form,
  FormInstance,
  Input,
  Select,
  Slider,
  Space,
} from 'antd';

import { trimInput } from 'src/utils/trimInput';

interface DrinkDrawerProps {
  form: FormInstance;
  visible: boolean;
  onFinish: (values: DrinkSearchForm) => void;
  setVisible: (visible: boolean) => void;
}

const { Option } = Select;

export function DrinkDrawer({
  form,
  onFinish,
  visible,
  setVisible,
}: DrinkDrawerProps): JSX.Element {
  function closeDrawer(): void {
    setVisible(false);
  }

  function clearForm(): void {
    form.resetFields();
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;

  const onBlur = trimInput(form);

  return (
    <Drawer
      width={drawerWidth}
      title="Pesquisar bebida"
      placement="right"
      onClose={closeDrawer}
      visible={visible}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ flex: 1 }}
        initialValues={{
          alcoholic: '-1',
          volume: [110, 2000],
          price: [0, 90],
          sort: {
            order: 'createdAt',
            sort: 'asc',
          },
        }}
        name="search-drinks"
        autoComplete="off"
      >
        <Divider orientation="left">Geral</Divider>

        <Form.Item label="Nome" name="name">
          <Input onBlur={onBlur} placeholder="ex: Blood Mary" />
        </Form.Item>

        <Form.Item label="Descrição" name="description">
          <Input.TextArea onBlur={onBlur} placeholder="ex: Drink Refrescante" />
        </Form.Item>

        <Form.Item label="Tipo da bebida" name="alcoholic">
          <Select>
            <Option value="-1">Ambos</Option>
            <Option value="0">Não alcóolico</Option>
            <Option value="1">Alcóolico</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Preço" name="price">
          <Slider
            range={{ draggableTrack: true }}
            tipFormatter={(value) => `R$ ${value}`}
            min={1}
            max={1000}
            marks={{
              1: 'R$ 1',
              250: 'R$ 250',
              500: 'R$ 500',
              1000: 'R$ 1000',
            }}
          />
        </Form.Item>

        <Form.Item label="Volume" name="volume">
          <Slider
            range={{ draggableTrack: true }}
            min={100}
            max={4000}
            tipFormatter={(value) => `${value}ml`}
            marks={{
              100: '100 ml',
              2000: '2000 ml',
              4000: '4000 ml',
            }}
          />
        </Form.Item>

        <Form.Item label="Adicionais" name="additional">
          <Select mode="tags" placeholder="ex: gelo" />
        </Form.Item>

        <Divider orientation="left">Organizar</Divider>

        <Form.Item label="Organizar por">
          <Space>
            <Form.Item name={['sort', 'order']}>
              <Select>
                <Option value="createdAt">Data de criação</Option>
                <Option value="name">Nome</Option>
                <Option value="price">Preço</Option>
                <Option value="volume">Volume</Option>
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
