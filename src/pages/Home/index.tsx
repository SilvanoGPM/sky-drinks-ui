import { useState } from "react";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

import { NavMenu } from "src/components/NavMenu";
import { LatestDrinks } from "src/components/LatestDrinks";

import styles from "./styles.module.scss";

export function Home() {
  const [menuShow, setMenuShow] = useState(false);

  function switchMenu() {
    setMenuShow(!menuShow);
  }

  return (
    <div className={styles.container}>
      <NavMenu menuShow={menuShow} />

      <button
        onClick={switchMenu}
        className={`${styles.menuToggle} ${menuShow ? styles.active : ""}`}
      >
        {menuShow ? (
          <CloseOutlined style={{ fontSize: 20, color: "#e74c3c" }} />
        ) : (
          <MenuOutlined style={{ fontSize: 20 }} />
        )}
      </button>

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
