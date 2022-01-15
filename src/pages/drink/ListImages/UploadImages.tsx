import { useState } from "react";
import { PlayCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";

import endpoints from "src/api/api";
import { showNotification } from "src/utils/showNotification";

import styles from "./styles.module.scss";

export function UploadImages() {
  const [showUploadList, setShowUploadList] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagesUploading, setImagesUploading] = useState(false);

  function dummyRequest({ file, onSuccess }: any) {
    setImages([...images, file]);
    setShowUploadList(true);

    return onSuccess(file);
  }

  async function uploadImages() {
    try {
      setImagesUploading(true);

      await endpoints.uploadMultipleImages(images);

      setShowUploadList(false);

      showNotification({
        type: "success",
        message: "Upload realizado com sucesso!",
      });
    } catch {
      showNotification({
        type: "warn",
        message: "Não foi possível realizar o upload",
      });
    } finally {
      setImagesUploading(false);
      resetImages();
    }
  }

  function resetImages() {
    setShowUploadList(false);
    setImages([]);
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
              color: "#ffffff",
              borderColor: "#e74c3c",
              backgroundColor: "#e74c3c",
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
        showUploadList={showUploadList}
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
