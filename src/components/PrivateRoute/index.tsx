import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import routes from "src/routes";

type CustomRouteProps = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: CustomRouteProps): JSX.Element {
  const { authenticated } = useContext(AuthContext);

  if (!authenticated) {
    return <Navigate to={routes.LOGIN} />;
  }

  return children;
}

