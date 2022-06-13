import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';

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
} from 'antd';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { useTitle } from 'src/hooks/useTitle';
import { showNotification } from 'src/utils/showNotification';
import { useFavicon } from 'src/hooks/useFavicon';
import { isUUID } from 'src/utils/isUUID';
import { trimInput } from 'src/utils/trimInput';
import { getFieldErrorsDescription, handleError } from 'src/utils/handleError';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';

import styles from './styles.module.scss';
import { useImages } from '../hooks/useImages';

interface DrinkEditForm {
  volume: number;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string[];
  alcoholic: boolean;
}

const { confirm } = Modal;
const { Option } = Select;

export function EditDrink(): JSX.Element {
  useTitle('SkyDrinks - Editar bebida');
  useFavicon('blue');

  const [form] = useForm();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const params = useParams();

  const [image, setImage] = useState<File | string>();

  const [useExistsImage, setUseExistsImage] = useState(false);
  const [removeDefaultImage, setRemoveDefaultImage] = useState(false);

  const drinkQuery = useQuery(['drink', params.uuid], () => {
    const uuid = params.uuid || '';

    if (isUUID(uuid)) {
      return endpoints.findDrinkByUUID(uuid);
    }

    throw new Error('Insira um código de bebida válido para ser atualizada.');
  });

  const editDrinkMutation = useMutation(
    (drinkToUpdate: DrinkToUpdate) => endpoints.replaceDrink(drinkToUpdate),
    { onSuccess: () => queryClient.refetchQueries('drinks') }
  );

  const { images, imagesLoading } = useImages();

  function handleFormFinish(values: DrinkEditForm): void {
    async function update(): Promise<void> {
      try {
        await editDrinkMutation.mutateAsync({
          ...values,
          uuid: params.uuid || '',
          picture: removeDefaultImage ? image : drinkQuery.data?.picture,
          additional: values.additional
            ? values.additional.join(';').toLowerCase()
            : '',
        });

        showNotification({
          type: 'success',
          message: 'Bebida atualizada com sucesso!',
        });

        navigate(`/${routes.MANAGE_DRINKS}`);
      } catch {
        showNotification({
          type: 'error',
          message: 'Aconteceu um erro ao tentar atualizar!',
        });
      }
    }

    confirm({
      title: 'Tem certeza que deseja atualizar essa bebida?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: update,
    });
  }

  function dummyRequest({ file, onSuccess }: any): Promise<void> {
    setImage(file);
    setRemoveDefaultImage(true);
    return new Promise(() => onSuccess(file));
  }

  function clearImage(): void {
    setImage(undefined);
  }

  function removePicture(): void {
    clearImage();
    setRemoveDefaultImage(true);
  }

  function handleSelectChange(value: string): void {
    setImage(value);
    setRemoveDefaultImage(true);
  }

  function handleRadioChange(event: RadioChangeEvent): void {
    setUseExistsImage(event.target.value);
  }

  const onBlur = trimInput(form);

  if (drinkQuery.isError) {
    const { error } = drinkQuery;

    const description = getFieldErrorsDescription(error);

    handleError({
      error,
      description,
      fallback: 'Não foi possível encontrar bebida',
    });

    navigate(`/${routes.MANAGE_DRINKS}`);

    return <></>;
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Editar Bebida</h2>

      {drinkQuery.isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <div className={styles.selectImage}>
            <Radio.Group
              value={useExistsImage}
              options={[
                { label: 'Imagem já existente', value: true },
                { label: 'Upar imagem', value: false },
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
              name: drinkQuery.data?.name,
              description: drinkQuery.data?.description,
              price: drinkQuery.data?.price,
              volume: drinkQuery.data?.volume,
              additional: drinkQuery.data?.additionalList,
              alcoholic: drinkQuery.data?.alcoholic,
            }}
            layout="horizontal"
            name="create-drink"
          >
            <Form.Item
              name="picture"
              label="Imagem"
              {...(!useExistsImage ? { valuePropName: 'fileLists' } : {})}
            >
              {useExistsImage ? (
                <Select
                  onChange={handleSelectChange}
                  loading={imagesLoading}
                  disabled={imagesLoading}
                  size="large"
                  allowClear
                >
                  {images.map(({ name, url }) => (
                    <Option key={name} value={url}>
                      <div className={styles.imageItem}>
                        <img alt={name} src={url} />
                        <p title={name}>{name}</p>
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

            {drinkQuery.data?.picture &&
              !image &&
              !useExistsImage &&
              !removeDefaultImage && (
                <Form.Item
                  wrapperCol={{ xs: { offset: 0 }, sm: { offset: 4 } }}
                >
                  <div className={styles.image}>
                    <div className={styles.info}>
                      <figure>
                        <img
                          src={drinkQuery.data?.picture}
                          alt={`Imagem de ${drinkQuery.data?.name}`}
                        />
                      </figure>

                      <p>{drinkQuery.data?.picture.split('/').pop()}</p>
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
                { required: true, message: 'Insira o nome da bebida' },
                {
                  min: 3,
                  max: 100,
                  message: 'O nome precisa ter entre 3 e 100 caracteres',
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
                  type: 'number',
                  required: true,
                  message: 'Insira o preço da bebida',
                },
                {
                  type: 'number',
                  min: 0,
                  message: 'O preço deve ser maior que zero',
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
                { required: true, message: 'Insira o volume da bebida' },
                {
                  type: 'number',
                  min: 0,
                  message: 'O volume deve ser maior que zero',
                },
                {
                  type: 'number',
                  max: 4000,
                  message: 'O volume deve ser menor que quatro mil',
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
                loading={editDrinkMutation.isLoading}
                icon={<PlusOutlined />}
                size="large"
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                Atualizar Bebida
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </section>
  );
}
