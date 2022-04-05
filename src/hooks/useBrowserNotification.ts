import { useContext, useEffect } from 'react';

import { BrowserPermissionsContext } from 'src/contexts/BrowserPermissionsContext';

interface UseBrowserNotificationReturn {
  createBrowsetNotification: (
    title: string,
    options?: NotificationOptions
  ) => void;
}

export function useBrowserNotification(): UseBrowserNotificationReturn {
  const { permissions, requestNotificationPermission } = useContext(
    BrowserPermissionsContext
  );

  useEffect(() => {
    if (permissions.notifications === 'default') {
      requestNotificationPermission();
    }
  }, [permissions, requestNotificationPermission]);

  function createBrowsetNotification(
    title: string,
    options?: NotificationOptions
  ): void {
    if (permissions.notifications === 'granted') {
      new Notification(title, options);
    }
  }

  return { createBrowsetNotification };
}
