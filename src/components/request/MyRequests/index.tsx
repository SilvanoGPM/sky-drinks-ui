import {
  DeleteOutlined,
  PaperClipOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Form,
  Badge,
  Button,
  Drawer,
  Input,
  List,
  Tooltip,
  Divider,
  DatePicker,
  Select,
  Slider,
  Popover,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import endpoints, { toFullPictureURI } from "src/api/api";
import { AuthContext } from "src/contexts/AuthContext";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { showNotification } from "src/utils/showNotification";
import qs from "query-string";
import styles from "./styles.module.scss";
import moment from "moment";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { DrinkIcon } from "src/components/custom/CustomIcons";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";

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

type UserType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type RequestType = {
  drinks: DrinkType[];
  createdAt: string;
  updatedAt: string;
  finished: boolean;
  uuid: string;
  user: UserType;
  totalPrice: number;
};

type RequestSearchType = {
  status: number;
  createdAt: any;
  drinkName: string;
  drinkDescription: string;
  price: number[];
};

type RequestParams = {
  finished: number;
  drinkName: string;
  drinkDescription: string;
  createdAt?: string;
  createdInDateOrAfter?: string;
  createdInDateOrBefore?: string;
  price?: number;
  lessThanOrEqualToTotalPrice?: number;
  greaterThanOrEqualToTotalPrice?: number;
};

type PaginetedDataType = {
  totalElements: number;
  content: RequestType[];
};

const { Option } = Select;
const { RangePicker } = DatePicker;

export function MyRequests() {
  useTitle("SkyDrinks - Meus pedidos");

  const { userInfo } = useContext(AuthContext);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<RequestParams>({} as RequestParams);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  const [form] = useForm();

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await endpoints.getMyRequests(
          `userUUID=${userInfo.uuid}&${qs.stringify(params)}`
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
      loadRequests();
    }
  }, [loading, params, userInfo]);

  function handleCopyDrinkUUID(uuid: string) {
    return () => {
      navigator.clipboard.writeText(uuid);

      showNotification({
        type: "success",
        message: "Código copiado com sucesso!",
        duration: 2,
      });
    };
  }

  function clearForm() {
    form.resetFields();
  }

  function openDrawer() {
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
  }

  function handlePaginationChange(page: number) {
    setLoading(true);

    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });
  }

  function handleFinishForm(values: RequestSearchType) {
    const { drinkDescription, drinkName, status: finished } = values;

    const [greaterThanOrEqualToTotalPrice, lessThanOrEqualToTotalPrice] =
      values.price;

    const [createdInDateOrAfter, createdInDateOrBefore] = values.createdAt || [
      0, 1,
    ];

    setParams({
      drinkDescription,
      drinkName,
      finished,
      lessThanOrEqualToTotalPrice,
      greaterThanOrEqualToTotalPrice,
      createdInDateOrAfter: values.createdAt
        ? moment(createdInDateOrAfter).format("yyyy-MM-DD")
        : undefined,
      createdInDateOrBefore: values.createdAt
        ? moment(createdInDateOrBefore).format("yyyy-MM-DD")
        : undefined,
    });

    setLoading(true);
    setDrawerVisible(false);
  }

  function getDrinksContent(request: RequestType) {
    const drinks = getDrinksGroupedByUUID(request);

    const elements = Object.keys(drinks).map((key, index) => {
      const [drink] = drinks[key];
      const { length } = drinks[key];

      return (
        <li className={styles.drinksItem} key={`${key} - ${index}`}>
          <p title={drink.name}>{drink.name}</p>
          <Badge count={length} />
        </li>
      );
    });

    return (
      <div>
        <ul className={styles.drinksList}>{elements}</ul>
      </div>
    );
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;
  const imageWidth = window.innerWidth > 700 ? 200 : 100;
  const popoverTrigger = window.innerWidth > 700 ? "hover" : "click";

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Meus Pedidos</h2>
      </div>

      <div className={styles.search}>
        <Button
          style={{ width: "100%" }}
          loading={loading}
          type="primary"
          icon={<SearchOutlined />}
          onClick={openDrawer}
        >
          Pesquisar pedidos
        </Button>
      </div>

      <List
        itemLayout="vertical"
        dataSource={data.content}
        pagination={{
          current: pagination.page + 1,
          defaultCurrent: pagination.page + 1,
          defaultPageSize: pagination.size,
          onChange: handlePaginationChange,
          total: data.totalElements,
          hideOnSinglePage: true,
        }}
        renderItem={(request) => {
          const { uuid, createdAt, finished, drinks, totalPrice } = request;
          const { picture } = toFullPictureURI(drinks[0]);

          return (
            <List.Item
              key={uuid}
              actions={[
                <Tooltip key="copy" title="Copiar código">
                  <Button onClick={handleCopyDrinkUUID(uuid)}>
                    <PaperClipOutlined />
                  </Button>
                </Tooltip>,
                <Popover
                  placement="bottom"
                  trigger={popoverTrigger}
                  overlayClassName={styles.drinksOverlay}
                  key="drinks"
                  title="Bebidas"
                  content={getDrinksContent(request)}
                >
                  <Button>
                    <DrinkIcon />
                  </Button>
                </Popover>,
              ]}
              extra={
                <img
                  width={imageWidth}
                  height={imageWidth}
                  src={picture}
                  alt="Bebida contida no pedido"
                />
              }
            >
              <List.Item.Meta
                title={
                  <Link to={`/${routes.VIEW_REQUEST.replace(":uuid", uuid)}`}>
                    <h3 className={styles.itemTitle}>Ver pedido</h3>
                  </Link>
                }
              />
              <div className={styles.listItemContent}>
                <div className={styles.status}>
                  <p>Status: </p>
                  {finished ? (
                    <Badge status="success" text="Finalizado" />
                  ) : (
                    <Badge status="processing" text="Em preparo" />
                  )}
                </div>
                <p className={styles.info}>Código do pedido: {uuid}</p>
                <p className={styles.info}>
                  Preço estimado: {formatDisplayPrice(totalPrice)}
                </p>
                <p className={styles.info}>
                  Criado em {formatDisplayDate(createdAt)}
                </p>
              </div>
            </List.Item>
          );
        }}
      />

      <Drawer
        width={drawerWidth}
        title="Pesquisar pedido"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ flex: 1 }}
          initialValues={{
            status: "-1",
            price: [0, 200],
          }}
          name="search-requests"
          autoComplete="off"
          onFinish={handleFinishForm}
        >
          <Divider orientation="left">Pedido</Divider>

          <Form.Item label="Pedido realizado em" name="createdAt">
            <RangePicker />
          </Form.Item>

          <Form.Item label="Status do pedido" name="status">
            <Select>
              <Option value="-1">Ambos</Option>
              <Option value="0">Em preparo</Option>
              <Option value="1">Finalizado</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Preço" name="price">
            <Slider range max={1000} tipFormatter={(value) => `R$ ${value}`} />
          </Form.Item>

          <Divider orientation="left">Bebida</Divider>

          <Form.Item label="Nome da bebida" name="drinkName">
            <Input placeholder="ex: Blood Mary" />
          </Form.Item>

          <Form.Item label="Descrição da bebida" name="drinkDescription">
            <Input.TextArea placeholder="ex: Drink Refrescante" />
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
