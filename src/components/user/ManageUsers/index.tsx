import { DeleteOutlined, EditOutlined, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Divider, Drawer, Form, Input, List, Pagination, Popconfirm, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import qs from "query-string";

import { useTitle } from "src/hooks/useTitle";

import endpoints from "src/api/api";
import routes from "src/routes";
import { formatBirthDayDate, formatDatabaseDate } from "src/utils/formatDatabaseDate";

import styles from "./styles.module.scss";
import { formatDisplayRole } from "src/utils/formatDisplayRole";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { showNotification } from "src/utils/showNotification";

type FoundedUserType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type PaginetedDataType = {
  totalElements: number;
  content: FoundedUserType[];
};

type SearchUserType = {
  name: string;
  role: string[];
  birthDay: any;
};

const { Option } = Select;

export function ManageUsers() {
  useTitle("SkyDrinks - Gerenciar usuários");

  const [form] = useForm();

  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [params, setParams] = useState({});

  const [pagination, setPagination] = useState({
    page: 0,
    size: 2,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await endpoints.searchUser(`page=${pagination.page}&${qs.stringify(params)}`, pagination.size);
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
      loadUsers();
    }
  }, [loading, pagination, params]);

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

  function handleFormFinish(values: SearchUserType) {
    setParams({
      ...values,
      role: values?.role?.join(","),
      birthDay: values.birthDay ? moment(values.birthDay._d).format("yyyy-MM-DD") : undefined,
    });

    setLoading(true);
  }

  function removeUser(uuid: string) {
    return async () => {
      try {
        await endpoints.deleteUser(uuid);

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
          message: "Usuário foi removido com sucesso!",
        });
      } catch (e: any) {
        showNotification({
          type: "error",
          message: "Aconteceu um erro ao tentar remover usuário",
        });
      }
    };
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Usuários</h2>

      <div className={styles.buttonContainer}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar Usuário
        </Button>
      </div>

      <div className={styles.list}>
        <List
          itemLayout="vertical"
          dataSource={data.content}
          footer={
            <div className={styles.pagination}>
              <Pagination
                defaultPageSize={pagination.size}
                defaultCurrent={pagination.page + 1}
                current={pagination.page + 1}
                total={data.totalElements}
                onChange={handlePaginationChange}
              />
            </div>
          }
          renderItem={({
            name,
            email,
            cpf,
            birthDay,
            role,
            createdAt,
            updatedAt,
            uuid,
          }) => (
            <List.Item
              className={styles.item}
              actions={[
                <Tooltip title="Deletar Usuário" placement="bottom">
                  <Popconfirm
                    title="Deletar Usuário?"
                    placement="top"
                    okText="Remover"
                    onConfirm={removeUser(uuid)}
                    cancelText="Cancelar"
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </Tooltip>,
                <Tooltip title="Editar Usuário" placement="bottom">
                  <Link to={routes.EDIT_USER.replace(":uuid", uuid)}>
                    <EditOutlined style={{ color: "#8c8c8c" }} />
                  </Link>
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<p className={styles.name}>{name}</p>}
                description={<p className={styles.email}>Email: {email}</p>}
              />
              <div>
                <p>
                  UUID: <span className={styles.bold}>{uuid}</span>
                </p>
                <p>
                  CPF: <span className={styles.bold}>{cpf}</span>
                </p>
                <p>
                  Tipo:{" "}
                  <span className={styles.bold}>
                    {formatDisplayRole(role)}
                  </span>
                </p>
                <p>
                  Data de nascimento:{" "}
                  <span className={styles.bold}>
                    {formatBirthDayDate(birthDay)}
                  </span>
                </p>
                <p>
                  Conta criada em:{" "}
                  <span className={styles.bold}>
                    {formatDatabaseDate(createdAt)}
                  </span>
                </p>
                <p>
                  Conta atualizada em:{" "}
                  <span className={styles.bold}>
                    {formatDatabaseDate(updatedAt)}
                  </span>
                </p>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div className={styles.createUser}>
        <Tooltip title="Criar novo usuário" placement="left">
          <Link to={routes.CREATE_USER}>
            <Button
              style={{ minWidth: 50, minHeight: 50 }}
              shape="circle"
              type="primary"
              icon={<UserAddOutlined style={{ fontSize: 25 }} />}
            />
          </Link>
        </Tooltip>
      </div>

      <Drawer
        width={drawerWidth}
        title="Pesquisar Usuário"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Form
          form={form}
          onFinish={handleFormFinish}
          layout="vertical"
          style={{ flex: 1 }}
          name="search-users"
          autoComplete="off"
        >
          <Divider orientation="left">Geral</Divider>

          <Form.Item label="Nome" name="name">
            <Input placeholder="ex: Roger" />
          </Form.Item>

          <Form.Item label="Cargo" name="role">
            <Select mode="multiple">
              <Option value="USER">User</Option>
              <Option value="BARMEN">Barmen</Option>
              <Option value="WAITER">Waiter</Option>
              <Option value="ADMIN">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Data de nascimento" name="birthDay">
            <DatePicker />
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
