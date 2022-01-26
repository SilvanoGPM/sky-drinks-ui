import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useTitle } from 'src/hooks/useTitle';
import { MyRequestsDrawer } from './MyRequestsDrawer';
import { ListMyRequests } from './ListMyRequests';

import styles from './styles.module.scss';

export function MyRequests(): JSX.Element {
  useTitle('SkyDrinks - Meus pedidos');

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<RequestSearchParams>({});

  const [form] = useForm();

  function openDrawer(): void {
    setDrawerVisible(true);
  }

  function handleFinishForm(values: RequestSearchForm): void {
    const { drinkDescription, drinkName, status } = values;

    const [greaterThanOrEqualToTotalPrice, lessThanOrEqualToTotalPrice] =
      values.price;

    const [createdInDateOrAfter, createdInDateOrBefore] = values.createdAt || [
      0, 1,
    ];

    setParams({
      drinkDescription,
      drinkName,
      status,
      lessThanOrEqualToTotalPrice,
      greaterThanOrEqualToTotalPrice,
      createdInDateOrAfter: values.createdAt
        ? moment(createdInDateOrAfter).format('yyyy-MM-DD')
        : undefined,
      createdInDateOrBefore: values.createdAt
        ? moment(createdInDateOrBefore).format('yyyy-MM-DD')
        : undefined,
    });

    setLoading(true);
    setDrawerVisible(false);
  }

  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Meus Pedidos</h2>
      </div>

      <div className={styles.search}>
        <Button
          style={{ width: '100%' }}
          loading={loading}
          type="primary"
          icon={<SearchOutlined />}
          onClick={openDrawer}
        >
          Pesquisar pedidos
        </Button>
      </div>

      <ListMyRequests
        params={params}
        loading={loading}
        setLoading={setLoading}
      />

      <MyRequestsDrawer
        form={form}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        onFinish={handleFinishForm}
      />
    </section>
  );
}
