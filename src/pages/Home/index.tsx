import { useState } from "react";
import { Outlet } from "react-router-dom";

import { NavMenu } from "src/components/NavMenu";
import { NavMenuButton } from "src/components/NavMenuButton";
import { RequestInfo } from "src/components/RequestInfo";

import styles from "./styles.module.scss";

export function Home() {
  const [menuShow, setMenuShow] = useState(false);

  return (
    <div className={styles.container}>
      <NavMenu menuShow={menuShow} />

      <NavMenuButton menuShow={menuShow} setMenuShow={setMenuShow} />

      <div className={styles.drinksContainer}>
        <RequestInfo />
        <Outlet />
      </div>
    </div>
  );
}
