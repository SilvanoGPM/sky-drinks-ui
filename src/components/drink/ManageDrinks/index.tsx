import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Button,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Slider,
  Spin,
  Tooltip,
} from "antd";
import qs from "query-string";

import { useTitle } from "src/hooks/useTitle";
import { DrinkCard } from "../DrinkCard";

import endpoints from "src/api/api";
import routes from "src/routes";

import styles from "./styles.module.scss";
import { showNotification } from "src/utils/showNotification";

type FoundedDrinkType = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
};

type PaginetedDataType = {
  totalElements: number;
  content: FoundedDrinkType[];
};

type SearchDrinkType = {
  name: string;
  description: string;
  alcoholic: string;
  price: number[];
  volume: number[];
  additional: string[];
};

type SearchParameters = {
  name: string;
  description: string;
  additional: string;
  alcoholic: string;
  greaterThanOrEqualToPrice?: number;
  lessThanOrEqualToPrice?: number;
  greaterThanOrEqualToVolume?: number;
  lessThanOrEqualToVolume?: number;
};

const { Option } = Select;

export function ManageDrinks() {
  useTitle("SkyDrinks - Gerenciar bebidas");

  const [form] = Form.useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState<SearchParameters>(
    {} as SearchParameters
  );

  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadDrinks() {
      try {
        const data = await endpoints.searchDrink(
          `${qs.stringify(params)}&page=${pagination.page}`
        );
        setData(data);
      } catch (e: any) {
        showNotification({
          type: "warn",
          message: e.message,
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadDrinks();
    }
  }, [loading, pagination, params]);

  function getPriceAndVolume(price: number[], volume: number[]) {
    return {
      ...(form.isFieldTouched("volume") ? {
        greaterThanOrEqualToVolume: volume[0],
        lessThanOrEqualToVolume: volume[1],
      } : {}),

      ...(form.isFieldTouched("price") ? {
        greaterThanOrEqualToPrice: price[0],
        lessThanOrEqualToPrice: price[1],
      } : {})
    };
  }

  function handleFormFinish(values: SearchDrinkType) {
    const { name, description, additional, alcoholic, price, volume } = values;

    const params = {
      name,
      description,
      alcoholic,
      additional: additional?.join(";"),
      ...getPriceAndVolume(price, volume),
    } as SearchParameters;

    setParams(params);
    setLoading(true);
  }

  function openDrawer() {
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
  }

  function handlePaginationChange(page: number) {
    setPagination((pagination) => ({ ...pagination, page: page - 1 }));

    setLoading(true);
  }

  function clearForm() {
    form.resetFields();
  }

  function removeDrink(uuid: string) {
    return async () => {
      try {
        await endpoints.deleteDrink(uuid);

        setData({
          ...data,
          content: data.content.filter((item) => item.uuid !== uuid),
        });

        const isLastElementOfPage =
          data.content.length === 1 && pagination.page > 0;

        if (isLastElementOfPage) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });

          setLoading(true);
        }

        showNotification({
          type: "success",
          message: "Bebida foi removida com sucesso",
        });
      } catch (e: any) {
        showNotification({
          type: "error",
          message: "Aconteceu um erro ao tentar deletar a bebida",
        });
      }
    };
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;
  const cardWidth = window.innerWidth <= 400 ? 280 : 200;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Gerenciar Bebidas</h2>
      </div>

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar bebida
        </Button>
      </div>

      <div className={styles.drinksWrapper}>
        {loading ? (
          <Spin />
        ) : (
          <>
            {data.content.length !== 0 ? (
              <>
                <ul className={styles.drinksList}>
                  {data.content.map((drink) => (
                    <DrinkCard
                      {...drink}
                      showBuyAction={false}
                      key={drink.uuid}
                      width={cardWidth}
                      imageHeight={cardWidth}
                      loading={loading}
                      moreActions={[
                        <Tooltip title="Editar Bebida" key="edit-drink">
                          <Link
                            to={`${routes.EDIT_DRINK}`.replace(
                              ":uuid",
                              drink.uuid
                            )}
                          >
                            <Button type="link">
                              <EditOutlined />
                            </Button>
                          </Link>
                        </Tooltip>,

                        <Tooltip
                          title="Remover Bebida"
                          placement="bottom"
                          key="remove-drink"
                        >
                          <Popconfirm
                            title="Remover Bebida"
                            placement="top"
                            onConfirm={removeDrink(drink.uuid)}
                            okText="Remover"
                            cancelText="Cancelar"
                          >
                            <Button type="link">
                              <DeleteOutlined />
                            </Button>
                          </Popconfirm>
                        </Tooltip>,
                      ]}
                    />
                  ))}
                </ul>

                <div className={styles.paginationContainer}>
                  <Pagination
                    defaultPageSize={pagination.size}
                    defaultCurrent={pagination.page + 1}
                    current={pagination.page + 1}
                    total={data.totalElements}
                    hideOnSinglePage
                    onChange={handlePaginationChange}
                  />
                </div>
              </>
            ) : (
              <Empty description="Nenhum drink foi encontrado!" />
            )}
          </>
        )}
      </div>

      <div className={styles.bottomButton}>
        <Tooltip title="Criar nova bebida" placement="left">
          <Link to={routes.CREATE_DRINK}>
            <Button
              style={{ minWidth: 50, minHeight: 50 }}
              shape="circle"
              type="primary"
              icon={<PlusOutlined style={{ fontSize: 25 }} />}
            />
          </Link>
        </Tooltip>
      </div>

      <Drawer
        width={drawerWidth}
        title="Pesquisar bebida"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Form
          form={form}
          onFinish={handleFormFinish}
          layout="vertical"
          style={{ flex: 1 }}
          initialValues={{
            alcoholic: "-1",
            volume: [110, 2000],
            price: [10, 90],
          }}
          name="manage-drinks"
          autoComplete="off"
        >
          <Divider orientation="left">Geral</Divider>

          <Form.Item label="Nome" name="name">
            <Input placeholder="ex: Blood Mary" />
          </Form.Item>

          <Form.Item label="Descrição" name="description">
            <Input.TextArea placeholder="ex: Drink Refrescante" />
          </Form.Item>

          <Form.Item label="Tipo da bebida" name="alcoholic">
            <Select>
              <Option value="-1">Ambos</Option>
              <Option value="0">Não alcóolico</Option>
              <Option value="1">Alcóolico</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Preço" name="price">
            <Slider range tipFormatter={(value) => `R$ ${value}`} max={1000} />
          </Form.Item>

          <Form.Item label="Volume" name="volume">
            <Slider
              range
              min={100}
              max={4000}
              tipFormatter={(value) => `${value}ml`}
            />
          </Form.Item>

          <Form.Item label="Adicionais" name="additional">
            <Select mode="tags" placeholder="ex: gelo"></Select>
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
    </div>
  );
}
