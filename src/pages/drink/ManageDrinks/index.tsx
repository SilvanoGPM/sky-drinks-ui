import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Popconfirm, Tooltip } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import endpoints from "src/api/api";
import routes from "src/routes";
import { useTitle } from "src/hooks/useTitle";
import { showNotification } from "src/utils/showNotification";
import { ListDrinks } from "../components/ListDrinks";

import styles from "./styles.module.scss";
import { DrinkPaginatedType } from "src/types/drinks";
import { PaginationType } from "src/types/types";

interface RemoveDrinkType {
  uuid: string;
  data: DrinkPaginatedType;
  pagination: PaginationType;
  setData: React.Dispatch<React.SetStateAction<DrinkPaginatedType>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}

export function ManageDrinks() {
  useTitle("SkyDrinks - Gerenciar bebidas");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  function openDrawer() {
    setDrawerVisible(true);
  }

  function removeDrink({
    uuid,
    data,
    pagination,
    setData,
    setPagination,
  }: RemoveDrinkType) {
    return async () => {
      try {
        await endpoints.deleteDrink(uuid);

        setData({
          ...data,
          content: data.content.filter((item) => item.uuid !== uuid),
        });

        const isLastElementOfPage =
          data.content.length === 1 && pagination.page > 0;

        if (isLastElementOfPage) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });

          setLoading(true);
        }

        showNotification({
          type: "success",
          message: "Bebida foi removida com sucesso",
        });
      } catch {
        showNotification({
          type: "error",
          message: "Aconteceu um erro ao tentar deletar a bebida",
        });
      }
    };
  }

  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Gerenciar Bebidas</h2>
      </div>

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar bebida
        </Button>
      </div>

      <ListDrinks
        loading={loading}
        drawerVisible={drawerVisible}
        setLoading={setLoading}
        setDrawerVisible={setDrawerVisible}
        showBuyAction={false}
        renderMoreActions={(props) => [
          <Tooltip title="Editar Bebida" key="edit-drink">
            <Link to={`${routes.EDIT_DRINK}`.replace(":uuid", props.uuid)}>
              <Button type="link">
                <EditOutlined />
              </Button>
            </Link>
          </Tooltip>,

          <Tooltip title="Remover Bebida" placement="bottom" key="remove-drink">
            <Popconfirm
              title="Remover Bebida"
              placement="top"
              okText="Remover"
              cancelText="Cancelar"
              onConfirm={removeDrink(props)}
            >
              <Button type="link">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>,
        ]}
      />

      <div className={styles.bottomButton}>
        <Tooltip title="Criar nova bebida" placement="left">
          <Link to={routes.CREATE_DRINK}>
            <Button
              style={{ minWidth: 50, minHeight: 50 }}
              shape="circle"
              type="primary"
              icon={<PlusOutlined style={{ fontSize: 25 }} />}
            />
          </Link>
        </Tooltip>
      </div>
    </section>
  );
}
