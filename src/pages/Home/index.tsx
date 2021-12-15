import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import { NavMenu } from "src/components/NavMenu";
import { NavMenuButton } from "src/components/NavMenuButton";
import { LatestDrinks } from "src/components/LatestDrinks";
import { RequestInfo } from "src/components/RequestInfo";
import { DrinkView } from "src/components/DrinkView";
import { SearchDrinks } from "src/components/SearchDrinks";

import routes from "src/routes";

import styles from "./styles.module.scss";

export function Home() {
  const [menuShow, setMenuShow] = useState(false);

  return (
    <div className={styles.container}>
      <NavMenu menuShow={menuShow} />

      <NavMenuButton menuShow={menuShow} setMenuShow={setMenuShow} />

      <div className={styles.drinksContainer}>
        <RequestInfo />

        <Routes>
          <Route path={routes.HOME} element={<LatestDrinks />} />
          <Route path={routes.SOME_DRINK} element={<DrinkView />} />
          <Route path={routes.SEARCH_DRINKS} element={<SearchDrinks />} />
        </Routes>
      </div>
    </div>
  );
}
