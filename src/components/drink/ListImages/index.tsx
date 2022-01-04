import { DeleteOutlined } from "@ant-design/icons";
import { Badge, Button, Image, List, Modal, Popover } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import endpoints, { toFullPictureURI } from "src/api/api";
import { DrinkIcon } from "src/components/custom/CustomIcons";
import { useTitle } from "src/hooks/useTitle";
import routes from "src/routes";
import { handleError } from "src/utils/handleError";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

type ImageFoundedType = {
  image: string;
  drinks: DrinkType[];
};

type PaginetedDataType = {
  totalElements: number;
  content: ImageFoundedType[];
};

const { confirm } = Modal;

export function ListImages() {
  useTitle("SkyDrinks - Visualizar imagens");

  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const [data, setData] = useState<PaginetedDataType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadImages() {
      const data = await endpoints.getAllImages(
        pagination.page,
        pagination.size
      );

      setData(data);

      setLoading(false);
    }

    if (loading) {
      loadImages();
    }
  }, [loading, pagination]);

  function deleteImage(image: string) {
    const remove = async () => {
      try {
        setLoadingDelete(true);

        await endpoints.deleteImage(image);

        const isLastElementOfPage =
          data.content.length === 1 && pagination.page > 0;

        setData({
          ...data,
          content: data.content.filter((item) => item.image !== image),
        });

        if (isLastElementOfPage) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });

          setLoading(true);
        }

        showNotification({
          type: "success",
          message: "Imagem foi removida com sucesso!",
        });
      } catch (error: any) {
        handleError({ error, fallback: "Não foi possível encontrar as imagens" });
      } finally {
        setLoadingDelete(false);
      }
    };

    return () => {
      confirm({
        type: "success",
        title: "Realmente deseja remover essa imagem?",
        okText: "Sim",
        cancelText: "Não",
        onOk: remove,
      });
    };
  }

  function getDrinksContent(drinks: DrinkType[]) {
    return drinks.map(({ uuid, name }) => (
      <Link key={uuid} to={routes.VIEW_DRINK.replace(":uuid", uuid)}>
        <p className={styles.drinkName}>{name}</p>
      </Link>
    ));
  }

  function handlePaginationChange(page: number) {
    setLoading(true);

    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });
  }

  const popoverTrigger = window.innerWidth > 700 ? "hover" : "click";

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Imagens</h2>
      </div>

      <div>
        <List
          loading={loading}
          pagination={{
            current: pagination.page + 1,
            pageSize: pagination.size,
            onChange: handlePaginationChange,
            total: data.totalElements,
            hideOnSinglePage: true,
            responsive: true,
            showSizeChanger: false,
          }}
          dataSource={data.content}
          renderItem={({ drinks, image }) => {
            const { picture } = toFullPictureURI({
              picture: image,
            } as DrinkType);

            const actions = [
              ...(drinks.length > 0
                ? [
                    <Popover
                      key="drinks"
                      trigger={popoverTrigger}
                      title="Bebidas"
                      content={getDrinksContent(drinks)}
                    >
                      <Button shape="round" icon={<DrinkIcon />} />
                    </Popover>,
                  ]
                : []),

              <Button
                key="remove"
                shape="round"
                loading={loadingDelete}
                icon={<DeleteOutlined style={{ color: "#e74c3c" }} />}
                onClick={deleteImage(image)}
              />,
            ];

            return (
              <List.Item actions={actions} className={styles.item}>
                <Image src={picture} alt={image} width={100} height={100} />
                <div className={styles.info}>
                  <List.Item.Meta
                    title={<p className={styles.imageName}>{image}</p>}
                  />
                  <div className={styles.badge}>
                    {drinks.length > 0 ? (
                      <Badge
                        status="success"
                        text="Essa imagem possuí bebida!"
                      />
                    ) : (
                      <Badge
                        status="error"
                        text="Essa imagem não possuí bebida!"
                      />
                    )}
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
