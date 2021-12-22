import { useTitle } from "src/hooks/useTitle";

import avatar from "src/assets/avatar_white.png";
import { Avatar, Divider, Tooltip } from "antd";
import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { formatDisplayRole } from "src/utils/formatDisplayRole";
import moment from "moment";
import "moment/locale/pt-br";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import routes from "src/routes";
import styles from "./styles.module.scss";

export function MyAccount() {
  useTitle("SkyDrinks - Minha Conta");

  const { userInfo } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.myAccount}>
          <div className={styles.avatarWrapper}>
            <Avatar className={styles.avatar} src={avatar} />
          </div>

          <h2 className={styles.title}>Minha Conta</h2>
          <h3 title={userInfo.name} className={styles.name}>
            {userInfo.name}
          </h3>
        </div>

        <div className={styles.divider}>
          <Divider style={{ fontSize: "1.5rem" }} orientation="left">
            Informações
          </Divider>

          <Tooltip title="Editar informações" className={styles.edit}>
            <Link state={{ back: routes.MY_ACCOUNT }} to={routes.EDIT_USER.replace(":uuid", userInfo.uuid)}>
              <EditOutlined style={{ fontSize: "1rem" }} />
            </Link>
          </Tooltip>
        </div>

        <div className={styles.info}>
          <p>
            Email: <span className={styles.bold}>{userInfo.email}</span>
          </p>
          <p>
            CPF: <span className={styles.bold}>{userInfo.cpf}</span>
          </p>
          <p>
            Tipo:{" "}
            <span className={styles.bold}>
              {formatDisplayRole(userInfo.role)}
            </span>
          </p>
          <p>
            Idade:{" "}
            <span className={styles.bold}>
              {moment().diff(userInfo.birthDay, "years")} Anos
            </span>
          </p>
          <p>
            Sua conta foi criada em:{" "}
            <span className={styles.bold}>
              {moment(userInfo.createdAt)
                .locale("pt-br")
                .format("DD [de] MMMM, yyyy")}
            </span>
          </p>
          <p>
            Última atualização:{" "}
            <span className={styles.bold}>
              {moment(userInfo.createdAt)
                .locale("pt-br")
                .format("DD [de] MMMM, yyyy")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
