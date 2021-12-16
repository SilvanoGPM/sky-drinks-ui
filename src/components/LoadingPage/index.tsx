import { Spin } from "antd";

import styles from "./styles.module.scss";

export function LoadingPage() {
  return (
    <div className={styles.loading}>
      <Spin size="large" />
    </div>
  );
}
