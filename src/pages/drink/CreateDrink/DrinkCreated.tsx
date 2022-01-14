import { Button, FormInstance, Result } from "antd";
import { useNavigate } from "react-router-dom";

import routes from "src/routes";
import { DrinkIcon } from "src/components/custom/CustomIcons";

interface DrinkCreatedProps {
  form: FormInstance;
  setCreated: (created: boolean) => void;
}

export function DrinkCreated({ form, setCreated }: DrinkCreatedProps) {
  const navigate = useNavigate();

  function goBack() {
    navigate(`/${routes.MANAGE_DRINKS}`);
  }

  function stay() {
    form.resetFields();
    setCreated(false);
  }

  return (
    <div>
      <Result
        icon={<DrinkIcon style={{ color: "#52c41a" }} />}
        title="Bebida foi criada com sucesso!"
        subTitle="Você deseja voltar para o gerenciamento de bebidas, ou continuar criando bebidas?"
        extra={[
          <Button onClick={stay} type="primary" key="continue">
            Continuar
          </Button>,
          <Button onClick={goBack} key="back">
            Voltar
          </Button>,
        ]}
      />
    </div>
  );
}
