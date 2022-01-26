import { useEffect, useState } from 'react';
import { List, Modal } from 'antd';

import endpoints from 'src/api/api';
import { useTitle } from 'src/hooks/useTitle';
import { handleError } from 'src/utils/handleError';
import { showNotification } from 'src/utils/showNotification';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';

import { UploadImages } from './UploadImages';
import { ImageItem } from './ImageItem';

import styles from './styles.module.scss';

interface ImageFoundedType {
  image: string;
  drinks: DrinkType[];
}

interface PaginetedDataType {
  totalElements: number;
  content: ImageFoundedType[];
}

const { confirm } = Modal;

const INITIAL_DATA = {
  totalElements: 0,
  content: [],
};

export function ListImages(): JSX.Element {
  useTitle('SkyDrinks - Visualizar imagens');

  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const [data, setData] = useState<PaginetedDataType>(INITIAL_DATA);

  useEffect(() => {
    async function loadImages(): Promise<void> {
      try {
        const dataFound = await endpoints.getAllImages(
          pagination.page,
          pagination.size
        );

        setData(dataFound);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar as imagens das bebidas',
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadImages();
    }
  }, [loading, pagination]);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  function handlePaginationChange(page: number): void {
    setPagination((olgPagination) => {
      return { ...olgPagination, page: page - 1 };
    });

    setData(INITIAL_DATA);

    setLoading(true);
  }

  function deleteImage(image: string): () => void {
    async function remove(): Promise<void> {
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
          type: 'success',
          message: 'Imagem foi removida com sucesso!',
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível encontrar as imagens',
        });
      } finally {
        setLoadingDelete(false);
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

  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Imagens</h2>
      </div>

      <UploadImages setListLoading={setLoading} />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <List
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
            renderItem={(props, index) => {
              return (
                <ImageItem
                  {...props}
                  index={index}
                  loadingDelete={loadingDelete}
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
