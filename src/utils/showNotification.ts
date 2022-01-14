import { notification } from "antd";
import { NotificationPlacement,  } from "antd/lib/notification";

type NotificationType = "success" | "warn" | "error" | "info";

interface ShowNotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  placement?: NotificationPlacement;
  duration?: number;
}

const defaultProps: ShowNotificationProps = {
  type: "success",
  message: "Ocorreu um erro",
  placement: "bottomRight",
  duration: 5,
};

/**
 * Mostra uma notificação na tela.
 * @param {NotificationType} [type=defaultProps.type] Tipo da notificação.
 * @param {string} [message=defaultProps.message] Mensagem da notificfação.
 * @param {NotificationPlacement} [placement=defaultProps.placement] Lugar onde a notificação vai aparecer na tela.
 * @param {number} [duration=defaultProps.duration] Duração que a notificação vai ficar visível.
 * @param {string} [description] // Descrição da notificação.
 */
export function showNotification({
  type = defaultProps.type,
  message = defaultProps.message,
  placement = defaultProps.placement,
  duration = defaultProps.duration,
  description,
}: ShowNotificationProps = defaultProps): void {
  notification[type]({ message, description, duration, placement });
}
