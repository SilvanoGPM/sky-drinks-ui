import { useQuery } from 'react-query';

import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';

type ImageReturnedType = {
  name: string;
  url: string;
  id: string;
};

interface UseImagesReturn {
  images: ImageReturnedType[];
  imagesLoading: boolean;
}

export function useImages(): UseImagesReturn {
  const { data, isLoading, isError, error } = useQuery(
    'uploadedImages',
    endpoints.getAllDrinkImages
  );

  if (isError) {
    handleError({
      error,
      fallback: 'Não foi possível carregar as imagens das bebidas',
    });

    return { images: [], imagesLoading: false };
  }

  if (isLoading) {
    return { images: [], imagesLoading: true };
  }

  return {
    images: data || [],
    imagesLoading: isLoading,
  };
}
