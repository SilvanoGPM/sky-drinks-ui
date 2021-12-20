import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Pagination, Popconfirm, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useTitle } from "src/hooks/useTitle";

import endpoints from "src/api/api";
import routes from "src/routes";
import { formatDatabaseDate } from "src/utils/formatDatabaseDate";

import styles from "./styles.module.scss";

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

export function ManageUsers() {
  useTitle("SkyDrinks - Gerenciar usuários");

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  function handlePaginationChange(page: number) {
    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });
  }

  useEffect(() => {
    async function loadUsers() {
      const data = await endpoints.searchUser(`page=${pagination.page}`);
      setData(data);

      setLoading(false);
    }

    if (loading) {
      loadUsers();
    }
  }, [loading, pagination]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Usuários</h2>

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
                description={<p className={styles.email}>Email: ${email}</p>}
              />
              <div>
                <p>
                  UUID: <span className={styles.bold}>{uuid}</span>
                </p>
                <p>
                  CPF: <span className={styles.bold}>{cpf}</span>
                </p>
                <p>
                  Data de nascimento:{" "}
                  <span className={styles.bold}>
                    {formatDatabaseDate(birthDay)}
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
              icon={<PlusOutlined style={{ fontSize: 25 }} />}
            />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}
