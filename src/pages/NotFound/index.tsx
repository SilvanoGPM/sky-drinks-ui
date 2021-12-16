import { Result, Button } from "antd";
import { Link } from "react-router-dom";

import routes from "src/routes";

export function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Desculpa, mas essa página não existe."
      extra={
        <Button type="primary">
          <Link to={routes.HOME}>Voltar para a home</Link>
        </Button>
      }
    />
  );
}