import { useState } from "react";
import { Link } from "react-router-dom";

import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

import routes from "src/routes";
import { useTitle } from "src/hooks/useTitle";
import { useForm } from "antd/lib/form/Form";
import { UsersDrawer } from "./UsersDrawer";
import { ListUsers } from "./ListUsers";
import { formatToDatabaseDate } from "src/utils/formatDatabaseDate";
import { UserSearchParams, UserSearchForm } from "src/types/user";

import styles from "./styles.module.scss";
import { BlockAll } from "./BlockAll";

export function ManageUsers() {
  useTitle("SkyDrinks - Gerenciar usuários");

  const [form] = useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState<UserSearchParams>({});

  function openDrawer() {
    setDrawerVisible(true);
  }

  function closeDrawer() {
    setDrawerVisible(false);
  }

  function handleFormFinish(values: UserSearchForm) {
    const birthDay = values.birthDay
      ? formatToDatabaseDate(values.birthDay)
      : undefined;

    setParams({
      ...values,
      role: values?.role?.join(",").toUpperCase(),
      birthDay,
    });

    closeDrawer();
    setLoading(true);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gerenciar Usuários</h2>

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar usuários
        </Button>
      </div>

      <ListUsers params={params} loading={loading} setLoading={setLoading} />

      <div className={styles.bottomButton}>
        <Tooltip title="Criar novo usuário" placement="left">
          <Link to={routes.CREATE_USER}>
            <Button
              style={{ minWidth: 50, minHeight: 50 }}
              shape="circle"
              type="primary"
              icon={<UserAddOutlined style={{ fontSize: 18 }} />}
            />
          </Link>
        </Tooltip>
      </div>

      <UsersDrawer
        form={form}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        onFinish={handleFormFinish}
      />

      <BlockAll />
    </div>
  );
}
