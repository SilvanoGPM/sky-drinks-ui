import { Modal } from "antd";
import { createContext, useEffect, useState } from "react";

type BrowserPermissionsContextProps = {
  notificationPermission: NotificationPermission;
  soundPermission: boolean;
  requestNotificationPermission: () => void;
  toggleSoundPermission: () => void;
};

type BrowserPermissionsProviderProps = {
  children: React.ReactNode;
};

export const BrowserPermissionsContext =
  createContext<BrowserPermissionsContextProps>(
    {} as BrowserPermissionsContextProps
  );

const PERMISSIONS_KEY = "@permissions";

const { info } = Modal;

export function BrowserPermissionsProvider({
  children,
}: BrowserPermissionsProviderProps) {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(Notification.permission);

  const [soundPermission, setSoundPermission] = useState(true);

  useEffect(() => {
    const permString = localStorage.getItem(PERMISSIONS_KEY);

    if (permString) {
      const perms = JSON.parse(permString);
      setSoundPermission(perms.sound);
    }
  }, []);

  useEffect(() => {
    const perms = JSON.stringify({ sound: soundPermission });

    localStorage.setItem(PERMISSIONS_KEY, perms);
  }, [soundPermission]);

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
