import { useEffect, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation, useSearchParams } from "react-router-dom";
import qs from "query-string";

import {
  Form,
  Input,
  Button,
  Divider,
  Slider,
  Select,
  Drawer,
  Empty,
  Pagination,
} from "antd";

import { DrinkCard } from "../DrinkCard";
import { useTitle } from "src/hooks/useTitle";

import { pluralize } from "src/utils/pluralize";
import endpoints from "src/api/api";

import styles from "./styles.module.scss";
import { trimInput } from "src/utils/trimInput";
import { handleError } from "src/utils/handleError";
import { Loading } from "src/components/layout/Loading";
import { DrinkPaginatedType, DrinkSearchParams } from "src/types/drinks";

interface DrinkSearchForm {
  name: string;
  description: string;
  alcoholic: string;
  price: number[];
  volume: number[];
  additional: string[];
}

const { Option } = Select;

export function SearchDrinks() {
  useTitle("SkyDrinks - Pesquisar bebidas");

  const [, setSearchParams] = useSearchParams();

  const location = useLocation();

  const [params, setParams] = useState<DrinkSearchParams>({});

  const [form] = Form.useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingURL, setCreatingURL] = useState(true);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
  });

  const [data, setData] = useState<DrinkPaginatedType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    const search = qs.parse(location.search);

    function getParameter(param: string, mapper: Function = String) {
      const value = search[param];
      return value ? mapper(value) : undefined;
    }

    if (location.search && creatingURL) {
      setCreatingURL(false);

      setParams({
        name: getParameter("name"),
        description: getParameter("description"),
        additional: getParameter("additional"),
        alcoholic: getParameter("alcoholic"),
        greaterThanOrEqualToPrice: getParameter(
          "greaterThanOrEqualToPrice",
          Number
        ),
        lessThanOrEqualToPrice: getParameter("lessThanOrEqualToPrice", Number),
        greaterThanOrEqualToVolume: getParameter(
          "greaterThanOrEqualToVolume",
          Number
        ),
        lessThanOrEqualToVolume: getParameter(
          "lessThanOrEqualToVolume",
          Number
        ),
      });

      setPagination((pagination) => ({
        ...pagination,
        page: getParameter("page", Number),
      }));
    }

    setLoading(true);
  }, [location, creatingURL]);

  useEffect(() => {
    async function loadDrinks() {
      try {
        const { page, size } = pagination;

        const data = await endpoints.searchDrink({
          ...params,
          page,
          size,
        });

        setSearchParams(
          qs.stringify({
            ...params,
            page,
          })
        );

        setData(data);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível pesquisar as bebidas",
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadDrinks();
    }
  }, [loading, pagination, params, setSearchParams]);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  function clearForm() {
    form.resetFields();
  }

  function handlePaginationChange(page: number) {
    setPagination((pagination) => ({ ...pagination, page: page - 1 }));

    setLoading(true);
  }

  function openDrawer() {
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
  }

  function getPriceAndVolume(price: number[], volume: number[]) {
    return {
      ...(form.isFieldTouched("volume")
        ? {
            greaterThanOrEqualToVolume: volume[0],
            lessThanOrEqualToVolume: volume[1],
          }
        : {}),

      ...(form.isFieldTouched("price")
        ? {
            greaterThanOrEqualToPrice: price[0],
            lessThanOrEqualToPrice: price[1],
          }
        : {}),
    };
  }

  function handleFormFinish(values: DrinkSearchForm) {
    const { name, description, additional, alcoholic, price, volume } = values;

    const params: DrinkSearchParams = {
      name,
      description,
      alcoholic,
      additional: additional?.join(";"),
      ...getPriceAndVolume(price, volume),
    };

    closeDrawer();

    setPagination({ ...pagination, page: 0 });
    setParams(params);
    setLoading(true);
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;
  const cardWidth = window.innerWidth <= 400 ? 280 : 200;

  const onBlur = trimInput(form);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pesquisar bebida</h2>

      <div className={styles.fullButton}>
        <Button
          type="primary"
          loading={loading}
          icon={<SearchOutlined />}
          onClick={openDrawer}
        >
          Pesquise sua bebida
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className={styles.drinksWrapper}>
          {data.content.length !== 0 ? (
            <>
              <h2 className={styles.drinksFounded}>
                {data.totalElements}{" "}
                {pluralize(
                  data.totalElements,
                  "Bebida encontrada",
                  "Bebidas encontradas"
                )}
                :
              </h2>
              <ul className={styles.drinksList}>
                {data.content.map((drink) => (
                  <DrinkCard
                    key={drink.uuid}
                    {...drink}
                    width={cardWidth}
                    imageHeight={cardWidth}
                    loading={loading}
                  />
                ))}
              </ul>

              <div className={styles.paginationContainer}>
                <Pagination
                  pageSize={pagination.size}
                  current={pagination.page + 1}
                  total={data.totalElements}
                  hideOnSinglePage
                  onChange={handlePaginationChange}
                  responsive
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="Nenhuma bebida foi encontrada!" />
          )}
        </div>
      )}

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
          name="search-drinks"
          autoComplete="off"
        >
          <Divider orientation="left">Geral</Divider>

          <Form.Item label="Nome" name="name">
            <Input onBlur={onBlur} placeholder="ex: Blood Mary" />
          </Form.Item>

          <Form.Item label="Descrição" name="description">
            <Input.TextArea
              onBlur={onBlur}
              placeholder="ex: Drink Refrescante"
            />
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
                1: "R$ 1",
                250: "R$ 250",
                500: "R$ 500",
                1000: "R$ 1000",
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
                100: "100 ml",
                2000: "2000 ml",
                4000: "4000 ml",
              }}
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
