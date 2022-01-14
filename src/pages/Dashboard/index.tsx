import { useTitle } from "src/hooks/useTitle";

import { DataOfDrinks } from "./DataOfDrinks";
import { DataOfRequests } from "./DataOfRequests";

import styles from "./styles.module.scss";

export function Dashboard() {
  useTitle("SkyDrinks - Dashboard");

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>
      <DataOfRequests />
      <DataOfDrinks />
    </section>
  );
}
