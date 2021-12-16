import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import routes from "src/routes";

type CustomRouteProps = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: CustomRouteProps): JSX.Element {
  const { authLoading, authenticated } = useContext(AuthContext);

  if (authLoading) {
    return <h1>Loading...</h1>;
  }

  if (!authenticated) {
    return <Navigate to={routes.LOGIN} />;
  }

  return children;
}

