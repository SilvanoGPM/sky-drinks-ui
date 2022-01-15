import { DatePicker, FormInstance } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";

import { Form, Button, Drawer, Input, Divider, Select, Slider } from "antd";

import { RequestSearchFormForAdmins, RequestStatusType } from "src/types/requests";
import { getStatusBadge } from "src/utils/getStatusBadge";
import { trimInput } from "src/utils/trimInput";

interface SearchRequestsDrawerProps {
  form: FormInstance;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onFinish: (values: RequestSearchFormForAdmins) => void;
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const status = ["PROCESSING", "FINISHED", "CANCELED"] as RequestStatusType[];

export function SearchRequestsDrawer({
  form,
  visible,
  setVisible,
  onFinish,
}: SearchRequestsDrawerProps) {
  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;

  function closeDrawer() {
    setVisible(false);
  }

  function clearForm() {
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
          delivered: "-1",
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

        <Form.Item label="Entrega do pedido" name="delivered">
          <Select>
            <Option value="0">Não entregado</Option>
            <Option value="1">Entregado</Option>
            <Option value="-1">Ambos</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Preço" name="price">
          <Slider
            range={{ draggableTrack: true }}
            min={0}
            max={1000}
            tipFormatter={(value) => `R$ ${value}`}
            marks={{
              1: "R$ 1",
              250: "R$ 250",
              500: "R$ 500",
              1000: "R$ 1000",
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

        <Divider orientation="left">Usuário</Divider>

        <Form.Item label="Nome do usuário" name="userName">
          <Input onBlur={onBlur} placeholder="ex: Roger" />
        </Form.Item>

        <Form.Item label="Email do usuário" name="userEmail">
          <Input onBlur={onBlur} placeholder="ex: roger@mail.com" />
        </Form.Item>

        <Form.Item label="CPF do usuário" name="userCpf">
          <Input onBlur={onBlur} placeholder="ex: 660.382.138-99" />
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
