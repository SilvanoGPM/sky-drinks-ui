import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CloseOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

import { Badge, Button, List, Tooltip, Popover, Modal } from "antd";

import endpoints from "src/api/api";
import routes from "src/routes";
import { formatDisplayDate } from "src/utils/formatDatabaseDate";
import { showNotification } from "src/utils/showNotification";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import { DrinkIcon } from "src/components/custom/CustomIcons";
import { getDrinksGroupedByUUID } from "src/utils/getDrinksGroupedByUUID";
import { getStatusBadge } from "src/utils/getStatusBadge";
import { handleError } from "src/utils/handleError";
import { imageToFullURI } from "src/utils/imageUtils";

import {
  RequestPaginatedType,
  RequestSearchParams,
  RequestType,
} from "src/types/requests";

import styles from "./styles.module.scss";

interface ListMyRequestsProps {
  params: RequestSearchParams;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const { confirm } = Modal;

export function ListMyRequests({ params, loading, setLoading }: ListMyRequestsProps) {
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const [data, setData] = useState<RequestPaginatedType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadRequests() {
      try {
        const { page, size } = pagination;

        const data = await endpoints.getMyRequests({
          ...params,
          sort: "updatedAt,desc",
          page,
          size,
        });

        setData(data);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível pesquisar os pedidos",
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadRequests();
    }
  }, [loading, params, pagination, setLoading]);

  function handleCopyRequestUUID(uuid: string) {
    return () => {
      navigator.clipboard.writeText(uuid);

      showNotification({
        type: "success",
        message: "Código copiado com sucesso!",
        duration: 2,
      });
    };
  }

  function handleCancelRequest(uuid: string) {
    async function cancelRequest() {
      try {
        await endpoints.cancelRequest(uuid);

        const content = data.content.filter((item) => item.uuid !== uuid);

        setData({ ...data, content });
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível cancelar pedido",
        });
      }
    }

    return () => {
      confirm({
        title: "Deseja cancelar o pedido?",
        content: "Depois de cancelado, o pedido não poderá ser finalizado!",
        okText: "Sim",
        cancelText: "Não",
        onOk: cancelRequest,
      });
    };
  }

  function handlePaginationChange(page: number) {
    setLoading(true);

    setPagination((pagination) => {
      return { ...pagination, page: page - 1 };
    });
  }

  function getDrinksContent(request: RequestType) {
    const drinks = getDrinksGroupedByUUID(request);

    const elements = Object.keys(drinks).map((key, index) => {
      const [drink] = drinks[key];
      const { length } = drinks[key];

      return (
        <li className={styles.drinksItem} key={`${key} - ${index}`}>
          <p title={drink.name}>{drink.name}</p>
          <Badge count={length} />
        </li>
      );
    });

    return (
      <div>
        <ul className={styles.drinksList}>{elements}</ul>
      </div>
    );
  }

  const imageWidth = window.innerWidth > 700 ? 200 : 100;
  const popoverTrigger = window.innerWidth > 700 ? "hover" : "click";


  return (
    <List
      itemLayout="vertical"
      dataSource={data.content}
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.size,
        onChange: handlePaginationChange,
        total: data.totalElements,
        hideOnSinglePage: true,
        responsive: true,
        showSizeChanger: false,
      }}
      renderItem={(request) => {
        const {
          uuid,
          createdAt,
          status,
          drinks: [drink],
          totalPrice,
        } = request;
        const picture = imageToFullURI(drink.picture);

        return (
          <List.Item
            key={uuid}
            actions={[
              <Tooltip key="copy" title="Copiar código">
                <Button onClick={handleCopyRequestUUID(uuid)}>
                  <PaperClipOutlined />
                </Button>
              </Tooltip>,
              <Popover
                placement="bottom"
                trigger={popoverTrigger}
                overlayClassName={styles.drinksOverlay}
                key="drinks"
                title="Bebidas"
                content={getDrinksContent(request)}
              >
                <Button>
                  <DrinkIcon />
                </Button>
              </Popover>,
              ...(status === "PROCESSING"
                ? [
                    <Tooltip key="cancel" title="Cancelar pedido">
                      <Button onClick={handleCancelRequest(uuid)}>
                        <CloseOutlined style={{ color: "#e74c3c" }} />
                      </Button>
                    </Tooltip>,
                  ]
                : []),
            ]}
            extra={
              <img
                width={imageWidth}
                height={imageWidth}
                src={picture}
                alt="Bebida contida no pedido"
              />
            }
          >
            <List.Item.Meta
              title={
                <Link to={`/${routes.VIEW_REQUEST.replace(":uuid", uuid)}`}>
                  <h3 className={styles.itemTitle}>Ver pedido</h3>
                </Link>
              }
            />
            <div className={styles.listItemContent}>
              <div className={styles.status}>
                <p>Status: </p>
                {getStatusBadge(status)}
              </div>
              <p className={styles.info}>Código do pedido: {uuid}</p>
              <p className={styles.info}>
                Preço estimado: {formatDisplayPrice(totalPrice)}
              </p>
              <p className={styles.info}>
                Criado em {formatDisplayDate(createdAt)}
              </p>
            </div>
          </List.Item>
        );
      }}
    />
  );
}
