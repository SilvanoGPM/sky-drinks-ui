import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import routes from "src/routes";

type CustomRouteProps = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: CustomRouteProps): JSX.Element {
  const location = useLocation();

  const { authenticated } = useContext(AuthContext);

  if (!authenticated) {
    return <Navigate to={routes.LOGIN} state={{ path: location.pathname }} />;
  }

  return children;
}

