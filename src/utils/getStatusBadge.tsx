import { Badge } from "antd";

import { RequestStatusType } from "src/types/requests";

export function getStatusBadge(status: RequestStatusType) {
  const statusTexts = {
    PROCESSING: <Badge status="processing" text="Preparando..." />,
    FINISHED: <Badge status="success" text="Finalizado" />,
    CANCELED: <Badge status="error" text="Cancelado" />,
  };

  return statusTexts[status];
}
