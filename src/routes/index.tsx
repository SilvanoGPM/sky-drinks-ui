import { Route, Routes } from 'react-router-dom';

import { Home } from 'src/pages/Home';
import { Login } from 'src/pages/Login';
import { NotFound } from 'src/pages/NotFound';
import { DrinksInfo } from 'src/pages/drink/DrinksInfo';
import { DrinkView } from 'src/pages/drink/DrinkView';
import { SearchDrinks } from 'src/pages/drink/SearchDrinks';
import { Logout } from 'src/pages/Logout';
import { PrivateRoute } from 'src/components/custom/PrivateRoute';
import { ManageDrinks } from 'src/pages/drink/ManageDrinks';
import { EditDrink } from 'src/pages/drink/EditDrink';
import { CreateDrink } from 'src/pages/drink/CreateDrink';
import { ManageUsers } from 'src/pages/user/ManageUsers';
import { CreateUser } from 'src/pages/user/CreateUser';
import { EditUser } from 'src/pages/user/EditUser';
import { NotAuthorized } from 'src/pages/NotAuthorized';
import { MyAccount } from 'src/pages/user/MyAccount';
import { FinalizeRequest } from 'src/pages/request/FinalizeRequest';
import { RequestCreated } from 'src/pages/request/RequestCreated';
import { FindRequest } from 'src/pages/request/FindRequest';
import { ViewRequest } from 'src/pages/request/ViewRequest';
import { MyRequests } from 'src/pages/request/MyRequests';
import { ManageImages } from 'src/pages/ManageImages';
import { ManageRequest } from 'src/pages/request/ManageRequests';
import { SearchRequests } from 'src/pages/request/SearchRequests';
import { ManageTables } from 'src/pages/table/ManageTables';
import { Dashboard } from 'src/pages/Dashboard';
import { UserMetrics } from 'src/pages/user/UserMetrics';
import { ForgotPassword } from 'src/pages/ForgotPassword';

const routes = {
  HOME: '/',
  NOT_AUTHORIZED: '/not-authorized',

  LOGIN: '/login',
  LOGOUT: 'logout',

  MANAGE_IMAGES: 'images/manage',

  SEARCH_DRINKS: 'drinks/search',
  MANAGE_DRINKS: 'drinks/manage',
  VIEW_DRINK: '/drinks/:uuid',
  CREATE_DRINK: '/drinks/create',
  EDIT_DRINK: '/drinks/edit/:uuid',

  MANAGE_USERS: 'users/manage',
  CREATE_USER: '/users/create',
  EDIT_USER: '/users/edit/:uuid',
  USER_METRICS: '/users/metrics/:uuid',
  MY_ACCOUNT: 'my-account',

  FINALIZE_REQUEST: 'requests/finish',
  REQUEST_CREATED: 'requests/created',
  VIEW_REQUEST: 'requests/view/:uuid',
  FIND_REQUEST: 'requests/find/',
  MANAGE_REQUESTS: 'requests/manage',
  SEARCH_REQUESTS: 'requests/search',
  MY_REQUESTS: 'my-requests',

  MANANGE_TABLES: 'tables/manage',

  DASHBOARD: 'dashboard',

  FORGOT_PASSWORD: '/forgot-password',
};

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path={routes.HOME} element={<Home />}>
        <Route path={routes.HOME} element={<DrinksInfo />} />
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
          path={routes.MANAGE_IMAGES}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isBarmen'] }}>
              <ManageImages />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.MANAGE_DRINKS}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isBarmen'] }}>
              <ManageDrinks />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.CREATE_DRINK}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isBarmen'] }}>
              <CreateDrink />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.EDIT_DRINK}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isBarmen'] }}>
              <EditDrink />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.MANAGE_USERS}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isAdmin'] }}>
              <ManageUsers />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.CREATE_USER}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isAdmin'] }}>
              <CreateUser />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.EDIT_USER}
          element={
            <PrivateRoute>
              <EditUser />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.USER_METRICS}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isAdmin'] }}>
              <UserMetrics />
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
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isUser'] }}>
              <FinalizeRequest />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.REQUEST_CREATED}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isUser'] }}>
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
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isUser'] }}>
              <MyRequests />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.MANAGE_REQUESTS}
          element={
            <PrivateRoute
              requiredPerms={{ type: 'or', perms: ['isBarmen', 'isWaiter'] }}
            >
              <ManageRequest />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.SEARCH_REQUESTS}
          element={
            <PrivateRoute
              requiredPerms={{ type: 'or', perms: ['isBarmen', 'isWaiter'] }}
            >
              <SearchRequests />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.MANANGE_TABLES}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isWaiter'] }}>
              <ManageTables />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.DASHBOARD}
          element={
            <PrivateRoute requiredPerms={{ type: 'and', perms: ['isAdmin'] }}>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path={routes.LOGIN} element={<Login />} />
      <Route path={routes.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={routes.NOT_AUTHORIZED} element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default routes;
