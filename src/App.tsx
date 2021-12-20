import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { LatestDrinks } from "./components/drink/LatestDrinks";
import { DrinkView } from "./components/drink/DrinkView";
import { SearchDrinks } from "./components/drink/SearchDrinks";
import { AuthProvider } from "./contexts/AuthContext";
import { Logout } from "./components/other/Logout";
import { PrivateRoute } from "./components/custom/PrivateRoute";
import { ManageDrinks } from "./components/drink/ManageDrinks";
import { EditDrink } from "./components/drink/EditDrink";
import { CreateDrink } from "./components/drink/CreateDrink";

import routes from "./routes";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={routes.HOME} element={<Home />}>
          <Route path={routes.HOME} element={<LatestDrinks />} />
          <Route path={routes.VIEW_DRINK} element={<DrinkView />} />
          <Route path={routes.SEARCH_DRINKS} element={<SearchDrinks />} />

          <Route
            path={routes.LOGOUT}
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MANAGE_DRINKS}
            element={
              <PrivateRoute requiredPerms={["isBarmen"]}>
                <ManageDrinks />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.CREATE_DRINK}
            element={
              <PrivateRoute requiredPerms={["isBarmen"]}>
                <CreateDrink />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.EDIT_DRINK}
            element={
              <PrivateRoute requiredPerms={["isBarmen"]}>
                <EditDrink />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
