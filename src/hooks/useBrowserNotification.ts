import { useContext, useEffect } from "react";

import { BrowserPermissionsContext } from "src/contexts/BrowserPermissionsContext";

export function useBrowserNotification() {
  const { notificationPermission, requestNotificationPermission } = useContext(
    BrowserPermissionsContext
  );

  useEffect(() => {
    if (notificationPermission === "default") {
      requestNotificationPermission();
    }
  }, [notificationPermission, requestNotificationPermission]);

  function createBrowsetNotification(
    title: string,
    options?: NotificationOptions
  ) {
    if (notificationPermission === "granted") {
      new Notification(title, options);
    }
  }

  return { createBrowsetNotification };
}
