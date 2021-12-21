import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import { useFlashNotification } from "src/hooks/useFlashNotification";

import { useTitle } from "src/hooks/useTitle";

import routes from "src/routes";

export function NotAuthorized() {
  useTitle("SkyDrinks - Não autorizado");

  useFlashNotification(routes.NOT_AUTHORIZED);

  return (
    <Result
      status="403"
      title="403"
      subTitle="Você não possui permissão para acessar esta página."
      extra={
        <Button type="primary">
          <Link to={routes.HOME}>Voltar para a home</Link>
        </Button>
      }
    />
  );
}
