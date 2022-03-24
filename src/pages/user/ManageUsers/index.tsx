import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import routes from 'src/routes';
import { useTitle } from 'src/hooks/useTitle';
import { formatToDatabaseDate } from 'src/utils/formatDatabaseDate';
import { sortObjectToString } from 'src/utils/sortObjectToString';

import { UsersDrawer } from './UsersDrawer';
import { ListUsers } from './ListUsers';
import { BlockAll } from './BlockAll';
import { TotalUsers } from './TotalUsers';

import styles from './styles.module.scss';

export function ManageUsers(): JSX.Element {
  useTitle('SkyDrinks - Gerenciar usuários');

  const [form] = useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const [params, setParams] = useState<UserSearchParams>({});

  function openDrawer(): void {
    setDrawerVisible(true);
  }

  function closeDrawer(): void {
    setDrawerVisible(false);
  }

  function handleFormFinish(values: UserSearchForm): void {
    const birthDay = values.birthDay
      ? formatToDatabaseDate(values.birthDay)
      : undefined;

    setParams({
      ...values,
      sort: sortObjectToString(values.sort),
      role: values?.role?.join(',').toUpperCase(),
      birthDay,
    });

    closeDrawer();
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Gerenciar Usuários</h2>

      <TotalUsers />

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar usuários
        </Button>
      </div>

      <ListUsers params={params} />

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
    </section>
  );
}
