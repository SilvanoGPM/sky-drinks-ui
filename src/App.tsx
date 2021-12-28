import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { LatestDrinks } from "./components/drink/LatestDrinks";
import { DrinkView } from "./components/drink/DrinkView";
import { SearchDrinks } from "./components/drink/SearchDrinks";
import { AuthContext } from "./contexts/AuthContext";
import { Logout } from "./components/other/Logout";
import { PrivateRoute } from "./components/custom/PrivateRoute";
import { ManageDrinks } from "./components/drink/ManageDrinks";
import { EditDrink } from "./components/drink/EditDrink";
import { CreateDrink } from "./components/drink/CreateDrink";
import { ManageUsers } from "./components/user/ManageUsers";
import { CreateUser } from "./components/user/CreateUser";
import { EditUser } from "./components/user/EditUser";

import routes from "./routes";
import { NotAuthorized } from "./pages/NotAuthorized";
import { MyAccount } from "./components/user/MyAccount";
import { FinalizeRequest } from "./components/request/FinalizeRequest";
import { RequestCreated } from "./components/request/RequestCreated";
import { FindRequest } from "./components/request/FindRequest";
import { ViewRequest } from "./components/request/ViewRequest";
import { MyRequests } from "./components/request/MyRequests";
import { ListImages } from "./components/drink/ListImages";
import { StompSessionProvider } from "react-stomp-hooks";
import { baseURL } from "./api/api";
import React, { useContext } from "react";
import { StompSessionProviderProps } from "react-stomp-hooks/dist/interfaces/StompSessionProviderProps";
import { NotificateRequestUpdates } from "./components/other/NotificateRequestUpdates";
import { ManageRequest } from "./components/request/ManageRequests";

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
        </Route>

        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.NOT_AUTHORIZED} element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
