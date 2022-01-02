import { useEffect, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
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
import { showNotification } from "src/utils/showNotification";

type SearchDrinkForm = {
  name: string;
  description: string;
  alcoholic: string;
  price: number[];
  volume: number[];
  additional: string[];
};

type SearchParameters = {
  name?: string;
  description?: string;
  additional?: string;
  alcoholic?: string;
  price?: string | number;
  greaterThanOrEqualToPrice?: string | number;
  lessThanOrEqualToPrice?: string | number;
  volume?: string | number;
  greaterThanOrEqualToVolume?: string | number;
  lessThanOrEqualToVolume?: string | number;
  page: number;
};

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

const { Option } = Select;

export function SearchDrinks() {
  useTitle("SkyDrinks - Pesquisar bebidas");

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    const params = searchParams.toString();

    if (params) {
      searchDrinks(params);
      const objectParams = qs.parse(params);
      setPagination((pagination) => ({
        ...pagination,
        page: Number(objectParams.page),
      }));
    }
  }, [searchParams]);

  function clearForm() {
    form.resetFields();
  }

  function handlePaginationChange(page: number) {
    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });

    const objectParams = qs.parse(searchParams.toString());
    objectParams.page = (page - 1).toString();

    makeSearch(qs.stringify(objectParams));
  }

  function openDrawer() {
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
  }

  async function searchDrinks(params: string) {
    setLoading(true);

    try {
      const drinks = await endpoints.searchDrink(params);
      setData(drinks);
    } catch (e: any) {
      showNotification({
        type: "warn",
        message: "Pesquisar Bebidas",
        description: e.message,
      });
    }

    setLoading(false);
  }

  function makeSearch(params: string) {
    setSearchParams(params);
    closeDrawer();
  }

  function handleFormFinish(values: SearchDrinkForm) {
    const searchObject = {
      name: values.name || undefined,
      description: values.description || undefined,
      additional: values.additional ? values.additional.join(";") : undefined,
      alcoholic: values.alcoholic,
      page: 0,
    } as SearchParameters;

    if (form.isFieldTouched("volume")) {
      const [minVolume, maxVolume] = values.volume;

      if (minVolume === maxVolume) {
        searchObject.volume = minVolume;
      } else {
        searchObject.greaterThanOrEqualToVolume = minVolume;
        searchObject.lessThanOrEqualToVolume = maxVolume;
      }
    }

    if (form.isFieldTouched("price")) {
      const [minPrice, maxPrice] = values.price;

      if (minPrice === maxPrice) {
        searchObject.price = minPrice;
      } else {
        searchObject.greaterThanOrEqualToPrice = minPrice;
        searchObject.lessThanOrEqualToPrice = maxPrice;
      }
    }

    const params = qs.stringify(searchObject);

    makeSearch(params);
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;
  const cardWidth = window.innerWidth <= 400 ? 280 : 200;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pesquisar bebida</h2>

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquise sua bebida
        </Button>
      </div>

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
                defaultPageSize={pagination.size}
                defaultCurrent={pagination.page + 1}
                total={data.totalElements}
                hideOnSinglePage
                onChange={handlePaginationChange}
              />
            </div>
          </>
        ) : (
          <Empty description="Nenhuma bebida foi encontrada!" />
        )}
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
          name="search-drinks"
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
            <Slider range min={100} max={4000} tipFormatter={(value) => `${value}ml`} />
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
