import { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Input,
  Form,
  Select,
  Button,
  Switch,
  InputNumber,
  Upload,
  Result,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useNavigate } from "react-router-dom";

import { useTitle } from "src/hooks/useTitle";

import endpoints from "src/api/api";
import routes from "src/routes";

import styles from "./styles.module.scss";
import { showNotification } from "src/utils/showNotification";
import { DrinkIcon } from "src/components/custom/CustomIcons";
import { useFavicon } from "src/hooks/useFavicon";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { trimInput } from "src/utils/trimInput";
import { getFieldErrorsDescription, handleError } from "src/utils/handleError";
import { imageToFullURI, normalizeImage } from "src/utils/imageUtils";

interface DrinkCreateForm {
  volume: number;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string[];
  alcoholic: boolean;
}

const { Option } = Select;

export function CreateDrink() {
  useTitle("SkyDrinks - Criar bebida");
  useFavicon("green");

  const [form] = useForm();

  const navigate = useNavigate();

  const [image, setImage] = useState<File | string>();
  const [images, setImages] = useState<string[]>([]);
  const [created, setCreated] = useState(false);

  const [createLoading, setCreateLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);

  const [useExistsImage, setUseExistsImage] = useState(false);

  useEffect(() => {
    async function loadImages() {
      try {
        const files = await endpoints.getAllImagesWithoutPagination();

        setImages(files);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível carregar as imagens das bebidas",
        });
      } finally {
        setImagesLoading(false);
      }
    }

    if (imagesLoading) {
      loadImages();
    }
  }, [imagesLoading]);

  useEffect(() => {
    return () => {
      setImagesLoading(false);
    };
  }, []);

  function goBack() {
    navigate(`/${routes.MANAGE_DRINKS}`);
  }

  function stay() {
    form.resetFields();
    setCreated(false);
  }

  async function handleFormFinish(values: DrinkCreateForm) {
    try {
      setCreateLoading(true);

      const additional = values.additional
        ? values.additional.join(";").toLowerCase()
        : "";

      const drink = await endpoints.createDrink({
        ...values,
        volume: Math.round(values.volume),
        picture: image,
        additional,
      });

      showNotification({
        type: "success",
        message: "Bebida adicionada com sucesso!",
        description: `Nome: ${drink.name} / Preço: ${formatDisplayPrice(
          drink.price
        )}`,
      });

      setCreated(true);
    } catch (error: any) {
      const description = getFieldErrorsDescription(error);

      handleError({
        error,
        description,
        fallback: "Aconteceu um erro ao tentar criar bebida!",
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

  function handleSelectChange(value: string) {
    setImage(normalizeImage(value));
  }

  function handleRadioChange(event: RadioChangeEvent) {
    setUseExistsImage(event.target.value);
  }

  const onBlur = trimInput(form);

  return (
    <div className={styles.container}>
      {created ? (
        <div>
          <Result
            icon={<DrinkIcon style={{ color: "#52c41a" }} />}
            title="Bebida foi criada com sucesso!"
            subTitle="Você deseja voltar para o gerenciamento de bebidas, ou continuar criando bebidas?"
            extra={[
              <Button onClick={stay} type="primary" key="continue">
                Continuar
              </Button>,
              <Button onClick={goBack} key="back">
                Voltar
              </Button>,
            ]}
          />
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Adicionar Bebida</h2>

          <div>
            <div className={styles.selectImage}>
              <Radio.Group
                value={useExistsImage}
                options={[
                  { label: "Imagem já existente", value: true },
                  { label: "Upar imagem", value: false },
                ]}
                onChange={handleRadioChange}
                optionType="button"
                buttonStyle="solid"
              />
            </div>

            <Form
              form={form}
              onFinish={handleFormFinish}
              labelCol={{ span: 4 }}
              layout="horizontal"
              name="create-drink"
            >
              <Form.Item
                name="picture"
                label="Imagem"
                {...(!useExistsImage ? { valuePropName: "fileLists" } : {})}
              >
                {useExistsImage ? (
                  <Select
                    onChange={handleSelectChange}
                    loading={imagesLoading}
                    disabled={imagesLoading}
                    onClear={clearImage}
                    allowClear
                  >
                    {images.map((image) => (
                      <Option key={image} value={image}>
                        <div className={styles.imageItem}>
                          <img alt={image} src={imageToFullURI(image)} />
                          <p title={image}>{image}</p>
                        </div>
                      </Option>
                    ))}
                  </Select>
                ) : (
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
                )}
              </Form.Item>

              <Form.Item
                name="name"
                label="Nome"
                hasFeedback
                validateTrigger="onBlur"
                rules={[
                  {
                    required: true,
                    message: "Insira o nome da bebida",
                    whitespace: false,
                  },
                  {
                    min: 3,
                    max: 100,
                    message: "O nome precisa ter entre 3 e 100 caracteres",
                  },
                ]}
              >
                <Input onBlur={onBlur} />
              </Form.Item>

              <Form.Item name="description" label="Descrição">
                <Input.TextArea onBlur={onBlur} />
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
                hasFeedback
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
                <InputNumber decimalSeparator="," addonBefore="R$" />
              </Form.Item>

              <Form.Item
                name="volume"
                label="Volume"
                tooltip="A quantidade em mililitros dessa bebida"
                hasFeedback
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
        </>
      )}
    </div>
  );
}
