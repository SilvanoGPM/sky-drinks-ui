import { useContext, useEffect } from 'react';

import { BrowserPermissionsContext } from 'src/contexts/BrowserPermissionsContext';

interface UseBrowserNotificationReturn {
  createBrowsetNotification: (
    title: string,
    options?: NotificationOptions
  ) => void;
}

export function useBrowserNotification(): UseBrowserNotificationReturn {
  const { notificationPermission, requestNotificationPermission } = useContext(
    BrowserPermissionsContext
  );

  useEffect(() => {
    if (notificationPermission === 'default') {
      requestNotificationPermission();
    }
  }, [notificationPermission, requestNotificationPermission]);

  function createBrowsetNotification(
    title: string,
    options?: NotificationOptions
  ): void {
    if (notificationPermission === 'granted') {
      new Notification(title, options);
    }
  }

  return { createBrowsetNotification };
}
