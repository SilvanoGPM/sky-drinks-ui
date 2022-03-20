import { useState } from 'react';
import { PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import { UploadFile } from 'antd/lib/upload/interface';

import endpoints from 'src/api/api';
import { showNotification } from 'src/utils/showNotification';

import styles from './styles.module.scss';

export function UploadImages(): JSX.Element {
  const queryClient = useQueryClient();

  const [images, setImages] = useState<File[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadMutation = useMutation(
    (imagesToUpload: File[]) =>
      endpoints.uploadMultipleDrinksImages(imagesToUpload),
    { onSuccess: () => queryClient.refetchQueries('images') }
  );

  function dummyRequest({ file, onSuccess }: any): Promise<void> {
    setImages([...images, file]);
    setFileList([...fileList, file]);

    return new Promise(() => onSuccess(file));
  }

  function resetImages(): void {
    setImages([]);
    setFileList([]);
  }

  async function uploadImages(): Promise<void> {
    try {
      await uploadMutation.mutateAsync(images);

      showNotification({
        type: 'success',
        message: 'Upload realizado com sucesso!',
      });
    } catch {
      showNotification({
        type: 'warn',
        message: 'Não foi possível realizar o upload',
      });
    } finally {
      resetImages();
    }
  }

  function handleRemoveImage(image: any): void {
    const filteredList = fileList.filter(({ uid }) => image.uid !== uid);
    const imagesMapped = filteredList.map((file: any) => file as File);

    setFileList(filteredList);
    setImages(imagesMapped);
  }

  return (
    <div className={styles.uploadImages}>
      {Boolean(fileList.length) && (
        <>
          <Button
            loading={uploadMutation.isLoading}
            size="large"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={uploadImages}
          >
            Iniciar Upload
          </Button>

          <Button
            loading={uploadMutation.isLoading}
            size="large"
            type="primary"
            style={{
              color: '#ffffff',
              borderColor: '#e74c3c',
              backgroundColor: '#e74c3c',
            }}
            icon={<PlayCircleOutlined />}
            onClick={resetImages}
          >
            Resetar Imagens
          </Button>
        </>
      )}

      <Upload
        listType="picture"
        accept="image/png, image/jpeg"
        multiple
        customRequest={dummyRequest}
        fileList={fileList}
        onRemove={handleRemoveImage}
      >
        <Button
          loading={uploadMutation.isLoading}
          size="large"
          icon={<UploadOutlined />}
        >
          Upar Imagens
        </Button>
      </Upload>
    </div>
  );
}
