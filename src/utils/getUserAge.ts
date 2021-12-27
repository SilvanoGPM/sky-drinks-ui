import moment from "moment";
import "moment/locale/pt-br";

export function getUserAge(birthDay: string) {
  return moment().diff(birthDay, "years");
}
