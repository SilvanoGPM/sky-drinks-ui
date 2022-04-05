import { createContext, useCallback, useContext, useMemo } from 'react';

import { Modal } from 'antd';

import { useStorage } from 'src/hooks/useStorage';

import { AuthContext } from './AuthContext';

interface Permissions {
  sound: boolean;
  notifications: NotificationPermission;
}

type PermissionsRecord = Record<string, Permissions>;

interface BrowserPermissionsContextType {
  permissions: Permissions;
  requestNotificationPermission: () => void;
  toggleSoundPermission: () => void;
}

interface BrowserPermissionsProviderProps {
  children: React.ReactNode;
}

export const BrowserPermissionsContext =
  createContext<BrowserPermissionsContextType>(
    {} as BrowserPermissionsContextType
  );

const { info } = Modal;

export function BrowserPermissionsProvider({
  children,
}: BrowserPermissionsProviderProps): JSX.Element {
  const { userInfo, authenticated } = useContext(AuthContext);

  const initialValue = {
    [userInfo.email]: {
      notifications: Notification.permission,
      sound: true,
    },
  };

  const [permissions, setPermissions] = useStorage<PermissionsRecord>(
    '@SkyDrinks/PERMISSIONS',
    initialValue,
    { depends: (perms) => perms[userInfo.email] && authenticated }
  );

  const requestNotificationPermission = useCallback(() => {
    async function request(): Promise<void> {
      const response = await Notification.requestPermission();

      const userPerms = permissions[userInfo.email];

      setPermissions({
        ...permissions,
        [userInfo.email]: { ...userPerms, notifications: response },
      });
    }

    const notificationPermission = permissions[userInfo.email].notifications;

    if (notificationPermission !== 'granted') {
      const content =
        notificationPermission === 'denied'
          ? 'Você bloqueou as notificações, caso tenha mudado de ideia, acesse as configurações do seu navegador e permita as notificações por lá.'
          : 'Por favor, permita as notificações para podermos te enviar informações.';

      info({
        title: 'Permitir notificações',
        content,
        okText: 'Certo',
        onOk: request,
        onCancel: request,
      });
    } else {
      info({
        title: 'Bloquear notificações',
        content:
          'Como você já aceitou as notificações, a única maneira de bloqueá-las, é acessando as configurações do navegador.',
        okText: 'Certo',
        onOk: request,
        onCancel: request,
      });
    }
  }, [permissions, userInfo, setPermissions]);

  const toggleSoundPermission = useCallback(() => {
    const userPerms = permissions[userInfo.email];

    setPermissions({
      ...permissions,
      [userInfo.email]: { ...userPerms, sound: !userPerms.sound },
    });
  }, [permissions, userInfo, setPermissions]);

  const value = useMemo(
    () => ({
      permissions: permissions[userInfo.email],
      requestNotificationPermission,
      toggleSoundPermission,
    }),
    [
      permissions,
      userInfo,
      requestNotificationPermission,
      toggleSoundPermission,
    ]
  );

  return (
    <BrowserPermissionsContext.Provider value={value}>
      {children}
    </BrowserPermissionsContext.Provider>
  );
}
