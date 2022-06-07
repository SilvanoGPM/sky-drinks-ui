import { useEffect, useState } from 'react';
import { Empty, Form, Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import qs from 'query-string';

import endpoints from 'src/api/api';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';
import { handleError } from 'src/utils/handleError';
import { pluralize } from 'src/utils/pluralize';
import { useCreateParams } from 'src/hooks/useCreateParams';
import { sortObjectToString } from 'src/utils/sortObjectToString';
import { DrinkDrawer } from './DrinkDrawer';
import { DrinkCard } from '../DrinkCard';

import styles from './styles.module.scss';

interface ListDrinksProps {
  showBuyAction?: boolean;
  drawerVisible: boolean;
  renderMoreActions?: (props: ActionRenderType) => React.ReactNode[];
  setDrawerVisible: (drawerVisible: boolean) => void;
}

interface PriceAndVolumeType {
  greaterThanOrEqualToVolume?: number;
  lessThanOrEqualToVolume?: number;
  greaterThanOrEqualPrice?: number;
  lessThanOrEqualToPrice?: number;
}

export function ListDrinks({
  drawerVisible,
  renderMoreActions,
  setDrawerVisible,
  showBuyAction = true,
}: ListDrinksProps): JSX.Element {
  const [form] = Form.useForm();

  const [, setSearchParams] = useSearchParams();

  const [params, setParams] = useState<DrinkSearchParams>({});

  const [pagination, setPagination] = useState<PaginationType>({
    page: 0,
    size: 6,
  });

  const [startFetch, setStartFetch] = useState(false);

  const { data, error, isLoading, isError } = useQuery<DrinkPaginatedType>(
    ['drinks', pagination.page],
    () =>
      endpoints.searchDrink({
        ...params,
        page: pagination.page,
        size: pagination.size,
      }),
    {
      enabled: startFetch,
      keepPreviousData: true,
    }
  );

  useCreateParams({
    setLoading: setStartFetch,
    setParams,
    setPagination,
    params: {
      name: String,
      description: String,
      additional: String,
      alcoholic: String,
      greaterThanOrEqualToPrice: Number,
      lessThanOrEqualToPrice: Number,
      greaterThanOrEqualToVolume: Number,
      lessThanOrEqualToVolume: Number,
      sort: String,
    },
  });

  useEffect(() => {
    if (startFetch) {
      setSearchParams(
        qs.stringify({
          ...params,
          page: pagination.page,
        })
      );
    }
  }, [startFetch, pagination, setSearchParams, params]);

  function handlePaginationChange(page: number): void {
    setPagination((oldPagination) => ({ ...oldPagination, page: page - 1 }));
  }

  function getPriceAndVolume(
    price: number[],
    volume: number[]
  ): PriceAndVolumeType {
    return {
      ...(form.isFieldTouched('volume')
        ? {
            greaterThanOrEqualToVolume: volume[0],
            lessThanOrEqualToVolume: volume[1],
          }
        : {}),

      ...(form.isFieldTouched('price')
        ? {
            greaterThanOrEqualToPrice: price[0],
            lessThanOrEqualToPrice: price[1],
          }
        : {}),
    };
  }

  function handleFormFinish(values: DrinkSearchForm): void {
    const { name, description, additional, alcoholic, price, volume, sort } =
      values;

    const paramsCreated: DrinkSearchParams = {
      name,
      description,
      alcoholic,
      sort: sortObjectToString(sort),
      additional: additional?.join(';'),
      ...getPriceAndVolume(price, volume),
    };

    setDrawerVisible(false);

    setPagination({ ...pagination, page: 0 });
    setParams(paramsCreated);
  }

  const cardWidth = window.innerWidth <= 400 ? 280 : 200;

  if (isError) {
    handleError({
      error,
      fallback: 'Não foi possível pesquisar as bebidas',
    });

    return <></>;
  }

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className={styles.drinksWrapper}>
          {data?.content.length !== 0 ? (
            <>
              <h2 className={styles.drinksFounded}>
                {data?.totalElements || 0}{' '}
                {pluralize(
                  data?.totalElements || 0,
                  'Bebida encontrada',
                  'Bebidas encontradas'
                )}
                :
              </h2>
              <ul className={styles.drinksList}>
                {data?.content.map((drink) => (
                  <DrinkCard
                    {...drink}
                    key={drink.uuid}
                    width={cardWidth}
                    imageHeight={cardWidth}
                    loading={isLoading}
                    showBuyAction={showBuyAction}
                    moreActions={renderMoreActions?.({
                      uuid: drink.uuid,
                      data,
                      pagination,
                      setPagination,
                    })}
                  />
                ))}
              </ul>

              <div className={styles.paginationContainer}>
                <Pagination
                  pageSize={pagination.size}
                  current={pagination.page + 1}
                  total={data?.totalElements}
                  hideOnSinglePage
                  onChange={handlePaginationChange}
                  responsive
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="Nenhuma bebida foi encontrada!" />
          )}
        </div>
      )}

      <DrinkDrawer
        onFinish={handleFormFinish}
        form={form}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
      />
    </>
  );
}
