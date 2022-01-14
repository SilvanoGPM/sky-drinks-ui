import { useState } from "react";
import { useForm } from "antd/lib/form/Form";

import { useTitle } from "src/hooks/useTitle";
import { useFavicon } from "src/hooks/useFavicon";

import { CreateDrinkForm } from "./CreateDrinkForm";
import { DrinkCreated } from "./DrinkCreated";

import styles from "./styles.module.scss";

export function CreateDrink() {
  useTitle("SkyDrinks - Criar bebida");
  useFavicon("green");

  const [form] = useForm();
  const [created, setCreated] = useState(false);

  return (
    <div className={styles.container}>
      {created ? (
        <DrinkCreated form={form} setCreated={setCreated} />
      ) : (
        <>
          <h2 className={styles.title}>Adicionar Bebida</h2>

          <CreateDrinkForm form={form} setCreated={setCreated} />
        </>
      )}
    </div>
  );
}
