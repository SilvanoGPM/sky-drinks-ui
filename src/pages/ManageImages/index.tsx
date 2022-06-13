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

  const { data, isLoading, isError, error } = useQuery(
    'images',
    () => endpoints.getAllDrinkImages(),
    { keepPreviousData: true }
  );

  function onSuccess(): void {
    queryClient.refetchQueries('images');
  }

  const deleteImageMutation = useMutation(
    ({ image }: { image: string }) => {
      return endpoints.deleteDrinkImage(image);
    },
    { onSuccess }
  );

  function deleteImage(image: string): () => void {
    async function remove(): Promise<void> {
      try {
        await deleteImageMutation.mutateAsync({ image });

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
            dataSource={data}
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
