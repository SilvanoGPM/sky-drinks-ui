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
  Form,
  Modal,
  Pagination,
  Select,
  Slider,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import endpoints from "src/api/api";
import { TableIcon } from "src/components/custom/CustomIcons";
import { useTitle } from "src/hooks/useTitle";
import { pluralize } from "src/utils/pluralize";
import { showNotification } from "src/utils/showNotification";
import qs from "query-string";
import styles from "./styles.module.scss";
import { PersistTable } from "../PersistTable";

type TableType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  seats: number;
  occupied: boolean;
};

type PaginetedDataType = {
  totalElements: number;
  content: TableType[];
};

type TableSearchType = {
  seats: number[];
  occupied: number;
};

type TableParams = {
  greaterThanOrEqualToSeats: number;
  lessThanOrEqualToSeats: number;
  occupied: number;
};

type TableToPersist = {
  seats: number;
  number: number;
};

type TableSelected = {
  uuid: string;
  seats: number;
  number: number;
};

const { confirm } = Modal;
const { Option } = Select;

export function ManageTables() {
  useTitle("SkyDrinks - Gerenciar mesas");

  const [form] = Form.useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [persistTableLoading, setPersistTableLoading] = useState(false);
  const [removeTableLoading, setRemoveTableLoading] = useState(false);

  const [persistTableShow, setPersistTableShow] = useState(false);

  const [params, setParams] = useState<TableParams>({} as TableParams);

  const [selectedTable, setSelectedTable] = useState<TableSelected>();

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadTables() {
      try {
        const data = await endpoints.searchTables(
          `${qs.stringify(params)}&page=${pagination.page}`,
          pagination.size
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
      loadTables();
    }
  }, [loading, pagination, params]);

  function handleRemoveTable(uuid: string) {
    async function remove() {
      try {
        setRemoveTableLoading(true);

        await endpoints.deleteTable(uuid);

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
          message: "Mesa removida com sucesso",
        });
      } catch (e: any) {
        showNotification({
          type: "warn",
          message: e.message,
        });
      } finally {
        setRemoveTableLoading(false);
      }
    }

    return () => {
      confirm({
        title: "Realmente deseja remover esta mesa?",
        okText: "Sim",
        cancelText: "Não",
        onOk: remove,
      });
    };
  }

  function openDrawer() {
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
  }

  function handleTableOccupied(uuid: string, occuppied: boolean) {
    async function toggleTableOccupied() {
      try {
        await endpoints.toggleTableOccupied(uuid);

        const content = data.content.map((item) => {
          if (item.uuid === uuid) {
            return { ...item, occupied: !item.occupied };
          }

          return item;
        });

        setData({ ...data, content });

        const message = occuppied
          ? "Mesa desocupada com sucesso!"
          : "Mesa ocupada com sucesso!";

        showNotification({
          type: "success",
          message,
          duration: 2,
        });
      } catch (e: any) {
        showNotification({
          type: "warn",
          message: e.message,
        });
      }
    }

    return () => {
      const title = occuppied
        ? "Deseja desocupar a mesa?"
        : "Deseja ocupar a mesa?";

      confirm({
        title,
        okText: "Sim",
        cancelText: "Não",
        onOk: toggleTableOccupied,
      });
    };
  }

  function handlePaginationChange(page: number) {
    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });

    setLoading(true);
  }

  function handleFormFinish(values: TableSearchType) {
    const { occupied, seats } = values;

    const [greaterThanOrEqualToSeats, lessThanOrEqualToSeats] = seats;

    setParams({
      greaterThanOrEqualToSeats,
      lessThanOrEqualToSeats,
      occupied,
    });

    setPagination({ ...pagination, page: 0 });

    setLoading(true);
  }

  function clearForm() {
    form.resetFields();
  }

  function showPersistTable() {
    setPersistTableShow(true);
  }

  function closePersistTable() {
    setPersistTableShow(false);
    setSelectedTable(undefined);
  }

  function selectTable(uuid: string) {
    return () => {
      const selectedTable = data.content.find((item) => item.uuid === uuid);

      if (selectedTable) {
        setSelectedTable(selectedTable);
        showPersistTable();
      }
    };
  }

  async function handleCreateTable(values: TableToPersist) {
    try {
      setPersistTableLoading(true);

      const table = await endpoints.createTable(values);

      setData({
        ...data,
        content: [...data.content, table],
      });

      showNotification({
        type: "success",
        message: "Mesa foi criada com sucesso!",
      });

      closePersistTable();
    } catch (e: any) {
      showNotification({
        type: "warn",
        message: e.message,
      });
    } finally {
      setPersistTableLoading(false);
    }
  }

  async function updateSelectedTable(values: TableToPersist) {
    try {
      setPersistTableLoading(true);

      await endpoints.updateTable({
        ...values,
        uuid: selectedTable?.uuid || "",
      });

      const content = data.content.map((item) => {
        if (item.uuid === selectedTable?.uuid) {
          const { seats, number } = values;
          return { ...item, seats, number };
        }

        return item;
      });

      setData({
        ...data,
        content,
      });

      showNotification({
        type: "success",
        message: "Mesa foi atualizada com sucesso!",
      });

      closePersistTable();
    } catch (e: any) {
      showNotification({
        type: "warn",
        message: e.message,
      });
    } finally {
      setPersistTableLoading(false);
    }
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Gerenciar Mesas</h2>
      </div>

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar mesas
        </Button>
      </div>

      <ul className={styles.list}>
        {data.content.map(({ uuid, number, occupied, seats }) => (
          <li key={uuid}>
            <div className={styles.table}>
              <Tooltip
                placement="left"
                title={
                  occupied
                    ? "Clique para desocupar a mesa"
                    : "Clique para ocupar mesa"
                }
              >
                <div
                  onClick={handleTableOccupied(uuid, occupied)}
                  className={styles.tableInfo}
                >
                  <p>
                    A mesa contém{" "}
                    <span className={styles.bold}>
                      {`${seats} ${pluralize(seats, "assento", "assentos")}`}
                    </span>
                  </p>
                  <p>
                    A mesa{" "}
                    <span className={styles.bold}>
                      {occupied ? "está" : "não está"}
                    </span>{" "}
                    ocupada
                  </p>
                </div>
              </Tooltip>

              <div className={styles.tableItems}>
                <p
                  className={styles.tableNumber}
                  style={{
                    fontSize: "1.5rem",
                    color: occupied ? "#e74c3c" : "#2ecc71",
                  }}
                >
                  {number}
                </p>

                <TableIcon
                  style={{
                    fontSize: 80,
                    color: occupied ? "#e74c3c" : "#2ecc71",
                  }}
                />

                <div className={styles.tableActions}>
                  <Tooltip title="Editar mesa">
                    <Button
                      onClick={selectTable(uuid)}
                      shape="round"
                      icon={<EditOutlined />}
                    />
                  </Tooltip>

                  <Tooltip title="Remover mesa">
                    <Button
                      shape="round"
                      onClick={handleRemoveTable(uuid)}
                      loading={removeTableLoading}
                      icon={<DeleteOutlined />}
                      style={{ color: "#e74c3c" }}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </li>
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

      <div className={styles.bottomButton}>
        <Tooltip title="Adicionar mesa" placement="left">
          <Button
            style={{ minWidth: 50, minHeight: 50 }}
            shape="circle"
            type="primary"
            onClick={showPersistTable}
            icon={<PlusOutlined style={{ fontSize: 25 }} />}
          />
        </Tooltip>
      </div>

      <PersistTable
        title={selectedTable ? "Atualizar mesa" : "Criar mesa"}
        seats={selectedTable?.seats}
        number={selectedTable?.number}
        loading={persistTableLoading}
        visible={persistTableShow}
        onFinish={selectedTable ? updateSelectedTable : handleCreateTable}
        onCancel={closePersistTable}
      />

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
            occupied: "-1",
            seats: [1, 10],
          }}
          name="search-tables"
          autoComplete="off"
        >
          <Divider orientation="left">Geral</Divider>

          <Form.Item label="Ocupação da mesa" name="occupied">
            <Select>
              <Option value="0">Não ocupada</Option>
              <Option value="1">Ocupada</Option>
              <Option value="-1">Ambos</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Assentos" name="seats">
            <Slider
              range
              min={1}
              max={50}
              tipFormatter={(value) =>
                `${value} ${pluralize(value || 1, "assento", "assentos")}`
              }
            />
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
