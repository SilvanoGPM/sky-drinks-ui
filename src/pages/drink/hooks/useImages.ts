import { useQuery } from 'react-query';

import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';

interface UseImagesReturn {
  images: string[];
  imagesLoading: boolean;
}

export function useImages(): UseImagesReturn {
  const { data, isLoading, isError, error } = useQuery(
    'uploadedImages',
    endpoints.getAllImagesWithoutPagination
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

  const filteredData = data?.filter((str) => str.startsWith('/drinks'));

  return {
    images: filteredData || [],
    imagesLoading: isLoading,
  };
}
