import { useState } from "react";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useTitle } from "src/hooks/useTitle";
import { SearchRequestsDrawer } from "./SearchRequestsDrawer";
import { ListSearchRequests } from "./ListSearchRequests";

import {
  RequestSearchFormForAdmins,
  RequestSearchParams,
} from "src/types/requests";

import styles from "./styles.module.scss";

export function SearchRequests() {
  useTitle("SkyDrinks - Pesquisar pedidos");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<RequestSearchParams>({});

  const [form] = useForm();

  function openDrawer() {
    setDrawerVisible(true);
  }

  function handleFinishForm(values: RequestSearchFormForAdmins) {
    const {
      drinkDescription,
      userCpf,
      userEmail,
      userName,
      drinkName,
      status,
      delivered,
    } = values;

    const [greaterThanOrEqualToTotalPrice, lessThanOrEqualToTotalPrice] =
      values.price;

    const [createdInDateOrAfter, createdInDateOrBefore] = values.createdAt || [
      0, 1,
    ];

    setParams({
      drinkDescription,
      drinkName,
      status,
      userCpf,
      userEmail,
      userName,
      delivered,
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

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Pesquisar Pedidos</h2>
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

      <ListSearchRequests
        params={params}
        loading={loading}
        setLoading={setLoading}
      />

      <SearchRequestsDrawer
        form={form}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        onFinish={handleFinishForm}
      />
    </div>
  );
}
