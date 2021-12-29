import { Modal } from "antd";
import { createContext, useState } from "react";

type BrowserPermissionsContextProps = {
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => void;
};

type BrowserPermissionsProviderProps = {
  children: React.ReactNode;
};

export const BrowserPermissionsContext =
  createContext<BrowserPermissionsContextProps>(
    {} as BrowserPermissionsContextProps
  );

const { info } = Modal;

export function BrowserPermissionsProvider({
  children,
}: BrowserPermissionsProviderProps) {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(Notification.permission);

  function requestNotificationPermission() {
    async function request() {
      const response = await Notification.requestPermission();
      setNotificationPermission(response);
    }

    info({
      title: "Permitir notificações",
      content:
        "Por favor, permita as notificações para podermos te enviar informações.",
      okText: "Certo",
      onOk: request,
      onCancel: request,
    });
  }

  const value = { notificationPermission, requestNotificationPermission };

  return (
    <BrowserPermissionsContext.Provider value={value}>
      {children}
    </BrowserPermissionsContext.Provider>
  );
}
