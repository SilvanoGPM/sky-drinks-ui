import { useEffect, useState } from 'react';

import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';

interface UseImagesReturn {
  images: string[];
  imagesLoading: boolean;
}

export function useImages(): UseImagesReturn {
  const [images, setImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    async function loadImages(): Promise<void> {
      try {
        const files = await endpoints.getAllImagesWithoutPagination();

        setImages(files);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar as imagens das bebidas',
        });
      } finally {
        setImagesLoading(false);
      }
    }

    if (imagesLoading) {
      loadImages();
    }
  }, [imagesLoading]);

  useEffect(() => {
    return () => {
      setImagesLoading(false);
    };
  }, []);

  return {
    images,
    imagesLoading,
  };
}
