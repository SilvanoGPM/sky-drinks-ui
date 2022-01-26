import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

import { Avatar, Button, List, Pagination, Popconfirm, Tooltip } from 'antd';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { formatDisplayRole } from 'src/utils/formatDisplayRole';
import { showNotification } from 'src/utils/showNotification';
import { handleError } from 'src/utils/handleError';
import { formatDatabaseDate } from 'src/utils/formatDatabaseDate';

import avatar from 'src/assets/avatar.png';
import styles from './styles.module.scss';

interface ListUsersProps {
  loading: boolean;
  params: UserSearchParams;
  setLoading: (loading: boolean) => void;
}

export function ListUsers({
  params,
  loading,
  setLoading,
}: ListUsersProps): JSX.Element {
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const [data, setData] = useState<UserPaginatedType>({
    totalElements: 0,
    content: [],
  });

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      try {
        const { page, size } = pagination;

        if (params.email) {
          const content = await endpoints.findUserByEmail(params.email);

          setData({
            totalElements: content ? 1 : 0,
            content: [content],
          });
        } else if (params.cpf) {
          const content = await endpoints.findUserByCPF(params.cpf);

          setData({
            totalElements: content ? 1 : 0,
            content: [content],
          });
        } else {
          const dataFound = await endpoints.searchUser({
            ...params,
            page,
            size,
          });

          setData(dataFound);
        }
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível pesquisar os usuários',
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadUsers();
    }
  }, [loading, pagination, params, setLoading]);

  function removeUser(uuid: string) {
    return async () => {
      try {
        await endpoints.deleteUser(uuid);

        setData({
          ...data,
          content: data.content.filter((item) => item.uuid !== uuid),
        });

        const isLastElementOfPage =
          data.content.length === 1 && pagination.page > 0;

        if (isLastElementOfPage) {
          setPagination({
            ...pagination,
            page: pagination.page - 1,
          });

          setLoading(true);
        }

        showNotification({
          type: 'success',
          message: 'Usuário foi removido com sucesso!',
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Aconteceu um erro ao tentar remover usuário',
        });
      }
    };
  }

  function toggleLockRequests(uuid: string) {
    return async () => {
      try {
        const { lockRequests, lockRequestsTimestamp } =
          await endpoints.toggleUserLockReqeusts(uuid);

        const content = data.content.map((item) => {
          if (item.uuid === uuid) {
            return { ...item, lockRequests, lockRequestsTimestamp };
          }

          return item;
        });

        const message = lockRequests
          ? 'Pedidos do usuário foram bloqueados!'
          : 'Pedidos do usuário foram desbloqueados!';

        showNotification({
          type: 'success',
          message,
        });

        setData({ ...data, content });
      } catch {
        showNotification({
          type: 'warn',
          message: 'Não foi possível alternar os pedidos do usuário.',
        });
      }
    };
  }

  function handlePaginationChange(page: number): void {
    setLoading(true);

    setPagination((oldPagination) => {
      return { ...oldPagination, page: page - 1 };
    });
  }

  return (
    <div className={styles.list}>
      <List
        itemLayout="vertical"
        dataSource={data.content}
        footer={
          <div className={styles.pagination}>
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
        }
        renderItem={({
          name,
          email,
          cpf,
          birthDay,
          role,
          createdAt,
          updatedAt,
          uuid,
          lockRequests,
          lockRequestsTimestamp,
        }) => (
          <List.Item
            className={styles.item}
            actions={[
              <Tooltip key="remove" title="Deletar usuário" placement="bottom">
                <Popconfirm
                  title="Deletar usuário?"
                  placement="top"
                  okText="Remover"
                  onConfirm={removeUser(uuid)}
                  cancelText="Cancelar"
                >
                  <Button
                    shape="round"
                    icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                  />
                </Popconfirm>
              </Tooltip>,
              <Tooltip key="edit" title="Editar usuário" placement="bottom">
                <Link to={routes.EDIT_USER.replace(':uuid', uuid)}>
                  <Button
                    shape="round"
                    icon={<EditOutlined style={{ fontSize: 18 }} />}
                  />
                </Link>
              </Tooltip>,
              <Tooltip
                key="block"
                title={
                  lockRequests
                    ? 'Desbloquear pedidos do usuário'
                    : 'Bloquear pedidos do usuário'
                }
                placement="bottom"
              >
                <Popconfirm
                  title={
                    lockRequests
                      ? 'Desbloquear pedidos do usuário?'
                      : 'Bloquear pedidos do usuário?'
                  }
                  onConfirm={toggleLockRequests(uuid)}
                  placement="top"
                  okText={lockRequests ? 'Desbloquear' : 'Bloquear'}
                  cancelText="Cancelar"
                >
                  {lockRequests ? (
                    <Button
                      shape="round"
                      icon={<UnlockOutlined style={{ fontSize: 18 }} />}
                    />
                  ) : (
                    <Button
                      shape="round"
                      icon={<LockOutlined style={{ fontSize: 18 }} />}
                    />
                  )}
                </Popconfirm>
              </Tooltip>,
              <Tooltip title="Ver métricas do usuário" placement="bottom">
                <Link to={routes.USER_METRICS.replace(':uuid', uuid)}>
                  <Button
                    shape="round"
                    icon={<EyeOutlined style={{ fontSize: 18 }} />}
                  />
                </Link>
              </Tooltip>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={avatar} />}
              title={<p className={styles.name}>{name}</p>}
              description={<p className={styles.email}>Email: {email}</p>}
            />
            <div>
              <p>
                UUID: <span className={styles.bold}>{uuid}</span>
              </p>
              <p>
                CPF: <span className={styles.bold}>{cpf}</span>
              </p>
              <p>
                Tipo:{' '}
                <span className={styles.bold}>{formatDisplayRole(role)}</span>
              </p>
              <p>
                Data de nascimento:{' '}
                <span className={styles.bold}>
                  {formatDatabaseDate(birthDay)}
                </span>
              </p>
              <p>
                Conta criada em:{' '}
                <span className={styles.bold}>
                  {formatDatabaseDate(createdAt)}
                </span>
              </p>
              <p>
                Conta atualizada em:{' '}
                <span className={styles.bold}>
                  {formatDatabaseDate(updatedAt)}
                </span>
              </p>

              {lockRequests && (
                <p>
                  Usuário bloqueado em:{' '}
                  <span className={styles.bold}>
                    {formatDatabaseDate(lockRequestsTimestamp)}
                  </span>
                </p>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
