import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import {
  Button,
  Empty,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";

import { useTitle } from "src/hooks/useTitle";
import { DrinkCard } from "../DrinkCard";

import endpoints from "src/api/api";
import routes from "src/routes";

import styles from "./styles.module.scss";

type FoundedDrinkType = {
  uuid: string;
  name: string;
  picture: string;
  price: number;
};

type PaginetedDataType = {
  totalElements: number;
  content: FoundedDrinkType[];
};

const { Search } = Input;

export function ManageDrinks() {
  useTitle("SkyDrinks - Gerenciar bebidas");

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    searchName: "",
    page: 0,
    size: 6,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadDrinks() {
      try {
        const data = await endpoints.searchDrink(
          `page=${pagination.page}${
            pagination.searchName ? `&name=${pagination.searchName}` : ""
          }`
        );
        setData(data);
      } catch (e: any) {
        notification.warn({
          message: e.message,
          duration: 3,
          placement: "bottomRight",
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadDrinks();
    }
  }, [loading, pagination]);

  function handleSearch(value: string) {
    setLoading(true);

    setPagination({
      ...pagination,
      searchName: value,
      page: 0,
    });
  }

  function handlePaginationChange(page: number) {
    setLoading(true);

    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });
  }

  function removeDrink(uuid: string) {
    return async () =>  {
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

        notification.success({
          message: "Bebida foi removida com sucesso!",
          duration: 3,
          placement: "bottomRight",
        });
      } catch (e: any) {
        notification.error({
          message: "Aconteceu um erro ao tentar deletar a bebida",
          duration: 3,
          placement: "bottomRight",
        });
      }
    };
  }

  const cardWidth = window.innerWidth <= 400 ? 280 : 200;

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Search
          loading={loading}
          onSearch={handleSearch}
          placeholder="Nome da bebida"
          size="large"
          allowClear
          enterButton
        />
      </div>

      <div className={styles.drinksWrapper}>
        {loading ? (
          <Spin />
        ) : (
          <>
            {data.content.length !== 0 ? (
              <>
                <ul className={styles.drinksList}>
                  {data.content.map((drink) => (
                    <DrinkCard
                      key={drink.uuid}
                      {...drink}
                      width={cardWidth}
                      height={cardWidth + 50}
                      loading={loading}
                      moreActions={[
                        <Tooltip title="Editar Bebida" key="edit-drink">
                          <Link
                            to={`${routes.EDIT_DRINK}`.replace(
                              ":uuid",
                              drink.uuid
                            )}
                          >
                            <EditOutlined />
                          </Link>
                        </Tooltip>,

                        <Tooltip title="Remover Bebida" placement="bottom" key="remove-drink">
                          <Popconfirm
                            title="Remover Bebida"
                            placement="top"
                            onConfirm={removeDrink(drink.uuid)}
                            okText="Remover"
                            cancelText="Cancelar"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </Tooltip>,
                      ]}
                    />
                  ))}
                </ul>

                <div className={styles.paginationContainer}>
                  <Pagination
                    defaultPageSize={pagination.size}
                    defaultCurrent={pagination.page + 1}
                    current={pagination.page + 1}
                    total={data.totalElements}
                    onChange={handlePaginationChange}
                  />
                </div>
              </>
            ) : (
              <Empty description="Nenhum drink foi encontrado!" />
            )}
          </>
        )}
      </div>

      <div className={styles.createDrink}>
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
    </div>
  );
}
