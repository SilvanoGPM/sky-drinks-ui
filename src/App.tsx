import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";

import routes from "./routes";
import { LatestDrinks } from "src/components/LatestDrinks";
import { DrinkView } from "src/components/DrinkView";
import { SearchDrinks } from "src/components/SearchDrinks";
import { AuthProvider } from "./contexts/AuthContext";
import { Logout } from "./components/Logout";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={routes.HOME} element={<Home />}>
          <Route path={routes.HOME} element={<LatestDrinks />} />
          <Route path={routes.SOME_DRINK} element={<DrinkView />} />
          <Route path={routes.SEARCH_DRINKS} element={<SearchDrinks />} />
          <Route
            path={routes.LOGOUT}
            element={
              <PrivateRoute>
                <Logout />
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
