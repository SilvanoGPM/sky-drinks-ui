import { useState } from "react";
import { Outlet } from "react-router-dom";

import { NavMenu } from "src/components/layout/NavMenu";
import { NavMenuButton } from "src/components/layout/NavMenuButton";
import { RequestInfo } from "src/components/request/RequestInfo";
import { useTitle } from "src/hooks/useTitle";

import styles from "./styles.module.scss";

export function Home() {
  useTitle("SkyDrinks - Home");

  const [menuShow, setMenuShow] = useState(false);

  return (
    <div className={styles.container}>
      <NavMenu menuShow={menuShow} setMenuShow={setMenuShow} />

      <NavMenuButton menuShow={menuShow} setMenuShow={setMenuShow} />

      <div className={styles.drinksContainer}>
        <RequestInfo />
        <Outlet />
      </div>
    </div>
  );
}
