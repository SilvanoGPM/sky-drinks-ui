import { useContext } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";

import {
  AppstoreOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  RocketOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  DrinkIcon,
  MyRequestsIcon,
  PerformRequestIcon,
  TableIcon,
} from "src/components/CustomIcons";

import styles from "./styles.module.scss";
import { getUserPermissions } from "src/utils/getUserPermissions";
import routes from "src/routes";

type NavMenuProps = {
  menuShow: boolean;
  setMenuShow: (menuShow: boolean) => void;
};

const { SubMenu } = Menu;

export function NavMenu({ menuShow, setMenuShow }: NavMenuProps) {
  const { userInfo, authenticated } = useContext(AuthContext);

  function closeMenu() {
    if (window.innerWidth <= 700) {
      setMenuShow(false);
    }
  }

  const location = useLocation();

  const permissions = getUserPermissions(userInfo.role);

  return (
    <div className={`${styles.menuWrapper} ${menuShow ? styles.active : ""}`}>
      <div className={styles.menuHeader}>
        <h2>SkyDrinks</h2>
      </div>

      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname, location.pathname.replace('/', '')]}
        className={styles.menu}
        mode="inline"
        onClick={closeMenu}
      >
        <Menu.Item icon={<HomeOutlined style={{ fontSize: 25 }} />} key="/">
          <Link to="/">Início</Link>
        </Menu.Item>

        <SubMenu
          className={styles.subMenu}
          key="subDrinks"
          icon={<DrinkIcon style={{ fontSize: 25 }} />}
          title="Drinks"
        >
          <Menu.Item
            icon={<SearchOutlined style={{ fontSize: 25 }} />}
            key={routes.SEARCH_DRINKS}
          >
            <Link to={routes.SEARCH_DRINKS}>Pesquisar Drinks</Link>
          </Menu.Item>

          {permissions.isBarmen && (
            <Menu.Item
              icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
              key="drinks/manage"
            >
              <Link to={routes.MANAGE_DRINKS}>Gerenciar Drinks</Link>
            </Menu.Item>
          )}
        </SubMenu>

        {(permissions.isUser || permissions.isWaiter) && (
          <SubMenu
            className={styles.subMenu}
            key="subRequests"
            icon={<ShoppingCartOutlined style={{ fontSize: 25 }} />}
            title="Pedidos"
          >
            {permissions.isUser && (
              <>
                <Menu.Item
                  icon={<MyRequestsIcon style={{ fontSize: 25 }} />}
                  key="my-requests"
                >
                  <Link to="my-requests">Meus Pedidos</Link>
                </Menu.Item>

                <Menu.Item
                  icon={<PerformRequestIcon style={{ fontSize: 25 }} />}
                  key="perform-request"
                >
                  <Link to="perform-request">Realizar Pedido</Link>
                </Menu.Item>
              </>
            )}

            {permissions.isWaiter && (
              <Menu.Item
                icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
                key="manage-requests"
              >
                <Link to="manage-requests">Gerenciar Pedidos</Link>
              </Menu.Item>
            )}
          </SubMenu>
        )}

        {permissions.isWaiter && (
          <SubMenu
            className={styles.subMenu}
            key="subTables"
            icon={<TableIcon style={{ fontSize: 25 }} />}
            title="Mesas"
          >
            <Menu.Item
              icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
              key="manage-tables"
            >
              <Link to="manage-tables">Gerenciar Mesas</Link>
            </Menu.Item>
          </SubMenu>
        )}

        <SubMenu
          className={styles.subMenu}
          key="subAccount"
          icon={<UserOutlined style={{ fontSize: 25 }} />}
          title="Conta"
        >
          {permissions.isGuest && (
            <Menu.Item
              icon={<LoginOutlined style={{ fontSize: 25 }} />}
              key="login"
            >
              <Link to="/login">Entrar</Link>
            </Menu.Item>
          )}

          {authenticated && (
            <Menu.Item
              icon={<RocketOutlined style={{ fontSize: 25 }} />}
              key="my-account"
            >
              <Link to="/my-account">Minha Conta</Link>
            </Menu.Item>
          )}

          {permissions.isAdmin && (
            <Menu.Item
              icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
              key="manage-users"
            >
              <Link to="/manage-users">Gerenciar Usuários</Link>
            </Menu.Item>
          )}

          {authenticated && (
            <Menu.Item
              icon={<LogoutOutlined style={{ fontSize: 25 }} />}
              key="logout"
              danger
            >
              <Link to="/logout">Sair</Link>
            </Menu.Item>
          )}
        </SubMenu>
      </Menu>
    </div>
  );
}
