import { Button, Result } from "antd";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MyRequestsIcon } from "src/components/custom/CustomIcons";
import { useFavicon } from "src/hooks/useFavicon";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";

export function RequestCreated() {
  useTitle("SkyDrinks - Pedido realizado com sucesso!");
  useFavicon("green");

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!location?.state?.uuid) {
      navigate(routes.HOME, {
        state: {
          info: { message: "Realize um pedido para acessar essa página :)" },
        },
      });
    }
  }, [navigate, location]);

  function goBack() {
    navigate(-2);
  }

  return (
    <div>
      <Result
        icon={<MyRequestsIcon style={{ color: "#52c41a" }} />}
        title="Pedido realizado com sucesso!"
        subTitle={
          <>
            <h3>Código do pedido: {location.state.uuid}</h3>
            <p>
              Seu pedido foi realizado com sucesso, vá para o seus pedidos para
              verificar o status dele.
            </p>
          </>
        }
        extra={[
          <Link key="view-request" to={`/${routes.VIEW_REQUEST.replace(":uuid", location.state.uuid)}`}>
            <Button type="primary">Ver pedido</Button>
          </Link>,
          <Button onClick={goBack} key="back">Voltar</Button>,
        ]}
      />
    </div>
  );
}
