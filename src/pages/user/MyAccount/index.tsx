import { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Divider, Modal, Switch, Tooltip } from 'antd';

import {
  CameraOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import routes from 'src/routes';
import { useTitle } from 'src/hooks/useTitle';
import { AuthContext } from 'src/contexts/AuthContext';
import { formatDisplayRole } from 'src/utils/formatDisplayRole';
import { formatDisplayDate } from 'src/utils/formatDatabaseDate';
import { getUserAge } from 'src/utils/getUserAge';
import { BrowserPermissionsContext } from 'src/contexts/BrowserPermissionsContext';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';
import { showNotification } from 'src/utils/showNotification';
import { getFirstCharOfString } from 'src/utils/getFirstCharOfString';

import { Statistics } from './Statistics';

import styles from './styles.module.scss';

const { confirm } = Modal;

export function MyAccount(): JSX.Element {
  useTitle('SkyDrinks - Minha Conta');

  const { userInfo } = useContext(AuthContext);

  const {
    notificationPermission,
    requestNotificationPermission,
    soundPermission,
    toggleSoundPermission,
  } = useContext(BrowserPermissionsContext);

  const uploadRef = useRef<HTMLInputElement | null>(null);
  const userImageRef = useRef<HTMLSpanElement | null>(null);

  function handleUploadClick(): void {
    uploadRef.current?.click();
  }

  function updateUserImage(file: File): void {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      const userImage = userImageRef.current?.querySelector('img');

      if (userImage) {
        userImage.src = fileReader.result as string;
      }
    });

    fileReader.readAsDataURL(file);
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files?.[0];

    if (file) {
      try {
        await endpoints.uploadUserImage(file);

        showNotification({
          type: 'success',
          message: 'Imagem atualizada com sucesso',
        });

        updateUserImage(file);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível realizar o upload da imagem',
        });
      }
    } else {
      showNotification({
        type: 'warn',
        message: 'Erro no arquivo',
      });
    }
  }

  function removeUserImage(): void {
    async function removeImage(): Promise<void> {
      try {
        await endpoints.deleteUserImage(`${userInfo.uuid}.png`);

        showNotification({
          type: 'success',
          message: 'Sua imagem foi removida com sucesso',
        });
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível remover sua imagem',
        });
      }
    }

    confirm({
      type: 'confirm',
      title: 'Deseja remover sua imagem?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: removeImage,
    });
  }

  const permissions = getUserPermissions(userInfo.role);

  return (
    <section className={styles.container}>
      <div>
        <div className={styles.myAccount}>
          <div className={styles.avatarWrapper}>
            <Avatar
              className={styles.avatar}
              src={endpoints.getUserImage(userInfo.uuid)}
              ref={userImageRef}
            >
              {getFirstCharOfString(userInfo.name)}
            </Avatar>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleUploadClick}
                className={styles.action}
              >
                <CameraOutlined
                  style={{ fontSize: '1.2rem', color: '#ffffff' }}
                />
                <input
                  ref={uploadRef}
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  type="file"
                  style={{ display: 'none' }}
                />
              </button>

              <button
                type="button"
                onClick={removeUserImage}
                className={styles.action}
              >
                <DeleteOutlined
                  style={{ fontSize: '1.2rem', color: '#ffffff' }}
                />
              </button>
            </div>
          </div>

          <h2 className={styles.title}>Minha Conta</h2>
          <h3 title={userInfo.name} className={styles.name}>
            {userInfo.name}
          </h3>

          <p title={userInfo.email} className={styles.email}>
            {userInfo.email}
          </p>

          <Tooltip title="Editar informações" className={styles.edit}>
            <Link
              state={{ back: routes.MY_ACCOUNT }}
              to={routes.EDIT_USER.replace(':uuid', userInfo.uuid)}
            >
              <EditOutlined style={{ fontSize: '1.5rem' }} />
            </Link>
          </Tooltip>
        </div>

        <div className={styles.divider}>
          <Divider style={{ fontSize: '1.5rem' }} orientation="left">
            Informações
          </Divider>
        </div>

        <div className={styles.info}>
          <p>
            Email: <span className={styles.bold}>{userInfo.email}</span>
          </p>
          <p>
            CPF: <span className={styles.bold}>{userInfo.cpf}</span>
          </p>
          <p>
            Tipo:{' '}
            <span className={styles.bold}>
              {formatDisplayRole(userInfo.role)}
            </span>
          </p>
          <p>
            Idade:{' '}
            <span className={styles.bold}>
              {getUserAge(userInfo.birthDay)} Anos
            </span>
          </p>
          <p>
            Sua conta foi criada em:{' '}
            <span className={styles.bold}>
              {formatDisplayDate(userInfo.createdAt)}
            </span>
          </p>
          <p>
            Última atualização:{' '}
            <span className={styles.bold}>
              {formatDisplayDate(userInfo.updatedAt)}
            </span>
          </p>
        </div>
      </div>

      {permissions.isUser && <Statistics />}

      <div>
        <Divider orientation="left" style={{ fontSize: '1.5rem' }}>
          Permissões
        </Divider>

        <div className={styles.perm}>
          <p>Permitir sons:</p>
          <Switch checked={soundPermission} onClick={toggleSoundPermission} />
        </div>

        <div className={styles.perm}>
          <p>Permitir notificações:</p>
          <Switch
            checked={notificationPermission === 'granted'}
            onClick={requestNotificationPermission}
          />
        </div>
      </div>
    </section>
  );
}
