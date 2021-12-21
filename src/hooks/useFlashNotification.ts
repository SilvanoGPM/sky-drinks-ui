import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "src/utils/showNotification";

export function useFlashNotification(route: string) {
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state) {
      const notifications: { [key: string]: { message: string, description?: string } } = {
        warn: location?.state?.warn,
        error: location?.state?.error,
        success: location?.state?.success,
        info: location?.state?.info,
      };

      const perfomedNotifications = Object.keys(notifications).map((notification) => {
        const message = notifications[notification];
        const type = notification as "warn" | "error" | "success" | "info";

        if (message) {
          showNotification({ type, ...message });
          return 1;
        }

        return 0;
      });

      const hasNotification = perfomedNotifications.includes(1);

      if (hasNotification) {
        // Limpando o estado quando recaregar a página.
        navigate(route, { replace: true });
      }
    }
  }, [location, navigate, route]);
}
