import { useEffect, useState } from 'react';
import { Empty, Form, Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';
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
  loading: boolean;
  showBuyAction?: boolean;
  drawerVisible: boolean;
  setLoading: (loading: boolean) => void;
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
  loading,
  drawerVisible,
  renderMoreActions,
  setLoading,
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

  const [data, setData] = useState<DrinkPaginatedType>({
    totalElements: 0,
    content: [],
  });

  useCreateParams({
    setLoading,
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
    async function loadDrinks(): Promise<void> {
      try {
        const { page, size } = pagination;

        const dataFound = await endpoints.searchDrink({
          ...params,
          page,
          size,
        });

        setSearchParams(
          qs.stringify({
            ...params,
            page,
          })
        );

        setData(dataFound);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível pesquisar as bebidas',
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadDrinks();
    }
  }, [loading, pagination, params, setSearchParams, setLoading]);

  useEffect(() => {
    return () => setLoading(false);
  }, [setLoading]);

  function handlePaginationChange(page: number): void {
    setPagination((oldPagination) => ({ ...oldPagination, page: page - 1 }));

    setLoading(true);
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
    setLoading(true);
  }

  const cardWidth = window.innerWidth <= 400 ? 280 : 200;

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className={styles.drinksWrapper}>
          {data.content.length !== 0 ? (
            <>
              <h2 className={styles.drinksFounded}>
                {data.totalElements}{' '}
                {pluralize(
                  data.totalElements,
                  'Bebida encontrada',
                  'Bebidas encontradas'
                )}
                :
              </h2>
              <ul className={styles.drinksList}>
                {data.content.map((drink) => (
                  <DrinkCard
                    key={drink.uuid}
                    {...drink}
                    width={cardWidth}
                    imageHeight={cardWidth}
                    loading={loading}
                    showBuyAction={showBuyAction}
                    moreActions={renderMoreActions?.({
                      uuid: drink.uuid,
                      data,
                      pagination,
                      setData,
                      setPagination,
                    })}
                  />
                ))}
              </ul>

              <div className={styles.paginationContainer}>
                <Pagination
                  pageSize={pagination.size}
                  current={pagination.page + 1}
                  total={data.totalElements}
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
