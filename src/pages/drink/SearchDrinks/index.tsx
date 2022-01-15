import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { useTitle } from "src/hooks/useTitle";

import styles from "./styles.module.scss";
import { ListDrinks } from "../components/ListDrinks";

export function SearchDrinks() {
  useTitle("SkyDrinks - Pesquisar bebidas");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  function openDrawer() {
    setDrawerVisible(true);
  }

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

      <ListDrinks
        loading={loading}
        drawerVisible={drawerVisible}
        setLoading={setLoading}
        setDrawerVisible={setDrawerVisible}
      />
    </div>
  );
}
