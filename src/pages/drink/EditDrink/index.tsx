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
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Switch,
  Upload,
} from "antd";

import { useTitle } from "src/hooks/useTitle";

import endpoints, { imageToFullURI } from "src/api/api";
import routes from "src/routes";

import styles from "./styles.module.scss";
import { showNotification } from "src/utils/showNotification";
import { useFavicon } from "src/hooks/useFavicon";
import { isUUID } from "src/utils/isUUID";
import { trimInput } from "src/utils/trimInput";
import { getFieldErrorsDescription, handleError } from "src/utils/handleError";
import { Loading } from "src/components/layout/Loading";
import { normalizeImage } from "src/utils/imageUtils";

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

const { confirm } = Modal;
const { Option } = Select;

export function EditDrink() {
  useTitle("SkyDrinks - Editar bebida");
  useFavicon("blue");

  const [form] = useForm();

  const navigate = useNavigate();

  const params = useParams();

  const [image, setImage] = useState<File | string>();
  const [images, setImages] = useState<string[]>([]);

  const [drink, setDrink] = useState<DrinkType>({} as DrinkType);

  const [drinkLoading, setDrinkLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  const [useExistsImage, setUseExistsImage] = useState(false);

  useEffect(() => {
    const uuid = params.uuid || "";

    async function loadDrink() {
      if (isUUID(uuid)) {
        try {
          const drink = await endpoints.findDrinkByUUID(uuid);
          setDrink(drink);
        } catch (error: any) {
          const description = getFieldErrorsDescription(error);

          handleError({
            error,
            description,
            fallback: "Não foi possível encontrar bebida",
          });

          navigate(`/${routes.MANAGE_DRINKS}`);
        } finally {
          setDrinkLoading(false);
        }
      } else {
        showNotification({
          type: "warn",
          message: "Insira um código de bebida válido para ser atualizada.",
        });

        navigate(`/${routes.MANAGE_DRINKS}`);
      }
    }

    if (drinkLoading) {
      loadDrink();
    }
  }, [drinkLoading, params, navigate]);

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
      setDrinkLoading(false);
      setImagesLoading(false);
    };
  }, []);

  function handleFormFinish(values: DrinkToCreate) {
    async function update() {
      try {
        setEditLoading(true);

        await endpoints.replaceDrink({
          ...values,
          uuid: params.uuid || "",
          picture: image || drink.picture.split("/").pop(),
          additional: values.additional
            ? values.additional.join(";").toLowerCase()
            : "",
        });

        showNotification({
          type: "success",
          message: "Bebida atualizada com sucesso!",
        });

        navigate(`/${routes.MANAGE_DRINKS}`);
      } catch (e: any) {
        showNotification({
          type: "error",
          message: "Aconteceu um erro ao tentar atualizar!",
        });
      } finally {
        setEditLoading(false);
      }
    }

    confirm({
      title: "Tem certeza que deseja atualizar essa bebida?",
      okText: "Sim",
      cancelText: "Não",
      onOk: update,
    });
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

  function handleSelectChange(value: string) {
    setImage(normalizeImage(value));
  }

  function handleRadioChange(event: RadioChangeEvent) {
    setUseExistsImage(event.target.value);
  }

  const onBlur = trimInput(form);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Editar Bebida</h2>

      {drinkLoading ? (
        <Loading />
      ) : (
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
                  size="large"
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
                  <Button icon={<UploadOutlined />}>Atualizar Imagem</Button>
                </Upload>
              )}
            </Form.Item>

            {drink.picture && !drink.picture.endsWith("null") && !image && !useExistsImage && (
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
              hasFeedback
              rules={[
                { required: true, message: "Insira o nome da bebida" },
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
                loading={editLoading}
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