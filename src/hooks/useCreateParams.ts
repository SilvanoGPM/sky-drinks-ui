import { useEffect, useState } from 'react';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';

interface UseCreateParamsProps {
  params: { [key: string]: (x: any) => any };
  setLoading: (value: boolean) => void;
  setParams: (value: any) => void;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationType>>;
}

export function useCreateParams({
  params,
  setParams,
  setLoading,
  setPagination,
}: UseCreateParamsProps): [boolean] {
  const location = useLocation();

  const [creatingURL, setCreatingURL] = useState(true);

  useEffect(() => {
    function getParameter(
      param: string,
      mapper: (x: any) => any = String
    ): any {
      const search = qs.parse(location.search);

      const value = search[param];
      return value ? mapper(value) : undefined;
    }

    if (creatingURL) {
      if (location.search && creatingURL) {
        setCreatingURL(false);

        const keys = Object.keys(params);

        const newParams = keys.reduce((acc: any, key) => {
          return {
            ...acc,
            [key]: getParameter(key, params[key]),
          };
        }, {});

        setParams(newParams);

        setPagination?.((pagination) => ({
          ...pagination,
          page: getParameter('page', Number),
        }));
      }

      setCreatingURL(false);
      setLoading(true);
    }
  }, [location, creatingURL, setLoading, setPagination, params, setParams]);

  return [creatingURL];
}
