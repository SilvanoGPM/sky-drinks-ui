import { Spin } from "antd";

import { useTitle } from "src/hooks/useTitle";

import styles from "./styles.module.scss";

export function LoadingPage() {
  useTitle("SkyDrinks - Carregando. . .");

  return (
    <div className={styles.loading}>
      <Spin size="large" />
    </div>
  );
}
