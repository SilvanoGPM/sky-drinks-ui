import Icon from "@ant-design/icons";

import { ReactComponent as DrinkSvg } from "src/assets/drink.svg";
import { ReactComponent as TableSvg } from "src/assets/table.svg";
import { ReactComponent as PerformRequestSvg } from "src/assets/perform-request.svg";
import { ReactComponent as MyRequestsSvg } from "src/assets/my-requests.svg";

type IconProps = {
  style?: React.CSSProperties;
  className?: string;
};

export function DrinkIcon(props: IconProps) {
  return <Icon {...props} component={DrinkSvg} />;
}

export function TableIcon(props: IconProps) {
  return <Icon {...props} component={TableSvg} />;
}

export function PerformRequestIcon(props: IconProps) {
  return <Icon {...props} component={PerformRequestSvg} />;
}

export function MyRequestsIcon(props: IconProps) {
  return <Icon {...props} component={MyRequestsSvg} />;
}
