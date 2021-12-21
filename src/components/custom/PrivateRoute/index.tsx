import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import routes from "src/routes";
import { AuthContext } from "src/contexts/AuthContext";
import { getUserPermissions } from "src/utils/getUserPermissions";

type UserPerms = "isAdmin" | "isBarmen" | "isWaiter" | "isUser" | "isGuest";

type CustomRouteProps = {
  children: JSX.Element;
  requiredPerms?: {
    type: "or" | "and";
    perms: UserPerms[];
  };
};

export function PrivateRoute({ children, requiredPerms = { type: "and", perms: [] } }: CustomRouteProps): JSX.Element {
  const location = useLocation();

  const { authenticated, userInfo } = useContext(AuthContext);

  if (!authenticated) {
    return <Navigate to={routes.LOGIN} state={{ path: location.pathname }} />;
  }

  const permissions = getUserPermissions(userInfo.role);

  function containsPerm(perm: UserPerms) {
    return permissions[perm];
  }

  const hasPermission = requiredPerms.type === "and"
    ? requiredPerms.perms.every(containsPerm)
    : requiredPerms.perms.some(containsPerm);

  if (!hasPermission) {
    return <Navigate to={routes.HOME} />;
  }

  return children;
}
