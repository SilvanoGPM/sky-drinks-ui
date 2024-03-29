import { useEffect, useState } from 'react';
import qs from 'query-string';
import { useSearchParams } from 'react-router-dom';
import { useTransition, animated, config } from 'react-spring';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';

import {
  Button,
  Divider,
  Drawer,
  Empty,
  Form,
  Modal,
  Pagination,
  Select,
  Slider,
  Space,
  Tooltip,
} from 'antd';

import endpoints from 'src/api/api';
import { TableIcon } from 'src/components/custom/CustomIcons';
import { useTitle } from 'src/hooks/useTitle';
import { pluralize } from 'src/utils/pluralize';
import { showNotification } from 'src/utils/showNotification';
import { getFieldErrorsDescription, handleError } from 'src/utils/handleError';
import { useCreateParams } from 'src/hooks/useCreateParams';
import { sortObjectToString } from 'src/utils/sortObjectToString';
import { SpinLoadingIndicator } from 'src/components/other/LoadingIndicator';

import { PersistTable } from './PersistTable';

import styles from './styles.module.scss';

interface TableSearchForm {
  seats: number[];
  occupied: number;
  sort: SortType;
}

interface TablePersistForm {
  seats: number;
  number: number;
}

const { confirm } = Modal;
const { Option } = Select;

export function ManageTables(): JSX.Element {
  useTitle('SkyDrinks - Gerenciar mesas');

  const [, setSearchParams] = useSearchParams();

  const [form] = Form.useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const queryClient = useQueryClient();

  const [startFetch, setStartFetch] = useState(false);

  const [params, setParams] = useState<TableSearchParams>({});

  const [pagination, setPagination] = useState({
    page: 0,
    size: 2,
  });

  const { data, isLoading } = useQuery<TablePaginetedType>(
    ['tables', pagination.page],
    () =>
      endpoints.searchTables({
        ...params,
        page: pagination.page,
        size: pagination.size,
      }),
    {
      enabled: startFetch,
      keepPreviousData: true,
    }
  );

  function onSuccess(): void {
    queryClient.refetchQueries('tables');
  }

  const removeTableMutation = useMutation(
    (uuid: string) => {
      return endpoints.deleteTable(uuid);
    },
    { onSuccess }
  );

  const tableOccupiedMutation = useMutation(
    (uuid: string) => {
      return endpoints.toggleTableOccupied(uuid);
    },
    { onSuccess }
  );

  const createTableMutation = useMutation(
    (tableToCreate: TableToCreate) => {
      return endpoints.createTable(tableToCreate);
    },
    { onSuccess }
  );

  const updateTabledMutation = useMutation(
    (tableToUpdate: TableToUpdate) => {
      return endpoints.updateTable(tableToUpdate);
    },
    { onSuccess }
  );

  const [persistTableShow, setPersistTableShow] = useState(false);

  const [selectedTable, setSelectedTable] = useState<TableType>();

  const transitions = useTransition(data?.content || [], {
    keys: (item) => item.uuid,
    trail: 100,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    config: config.stiff,
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

  useCreateParams({
    params: {
      occupied: Number,
      greaterThanOrEqualToSeats: Number,
      lessThanOrEqualToSeats: Number,
      sort: String,
    },
    setParams,
    setLoading: setStartFetch,
    setPagination,
  });

  function handleRemoveTable(uuid: string): () => void {
    async function remove(): Promise<void> {
      try {
        await removeTableMutation.mutateAsync(uuid);

        const isLastElementOfPage =
          data?.content.length === 1 && pagination.page > 0;

        if (isLastElementOfPage) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });
        }

        showNotification({
          type: 'success',
          message: 'Mesa removida com sucesso',
        });
      } catch {
        showNotification({
          type: 'warn',
          message: 'Não foi possível remover mesa',
        });
      }
    }

    return () => {
      confirm({
        title: 'Realmente deseja remover esta mesa?',
        okText: 'Sim',
        cancelText: 'Não',
        onOk: remove,
      });
    };
  }

  function openDrawer(): void {
    setDrawerVisible(true);
  }

  function closeDrawer(): void {
    setDrawerVisible(false);
  }

  function handleTableOccupied(uuid: string, occuppied: boolean): () => void {
    async function toggleTableOccupied(): Promise<void> {
      try {
        await tableOccupiedMutation.mutateAsync(uuid);

        const message = occuppied
          ? 'Mesa desocupada com sucesso!'
          : 'Mesa ocupada com sucesso!';

        showNotification({
          type: 'success',
          message,
          duration: 2,
        });
      } catch {
        showNotification({
          type: 'warn',
          message: 'Não foi possível alternar ocupação da mesa',
        });
      }
    }

    return () => {
      const title = occuppied
        ? 'Deseja desocupar a mesa?'
        : 'Deseja ocupar a mesa?';

      confirm({
        title,
        okText: 'Sim',
        cancelText: 'Não',
        onOk: toggleTableOccupied,
      });
    };
  }

  function handlePaginationChange(page: number): void {
    setPagination((oldPagination) => {
      return { ...oldPagination, page: page - 1 };
    });
  }

  function handleFormFinish(values: TableSearchForm): void {
    const { occupied, seats, sort } = values;

    const [greaterThanOrEqualToSeats, lessThanOrEqualToSeats] = seats;

    setParams({
      greaterThanOrEqualToSeats,
      lessThanOrEqualToSeats,
      occupied,
      sort: sortObjectToString(sort),
    });

    setPagination({ ...pagination, page: 0 });

    closeDrawer();
  }

  function clearForm(): void {
    form.resetFields();
  }

  function showPersistTable(): void {
    setPersistTableShow(true);
  }

  function closePersistTable(): void {
    setPersistTableShow(false);
    setSelectedTable(undefined);
  }

  function selectTable(uuid: string) {
    return () => {
      const selectedTableFound = data?.content.find(
        (item) => item.uuid === uuid
      );

      if (selectedTableFound) {
        setSelectedTable(selectedTableFound);
        showPersistTable();
      }
    };
  }

  async function handleCreateTable(values: TablePersistForm): Promise<void> {
    try {
      await createTableMutation.mutateAsync(values);

      showNotification({
        type: 'success',
        message: 'Mesa foi criada com sucesso!',
      });

      closePersistTable();
    } catch (error: any) {
      const description = getFieldErrorsDescription(error);

      handleError({
        error,
        description,
        fallback: 'Não foi criar mesa',
      });
    }
  }

  async function updateSelectedTable(values: TablePersistForm): Promise<void> {
    try {
      await updateTabledMutation.mutateAsync({
        ...values,
        uuid: selectedTable?.uuid || '',
      });

      showNotification({
        type: 'success',
        message: 'Mesa foi atualizada com sucesso!',
      });

      closePersistTable();
    } catch (error: any) {
      const description = getFieldErrorsDescription(error);

      handleError({
        error,
        description,
        fallback: 'Não foi atualizar mesa',
      });
    }
  }

  const drawerWidth = window.innerWidth <= 400 ? 300 : 400;

  return (
    <section className={styles.container}>
      <div>
        <h2 className={styles.title}>Gerenciar Mesas</h2>
      </div>

      <div className={styles.fullButton}>
        <Button type="primary" icon={<SearchOutlined />} onClick={openDrawer}>
          Pesquisar mesas
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <SpinLoadingIndicator />
        </div>
      ) : data?.content.length ? (
        <ul className={styles.list}>
          {transitions((style, { uuid, number, occupied, seats }) => (
            <animated.li style={style}>
              <div className={styles.table}>
                <Tooltip
                  placement="left"
                  title={
                    occupied
                      ? 'Clique para desocupar a mesa'
                      : 'Clique para ocupar mesa'
                  }
                >
                  <div
                    onClick={handleTableOccupied(uuid, occupied)}
                    role="button"
                    tabIndex={0}
                    className={styles.tableInfo}
                  >
                    <p>
                      A mesa contém{' '}
                      <span className={styles.bold}>
                        {`${seats} ${pluralize(seats, 'assento', 'assentos')}`}
                      </span>
                    </p>
                    <p>
                      A mesa{' '}
                      <span className={styles.bold}>
                        {occupied ? 'está' : 'não está'}
                      </span>{' '}
                      ocupada
                    </p>
                  </div>
                </Tooltip>

                <div className={styles.tableItems}>
                  <p
                    className={styles.tableNumber}
                    style={{
                      fontSize: '1.5rem',
                      color: occupied ? '#e74c3c' : '#2ecc71',
                    }}
                  >
                    {number}
                  </p>

                  <TableIcon
                    style={{
                      fontSize: 80,
                      color: occupied ? '#e74c3c' : '#2ecc71',
                    }}
                  />

                  <div className={styles.tableActions}>
                    <Tooltip title="Editar mesa">
                      <Button
                        onClick={selectTable(uuid)}
                        shape="round"
                        icon={<EditOutlined />}
                      />
                    </Tooltip>

                    <Tooltip title="Remover mesa">
                      <Button
                        shape="round"
                        onClick={handleRemoveTable(uuid)}
                        loading={removeTableMutation.isLoading}
                        icon={<DeleteOutlined />}
                        style={{ color: '#e74c3c' }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </animated.li>
          ))}
        </ul>
      ) : (
        <div>
          <Empty
            style={{ marginTop: '2rem' }}
            description="Não há mesas registradas"
          />
        </div>
      )}

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

      <div className={styles.bottomButton}>
        <Tooltip title="Adicionar mesa" placement="left">
          <Button
            style={{ minWidth: 50, minHeight: 50 }}
            shape="circle"
            type="primary"
            onClick={showPersistTable}
            icon={<PlusOutlined style={{ fontSize: 25 }} />}
          />
        </Tooltip>
      </div>

      <PersistTable
        title={selectedTable ? 'Atualizar mesa' : 'Criar mesa'}
        seats={selectedTable?.seats}
        number={selectedTable?.number}
        loading={
          createTableMutation.isLoading || updateTabledMutation.isLoading
        }
        visible={persistTableShow}
        onFinish={selectedTable ? updateSelectedTable : handleCreateTable}
        onCancel={closePersistTable}
      />

      <Drawer
        width={drawerWidth}
        title="Pesquisar bebida"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Form
          form={form}
          onFinish={handleFormFinish}
          layout="vertical"
          style={{ flex: 1 }}
          initialValues={{
            occupied: '-1',
            seats: [1, 10],
            sort: {
              order: 'createdAt',
              sort: 'asc',
            },
          }}
          name="search-tables"
          autoComplete="off"
        >
          <Divider orientation="left">Geral</Divider>

          <Form.Item label="Ocupação da mesa" name="occupied">
            <Select>
              <Option value="0">Não ocupada</Option>
              <Option value="1">Ocupada</Option>
              <Option value="-1">Ambos</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Assentos" name="seats">
            <Slider
              range={{ draggableTrack: true }}
              min={1}
              max={50}
              tipFormatter={(value) =>
                `${value} ${pluralize(value || 1, 'assento', 'assentos')}`
              }
            />
          </Form.Item>

          <Divider orientation="left">Organizar</Divider>

          <Form.Item label="Organizar por">
            <Space>
              <Form.Item name={['sort', 'order']}>
                <Select>
                  <Option value="createdAt">Data de criação</Option>
                  <Option value="number">Número</Option>
                  <Option value="seats">Assentos</Option>
                </Select>
              </Form.Item>

              <Form.Item name={['sort', 'sort']}>
                <Select>
                  <Option value="asc">
                    <p>
                      <UpOutlined /> Ascendente
                    </p>
                  </Option>

                  <Option value="desc">
                    <p>
                      <DownOutlined /> Descendente
                    </p>
                  </Option>
                </Select>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
              offset: 0,
            }}
          >
            <Button
              icon={<SearchOutlined />}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              Pesquisar
            </Button>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
              offset: 0,
            }}
          >
            <Button
              icon={<DeleteOutlined />}
              size="large"
              style={{ width: '100%' }}
              onClick={clearForm}
            >
              Limpar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </section>
  );
}
