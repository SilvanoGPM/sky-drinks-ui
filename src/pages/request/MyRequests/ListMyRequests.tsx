import { useEffect, useState } from 'react';
import { List, Modal } from 'antd';

import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';
import { showNotification } from 'src/utils/showNotification';

import { ListItem } from './ListItem';

interface ListMyRequestsProps {
  params: RequestSearchParams;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const { confirm } = Modal;

const INITIAL_DATA = {
  totalElements: 0,
  content: [],
};

export function ListMyRequests({
  params,
  loading,
  setLoading,
}: ListMyRequestsProps): JSX.Element {
  const [pagination, setPagination] = useState<PaginationType>({
    page: 0,
    size: 10,
  });

  const [data, setData] = useState<RequestPaginatedType>(INITIAL_DATA);

  useEffect(() => {
    async function loadRequests(): Promise<void> {
      try {
        const { page, size } = pagination;

        const dataFound = await endpoints.getMyRequests({
          ...params,
          sort: 'updatedAt,desc',
          page,
          size,
        });

        setData(dataFound);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível pesquisar os pedidos',
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
        type: 'success',
        message: 'Código copiado com sucesso!',
        duration: 2,
      });
    };
  }

  function handleCancelRequest(uuid: string): () => void {
    async function cancelRequest(): Promise<void> {
      try {
        await endpoints.cancelRequest(uuid);

        const content = data.content.filter((item) => item.uuid !== uuid);

        setData({ ...data, content });
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível cancelar pedido',
        });
      }
    }

    return () => {
      confirm({
        title: 'Deseja cancelar o pedido?',
        content: 'Depois de cancelado, o pedido não poderá ser finalizado!',
        okText: 'Sim',
        cancelText: 'Não',
        onOk: cancelRequest,
      });
    };
  }

  function handlePaginationChange(page: number): void {
    setPagination((oldPagination) => {
      return { ...oldPagination, page: page - 1 };
    });

    setData(INITIAL_DATA);

    setLoading(true);
  }

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
      renderItem={(request, index) => (
        <ListItem
          index={index}
          handleCancelRequest={handleCancelRequest}
          handleCopyRequestUUID={handleCopyRequestUUID}
          request={request}
        />
      )}
    />
  );
}
