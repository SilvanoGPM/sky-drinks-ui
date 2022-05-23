import { Badge } from 'antd';

/**
 * Pega uma determinada {@link Badge badge} para um determinado {@link RequestStatusType status}.
 * @param {RequestStatusType} status Status do pedido.
 */
export function getStatusBadge(status: RequestStatusType): JSX.Element {
  const statusTexts = {
    PROCESSING: (
      <Badge status="warning" text="Esperando confirmação de um Barmen..." />
    ),
    STARTED: <Badge status="processing" text="Preparando..." />,
    FINISHED: <Badge status="success" text="Finalizado" />,
    CANCELED: <Badge status="error" text="Cancelado" />,
  };

  return statusTexts[status];
}
