import { Badge } from "antd";

type StatusType = "PROCESSING" | "FINISHED" | "CANCELED";

export function getStatusBadge(status: StatusType) {
  const statusTexts = {
    PROCESSING: <Badge status="processing" text="Preparando..." />,
    FINISHED: <Badge status="success" text="Finalizado" />,
    CANCELED: <Badge status="error" text="Cancelado" />,
  };

  return statusTexts[status];
}
