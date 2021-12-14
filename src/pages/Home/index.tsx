import { useState } from "react";

import { NavMenu } from "src/components/NavMenu";
import { NavMenuButton } from "src/components/NavMenuButton";
import { LatestDrinks } from "src/components/LatestDrinks";

import styles from "./styles.module.scss";

export function Home() {
  const [menuShow, setMenuShow] = useState(false);

  return (
    <div className={styles.container}>
      <NavMenu menuShow={menuShow} />

      <NavMenuButton menuShow={menuShow} setMenuShow={setMenuShow} />

      <div className={styles.drinksContainer}>
        <div className={`${styles.spacer} ${menuShow ? styles.active : ""}`} />

        <div className={styles.drinksInfo}>
          Total de Drinks: 3 Preço estimado: R$ 34,50
        </div>

        <LatestDrinks />
      </div>
    </div>
  );
}
