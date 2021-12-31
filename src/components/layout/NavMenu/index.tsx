import { useContext } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

import {
  AppstoreOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  PictureOutlined,
  RocketOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { AuthContext } from "src/contexts/AuthContext";

import {
  DrinkIcon,
  MyRequestsIcon,
  PerformRequestIcon,
  SkyDrinksIcon,
  TableIcon,
} from "src/components/custom/CustomIcons";

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

  const location = useLocation();

  function closeMenu() {
    if (window.innerWidth <= 700) {
      setMenuShow(false);
    }
  }

  const permissions = getUserPermissions(userInfo.role);

  const userName = permissions.isGuest
    ? "Visitante"
    : userInfo.name.split(" ")[0];

  return (
    <div className={`${styles.menuWrapper} ${menuShow ? styles.active : ""}`}>
      <div className={styles.menuHeader}>
        <h2>
          <SkyDrinksIcon />
          <span>SkyDrinks</span>
        </h2>
      </div>

      <div className={styles.userInfo}>
        <p>
          Seja bem vindo, <span title={userName}>{userName}</span>
        </p>
      </div>

      <Menu
        theme="dark"
        selectedKeys={[location.pathname, location.pathname.replace("/", "")]}
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
              key={routes.MANAGE_DRINKS}
            >
              <Link to={routes.MANAGE_DRINKS}>Gerenciar Drinks</Link>
            </Menu.Item>
          )}

          {permissions.isBarmen && (
            <Menu.Item
              icon={<PictureOutlined style={{ fontSize: 25 }} />}
              key={routes.LIST_IMAGES}
            >
              <Link to={routes.LIST_IMAGES}>Listar Imagens</Link>
            </Menu.Item>
          )}
        </SubMenu>

        {!permissions.isGuest && (
          <SubMenu
            className={styles.subMenu}
            key="subRequests"
            icon={<ShoppingCartOutlined style={{ fontSize: 25 }} />}
            title="Pedidos"
          >
            {permissions.isUser && (
              <Menu.Item
                icon={<MyRequestsIcon style={{ fontSize: 25 }} />}
                key="my-requests"
              >
                <Link to="my-requests">Meus Pedidos</Link>
              </Menu.Item>
            )}

            <Menu.Item
              icon={<PerformRequestIcon style={{ fontSize: 25 }} />}
              key={routes.FIND_REQUEST}
            >
              <Link to={routes.FIND_REQUEST}>Encontrar Pedido</Link>
            </Menu.Item>

            {(permissions.isWaiter || permissions.isBarmen) && (
              <Menu.Item
                icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
                key={routes.MANAGE_REQUESTS}
              >
                <Link to={routes.MANAGE_REQUESTS}>Gerenciar Pedidos</Link>
              </Menu.Item>
            )}

            {(permissions.isWaiter || permissions.isBarmen) && (
              <Menu.Item
                icon={<SearchOutlined style={{ fontSize: 25 }} />}
                key={routes.SEARCH_REQUESTS}
              >
                <Link to={routes.SEARCH_REQUESTS}>Pesquisar Pedidos</Link>
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
              key={routes.MANANGE_TABLES}
            >
              <Link to={routes.MANANGE_TABLES}>Gerenciar Mesas</Link>
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
              key={routes.MY_ACCOUNT}
            >
              <Link to={routes.MY_ACCOUNT}>Minha Conta</Link>
            </Menu.Item>
          )}

          {permissions.isAdmin && (
            <Menu.Item
              icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
              key={routes.MANAGE_USERS}
            >
              <Link to={routes.MANAGE_USERS}>Gerenciar Usuários</Link>
            </Menu.Item>
          )}

          {authenticated && (
            <Menu.Item
              icon={<LogoutOutlined style={{ fontSize: 25 }} />}
              key={routes.LOGOUT}
              danger
            >
              <Link to={routes.LOGOUT}>Sair</Link>
            </Menu.Item>
          )}
        </SubMenu>
      </Menu>
    </div>
  );
}
