import { useState } from 'react';
import { List, Modal } from 'antd';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import endpoints from 'src/api/api';
import { useTitle } from 'src/hooks/useTitle';
import { handleError } from 'src/utils/handleError';
import { showNotification } from 'src/utils/showNotification';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';

import { UploadImages } from './UploadImages';
import { ImageItem } from './ImageItem';

import styles from './styles.module.scss';

const { confirm } = Modal;

export function ManageImages(): JSX.Element {
  useTitle('SkyDrinks - Gerenciar imagens');

  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const { data, isLoading, isError, error } = useQuery(
    ['images', pagination.page],
    () => endpoints.getAllImages(pagination.page, pagination.size),
    { keepPreviousData: true }
  );

  function onSuccess(): void {
    queryClient.refetchQueries('images');
  }

  const deleteImageMutation = useMutation(
    ({ image, type }: { image: string; type: ImageType }) => {
      return type === 'DRINK'
        ? endpoints.deleteDrinkImage(image)
        : endpoints.deleteUserImage(image);
    },
    { onSuccess }
  );

  function handlePaginationChange(page: number): void {
    setPagination((olgPagination) => {
      return { ...olgPagination, page: page - 1 };
    });
  }

  function deleteImage(image: string, type: ImageType): () => void {
    async function remove(): Promise<void> {
      try {
        await deleteImageMutation.mutateAsync({ image, type });

        const isLastElementOfPage =
          data?.content.length === 1 && pagination.page > 0;

        if (isLastElementOfPage) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });
        }

        showNotification({
          type: 'success',
          message: 'Imagem foi removida com sucesso!',
        });
      } catch (deleteImageError: any) {
        handleError({
          error: deleteImageError,
          fallback: 'Não foi possível encontrar as imagens',
        });
      }
    }

    return () => {
      confirm({
        type: 'success',
        title: 'Realmente deseja remover essa imagem?',
        okText: 'Sim',
        cancelText: 'Não',
        onOk: remove,
      });
    };
  }

  if (isError) {
    handleError({
      error,
      fallback: 'Não foi possível carregar as imagens das bebidas',
    });
  }

  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Imagens</h2>
      </div>

      <UploadImages />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <List
            pagination={{
              current: pagination.page + 1,
              pageSize: pagination.size,
              onChange: handlePaginationChange,
              total: data?.totalElements,
              hideOnSinglePage: true,
              responsive: true,
              showSizeChanger: false,
            }}
            dataSource={data?.content}
            renderItem={(props, index) => {
              return (
                <ImageItem
                  {...props}
                  index={index}
                  loadingDelete={deleteImageMutation.isLoading}
                  deleteImage={deleteImage}
                />
              );
            }}
          />
        </div>
      )}
    </section>
  );
}
