import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { LatestDrinks } from "./pages/drink/LatestDrinks";
import { DrinkView } from "./pages/drink/DrinkView";
import { SearchDrinks } from "./pages/drink/SearchDrinks";
import { AuthContext } from "./contexts/AuthContext";
import { Logout } from "./pages/Logout";
import { PrivateRoute } from "./components/custom/PrivateRoute";
import { ManageDrinks } from "./pages/drink/ManageDrinks";
import { EditDrink } from "./pages/drink/EditDrink";
import { CreateDrink } from "./pages/drink/CreateDrink";
import { ManageUsers } from "./pages/user/ManageUsers";
import { CreateUser } from "./pages/user/CreateUser";
import { EditUser } from "./pages/user/EditUser";

import routes from "./routes";
import { NotAuthorized } from "./pages/NotAuthorized";
import { MyAccount } from "./pages/user/MyAccount";
import { FinalizeRequest } from "./pages/request/FinalizeRequest";
import { RequestCreated } from "./pages/request/RequestCreated";
import { FindRequest } from "./pages/request/FindRequest";
import { ViewRequest } from "./pages/request/ViewRequest";
import { MyRequests } from "./pages/request/MyRequests";
import { ListImages } from "./pages/drink/ListImages";
import { StompSessionProvider } from "react-stomp-hooks";
import { baseURL } from "./api/api";
import React, { useContext } from "react";
import { StompSessionProviderProps } from "react-stomp-hooks/dist/interfaces/StompSessionProviderProps";
import { NotificateRequestUpdates } from "./components/other/NotificateRequestUpdates";
import { ManageRequest } from "./pages/request/ManageRequests";
import { SearchRequests } from "./pages/request/SearchRequests";
import { ManageTables } from "./pages/table/ManageTables";
import { Dashboard } from "./pages/Dashboard";

const SOCKET_URL = `${baseURL}/sky-drinks`;

function App() {
  const { authenticated, token } = useContext(AuthContext);

  const Wrapper = authenticated ? StompSessionProvider : React.Fragment;

  const options = {
    ...(authenticated
      ? {
          connectHeaders: { Authorization: token },
          url: SOCKET_URL,
        }
      : {}),
  } as StompSessionProviderProps;

  return (
    <Wrapper {...options}>
      {authenticated && <NotificateRequestUpdates />}

      <Routes>
        <Route path={routes.HOME} element={<Home />}>
          <Route path={routes.HOME} element={<LatestDrinks />} />
          <Route path={routes.VIEW_DRINK} element={<DrinkView />} />
          <Route
            path={routes.SEARCH_DRINKS}
            key="search-drinks"
            element={<SearchDrinks />}
          />

          <Route
            path={routes.LOGOUT}
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.LIST_IMAGES}
            element={
              <PrivateRoute
                requiredPerms={{ type: "and", perms: ["isBarmen"] }}
              >
                <ListImages />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MANAGE_DRINKS}
            element={
              <PrivateRoute
                requiredPerms={{ type: "and", perms: ["isBarmen"] }}
              >
                <ManageDrinks />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.CREATE_DRINK}
            element={
              <PrivateRoute
                requiredPerms={{ type: "and", perms: ["isBarmen"] }}
              >
                <CreateDrink />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.EDIT_DRINK}
            element={
              <PrivateRoute
                requiredPerms={{ type: "and", perms: ["isBarmen"] }}
              >
                <EditDrink />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MANAGE_USERS}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isAdmin"] }}>
                <ManageUsers />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.CREATE_USER}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isAdmin"] }}>
                <CreateUser />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.EDIT_USER}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isUser"] }}>
                <EditUser />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MY_ACCOUNT}
            element={
              <PrivateRoute>
                <MyAccount />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.FINALIZE_REQUEST}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isUser"] }}>
                <FinalizeRequest />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.REQUEST_CREATED}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isUser"] }}>
                <RequestCreated />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.FIND_REQUEST}
            element={
              <PrivateRoute>
                <FindRequest />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.VIEW_REQUEST}
            element={
              <PrivateRoute>
                <ViewRequest />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MY_REQUESTS}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isUser"] }}>
                <MyRequests />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MANAGE_REQUESTS}
            element={
              <PrivateRoute
                requiredPerms={{ type: "or", perms: ["isBarmen", "isWaiter"] }}
              >
                <ManageRequest />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.SEARCH_REQUESTS}
            element={
              <PrivateRoute
                requiredPerms={{ type: "or", perms: ["isBarmen", "isWaiter"] }}
              >
                <SearchRequests />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.MANANGE_TABLES}
            element={
              <PrivateRoute
                requiredPerms={{ type: "and", perms: ["isWaiter"] }}
              >
                <ManageTables />
              </PrivateRoute>
            }
          />

          <Route
            path={routes.DASHBOARD}
            element={
              <PrivateRoute requiredPerms={{ type: "and", perms: ["isAdmin"] }}>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.NOT_AUTHORIZED} element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
