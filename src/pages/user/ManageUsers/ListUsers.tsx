import { useState } from 'react';
import { Link } from 'react-router-dom';
import { animated, config, useSpring } from 'react-spring';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

import { Avatar, Button, List, Pagination, Tooltip } from 'antd';

import endpoints from 'src/api/api';
import routes from 'src/routes';
import { formatDisplayRole } from 'src/utils/formatDisplayRole';
import { showNotification } from 'src/utils/showNotification';
import { handleError } from 'src/utils/handleError';
import { formatDatabaseDate } from 'src/utils/formatDatabaseDate';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import { getFirstCharOfString } from 'src/utils/getFirstCharOfString';
import { ModalWithPassword } from 'src/components/custom/ConfirmWithPassword';
import { SpinLoadingIndicator } from 'src/components/other/LoadingIndicator';

import styles from './styles.module.scss';

interface ListUsersProps {
  params: UserSearchParams;
}

export function ListUsers({ params }: ListUsersProps): JSX.Element {
  const queryClient = useQueryClient();

  const props = useSpring({
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 },
    config: config.stiff,
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const { isLoading, isError, error, data } = useQuery(
    ['manageUsers', pagination.page],
    () => {
      if (params.email) {
        return endpoints.findUserByEmail(params.email);
      }

      if (params.cpf) {
        return endpoints.findUserByCPF(params.cpf);
      }

      const { page, size } = pagination;

      return endpoints.searchUser({
        ...params,
        page,
        size,
      });
    },
    { keepPreviousData: true }
  );

  function onSuccess(): void {
    queryClient.refetchQueries('totalUsers');
    queryClient.refetchQueries('manageUsers');
  }

  const removeUserMutation = useMutation(
    (uuid: string) => {
      return endpoints.deleteUser(uuid);
    },
    { onSuccess }
  );

  const lockRequestsMutation = useMutation(
    (uuid: string) => {
      return endpoints.toggleUserLockRequests(uuid);
    },
    { onSuccess }
  );

  function removeUser(uuid: string) {
    return async () => {
      try {
        await removeUserMutation.mutateAsync(uuid);

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
          message: 'Usuário foi removido com sucesso!',
        });
      } catch (removeUserError: any) {
        handleError({
          error: removeUserError,
          fallback: 'Aconteceu um erro ao tentar remover usuário',
        });
      }
    };
  }

  function toggleLockRequests(uuid: string) {
    return async () => {
      try {
        const { lockRequests } = await lockRequestsMutation.mutateAsync(uuid);

        const message = lockRequests
          ? 'Pedidos do usuário foram bloqueados!'
          : 'Pedidos do usuário foram desbloqueados!';

        showNotification({
          type: 'success',
          message,
        });
      } catch {
        showNotification({
          type: 'warn',
          message: 'Não foi possível alternar os pedidos do usuário.',
        });
      }
    };
  }

  function handlePaginationChange(page: number): void {
    setPagination((oldPagination) => {
      return { ...oldPagination, page: page - 1 };
    });
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <SpinLoadingIndicator />
      </div>
    );
  }

  if (isError) {
    handleError({
      error,
      fallback: 'Não foi possível pesquisar os usuários',
    });

    return <></>;
  }

  return (
    <>
      <div className={styles.list}>
        <List
          itemLayout="vertical"
          dataSource={data?.content}
          footer={
            <div className={styles.pagination}>
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
            <animated.div style={props}>
              <List.Item
                className={styles.item}
                actions={[
                  <ModalWithPassword
                    key="remove"
                    title={
                      <div>
                        <DeleteOutlined style={{ marginRight: '0.5rem' }} />
                        Deletar usuário <strong>{name}</strong>?
                      </div>
                    }
                    callback={removeUser(uuid)}
                    okText="Remover"
                    cancelText="Cancelar"
                  >
                    <Tooltip title="Deletar usuário" placement="bottom">
                      <Button
                        shape="round"
                        icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                      />
                    </Tooltip>
                  </ModalWithPassword>,
                  <Tooltip key="edit" title="Editar usuário" placement="bottom">
                    <Link to={routes.EDIT_USER.replace(':uuid', uuid)}>
                      <Button
                        shape="round"
                        icon={<EditOutlined style={{ fontSize: 18 }} />}
                      />
                    </Link>
                  </Tooltip>,
                  ...(getUserPermissions(role).isUser
                    ? [
                        <ModalWithPassword
                          key="block"
                          title={
                            lockRequests ? (
                              <div>
                                <UnlockOutlined
                                  style={{ marginRight: '0.5rem' }}
                                />
                                Desbloquear pedidos de <strong>{name}</strong>?
                              </div>
                            ) : (
                              <div>
                                <LockOutlined
                                  style={{ marginRight: '0.5rem' }}
                                />
                                Bloquear pedidos de <strong>{name}</strong>?
                              </div>
                            )
                          }
                          callback={toggleLockRequests(uuid)}
                          okText={lockRequests ? 'Desbloquear' : 'Bloquear'}
                          cancelText="Cancelar"
                        >
                          <Tooltip
                            title={
                              lockRequests
                                ? 'Desbloquear pedidos do usuário'
                                : 'Bloquear pedidos do usuário'
                            }
                            placement="bottom"
                          >
                            {lockRequests ? (
                              <Button
                                shape="round"
                                icon={
                                  <UnlockOutlined style={{ fontSize: 18 }} />
                                }
                              />
                            ) : (
                              <Button
                                shape="round"
                                icon={<LockOutlined style={{ fontSize: 18 }} />}
                              />
                            )}
                          </Tooltip>
                        </ModalWithPassword>,
                      ]
                    : []),
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
                  avatar={
                    <Avatar src={endpoints.getUserImage(uuid)} size={50}>
                      {getFirstCharOfString(name)}
                    </Avatar>
                  }
                  title={<p className={styles.name}>{name}</p>}
                  description={<p className={styles.email}>Email: {email}</p>}
                />
                <div>
                  <p>
                    CPF: <span className={styles.bold}>{cpf}</span>
                  </p>
                  <p>
                    Tipo:{' '}
                    <span className={styles.bold}>
                      {formatDisplayRole(role)}
                    </span>
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
            </animated.div>
          )}
        />
      </div>
    </>
  );
}
