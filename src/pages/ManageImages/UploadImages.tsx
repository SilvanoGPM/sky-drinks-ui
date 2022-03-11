import { useState } from 'react';
import { PlayCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

import endpoints from 'src/api/api';
import { showNotification } from 'src/utils/showNotification';
import { UploadFile } from 'antd/lib/upload/interface';

import styles from './styles.module.scss';

interface UploadImagesProps {
  setListLoading: (listLoading: boolean) => void;
}

export function UploadImages({
  setListLoading,
}: UploadImagesProps): JSX.Element {
  const [images, setImages] = useState<File[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagesUploading, setImagesUploading] = useState(false);

  function dummyRequest({ file, onSuccess }: any): void {
    setImages([...images, file]);
    setFileList([...fileList, file]);

    return onSuccess(file);
  }

  function resetImages(): void {
    setImages([]);
    setFileList([]);
  }

  async function uploadImages(): Promise<void> {
    try {
      setImagesUploading(true);

      await endpoints.uploadMultipleDrinksImages(images);

      setListLoading(true);

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
      setImagesUploading(false);
      resetImages();
    }
  }

  return (
    <div className={styles.uploadImages}>
      {Boolean(images.length) && (
        <>
          <Button
            loading={imagesUploading}
            size="large"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={uploadImages}
          >
            Iniciar Upload
          </Button>

          <Button
            loading={imagesUploading}
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
      >
        <Button
          loading={imagesUploading}
          size="large"
          icon={<UploadOutlined />}
        >
          Upar Imagens
        </Button>
      </Upload>
    </div>
  );
}
