import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { useNavigate, useParams } from "react-router-dom";

import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  Spin,
  Switch,
  Upload,
} from "antd";

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

type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

export function EditDrink() {
  useTitle("SkyDrinks - Editar bebida");

  const [form] = useForm();

  const navigate = useNavigate();

  const params = useParams();

  const [image, setImage] = useState<File>();
  const [drink, setDrink] = useState<DrinkType>({} as DrinkType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDrink() {
      try {
        const drink = await endpoints.findDrinkByUUID(params.uuid);
        setDrink(drink);
      } catch (e: any) {
        notification.warn({
          message: "Atualização de Bebida",
          description: e.message,
          duration: 3,
          placement: "bottomRight",
        });

        navigate(`/${routes.MANAGE_DRINKS}`);
      }

      setLoading(false);
    }

    if (loading) {
      loadDrink();
    }
  }, [loading, params, navigate]);

  async function handleFormFinish(values: DrinkToCreate) {
    try {
      await endpoints.replaceDrink({
        ...values,
        uuid: params.uuid || "",
        picture: image,
        additional: values.additional
          ? values.additional.join(";").toLowerCase()
          : "",
      });

      notification.success({
        message: "Bebida atualizada com sucesso!",
        duration: 5,
        placement: "bottomRight",
      });

      navigate(`/${routes.MANAGE_DRINKS}`);
    } catch (e: any) {
      notification.error({
        message: "Aconteceu um erro ao tentar atualizar",
        duration: 3,
        placement: "bottomRight",
      });
    }
  }

  function dummyRequest({ file, onSuccess }: any) {
    setImage(file);
    return new Promise(() => onSuccess(file));
  }

  function clearImage() {
    setImage(undefined);
  }

  function removePicture() {
    setDrink({
      ...drink,
      picture: "",
    });

    clearImage();
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Editar Bebida</h1>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spin />
        </div>
      ) : (
        <div>
          <Form
            form={form}
            onFinish={handleFormFinish}
            labelCol={{ span: 4 }}
            initialValues={{
              name: drink.name,
              description: drink.description,
              price: drink.price,
              volume: drink.volume,
              additional: drink.additionalList,
              alcoholic: drink.alcoholic,
            }}
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
                <Button icon={<UploadOutlined />}>Atualizar Imagem</Button>
              </Upload>
            </Form.Item>

            {(drink.picture && !drink.picture.endsWith("null") && !image) && (
              <Form.Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 4 } }}>
                <div className={styles.image}>
                  <div className={styles.info}>
                    <figure>
                      <img
                        src={drink.picture}
                        alt={`Imagem de ${drink.name}`}
                      />
                    </figure>

                    <p>{drink.picture.split("/").slice(-1)[0]}</p>
                  </div>

                  <Button type="text" onClick={removePicture}>
                    <DeleteOutlined />
                  </Button>
                </div>
              </Form.Item>
            )}

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

            <Form.Item
              name="alcoholic"
              label="Alcóolico"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
                offset: 0,
              }}
            >
              <Button
                icon={<PlusOutlined />}
                size="large"
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Atualizar Bebida
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
