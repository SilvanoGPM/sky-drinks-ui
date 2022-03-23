import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animated, config, useSpring } from 'react-spring';

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

  const props = useSpring({
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 },
    config: config.stiff,
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
    <>
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
