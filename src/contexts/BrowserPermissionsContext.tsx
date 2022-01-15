import { Modal } from "antd";
import { createContext, useContext, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

interface BrowserPermissionsContextProps {
  notificationPermission: NotificationPermission;
  soundPermission: boolean;
  requestNotificationPermission: () => void;
  toggleSoundPermission: () => void;
}

interface BrowserPermissionsProviderProps {
  children: React.ReactNode;
}

export const BrowserPermissionsContext =
  createContext<BrowserPermissionsContextProps>(
    {} as BrowserPermissionsContextProps
  );

const PERMISSIONS_KEY = "@permissions";

const { info } = Modal;

export function BrowserPermissionsProvider({
  children,
}: BrowserPermissionsProviderProps) {
  const { userInfo, authenticated } = useContext(AuthContext);

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(Notification.permission);

  const [soundPermission, setSoundPermission] = useState(true);

  useEffect(() => {
    const permString = localStorage.getItem(PERMISSIONS_KEY);

    if (permString && authenticated) {
      const perms = JSON.parse(permString);

      if (perms[userInfo.email]) {
        setSoundPermission(perms[userInfo.email].sound);
      }
    }
  }, [userInfo, authenticated]);

  useEffect(() => {
    if (authenticated) {
      const otherUsersString = localStorage.getItem(PERMISSIONS_KEY);
      const otherUsers = otherUsersString ? JSON.parse(otherUsersString) : {};

      const perms = JSON.stringify({
        ...otherUsers,
        [userInfo.email]: { sound: soundPermission },
      });

      localStorage.setItem(PERMISSIONS_KEY, perms);
    }
  }, [soundPermission, userInfo, authenticated]);

  function requestNotificationPermission() {
    async function request() {
      const response = await Notification.requestPermission();
      setNotificationPermission(response);
    }

    if (notificationPermission !== "granted") {
      const content =
        notificationPermission === "denied"
          ? "Você bloqueou as notificações, caso tenha mudado de ideia, acesse as configurações do seu navegador e permita as notificações por lá."
          : "Por favor, permita as notificações para podermos te enviar informações.";

      info({
        title: "Permitir notificações",
        content,
        okText: "Certo",
        onOk: request,
        onCancel: request,
      });
    } else {
      info({
        title: "Bloquear notificações",
        content:
          "Como você já aceitou as notificações, a única maneira de bloqueá-las, é acessando as configurações do navegador.",
        okText: "Certo",
        onOk: request,
        onCancel: request,
      });
    }
  }

  function toggleSoundPermission() {
    setSoundPermission(!soundPermission);
  }

  const value = {
    notificationPermission,
    requestNotificationPermission,
    soundPermission,
    toggleSoundPermission,
  };

  return (
    <BrowserPermissionsContext.Provider value={value}>
      {children}
    </BrowserPermissionsContext.Provider>
  );
}
