import { useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Input, Form, Select, Button, Switch, InputNumber, Upload, notification } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useNavigate } from "react-router-dom";

import { useTitle } from "src/hooks/useTitle";

import endpoints from "src/api/api";
import routes from "src/routes";

import styles from "./styles.module.scss";

type DrinkToCreate = {
  volume: number;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string[];
  alcoholic: boolean;
};

export function CreateDrink() {
  useTitle("SkyDrinks - Criar bebida");

  const [form] = useForm();

  const navigate = useNavigate();

  const [image, setImage] = useState<File>();
  const [createLoading, setCreateLoading] = useState(false);

  async function handleFormFinish(values: DrinkToCreate) {
    try {
      setCreateLoading(true);

      const drink = await endpoints.createDrink({
        ...values,
        picture: image,
        additional: values.additional ? values.additional.join(";").toLowerCase() : '',
      });

      notification.success({
        message: "Bebida adicionada com sucesso!",
        description: `Nome: ${drink.name} / Preço: R$ ${drink.price}`,
        duration: 5,
        placement: "bottomRight"
      });

      navigate(`/${routes.MANAGE_DRINKS}`);
    } catch (e: any) {
      notification.error({
        message: "Aconteceu um erro ao tentar criar bebida!",
        duration: 3,
        placement: "bottomRight"
      });

      form.resetFields();
    } finally {
      setCreateLoading(false);
    }
  }

  function dummyRequest({ file, onSuccess }: any) {
    setImage(file);
    return new Promise(() => onSuccess(file));
  }

  function clearImage() {
    setImage(undefined);
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Adicionar Bebida</h1>
      </div>

      <div>
        <Form
          form={form}
          onFinish={handleFormFinish}
          labelCol={{ span: 4 }}
          layout="horizontal"
          name="create-drink"
        >
          <Form.Item name="picture" label="Imagem" valuePropName="fileLists">
            <Upload
              maxCount={1}
              accept="image/png, image/jpeg"
              onRemove={clearImage}
              name="picture"
              listType="picture"
              customRequest={dummyRequest}
            >
              <Button icon={<UploadOutlined />}>Adicionar Imagem</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Nome"
            rules={[
              { required: true, message: "Insira o nome da bebida" },
              {
                min: 3,
                max: 100,
                message: "O nome precisa ter entre 3 e 100 caracteres",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Descrição">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="additional"
            label="Adicionais"
            tooltip="Produtos para complementar a bebida, você pode adicionar mais do que os que estão listados"
          >
            <Select mode="tags">
              <Select.Option value="gelo">gelo</Select.Option>
              <Select.Option value="limão">limão</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Preço"
            rules={[
              {
                type: "number",
                required: true,
                message: "Insira o preço da bebida",
              },
              {
                type: "number",
                min: 0,
                message: "O preço deve ser maior que zero",
              },
            ]}
          >
            <InputNumber addonBefore="R$" />
          </Form.Item>

          <Form.Item
            name="volume"
            label="Volume"
            tooltip="A quantidade em mililitros dessa bebida"
            rules={[
              { required: true, message: "Insira o volume da bebida" },
              {
                type: "number",
                min: 0,
                message: "O volume deve ser maior que zero",
              },
              {
                type: "number",
                max: 4000,
                message: "O volume deve ser menor que quatro mil",
              },
            ]}
          >
            <InputNumber addonAfter="ml" min={0} max={4000} />
          </Form.Item>

          <Form.Item name="alcoholic" label="Alcóolico" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
              offset: 0,
            }}
          >
            <Button
              loading={createLoading}
              icon={<PlusOutlined />}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              Adicionar Bebida
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
