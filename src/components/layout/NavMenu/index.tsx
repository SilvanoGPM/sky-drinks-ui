import { useContext } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import {
  AppstoreOutlined,
  DashboardOutlined,
  DesktopOutlined,
  HomeOutlined,
  IdcardOutlined,
  LoginOutlined,
  LogoutOutlined,
  PictureOutlined,
  RocketOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { AuthContext } from 'src/contexts/AuthContext';
import { getUserPermissions } from 'src/utils/getUserPermissions';
import routes from 'src/routes';

import {
  DrinkIcon,
  MyRequestsIcon,
  PerformRequestIcon,
  SkyDrinksIcon,
  TableIcon,
} from 'src/components/custom/CustomIcons';

import styles from './styles.module.scss';

interface NavMenuProps {
  menuShow: boolean;
  setMenuShow: (menuShow: boolean) => void;
}

const { SubMenu } = Menu;

export function NavMenu({ menuShow, setMenuShow }: NavMenuProps): JSX.Element {
  const { userInfo, authenticated } = useContext(AuthContext);

  const location = useLocation();

  function closeMenu(): void {
    if (window.innerWidth <= 700) {
      setMenuShow(false);
    }
  }

  const permissions = getUserPermissions(userInfo.role);

  const userName = permissions.isGuest
    ? 'Visitante'
    : userInfo.name.split(' ')[0];

  return (
    <div className={`${styles.menuWrapper} ${menuShow ? styles.active : ''}`}>
      <div className={styles.menuHeader}>
        <h1 className={styles.logo}>
          <Link to={routes.HOME}>
            <SkyDrinksIcon />
            <span>SkyDrinks</span>
          </Link>
        </h1>
      </div>

      <div className={styles.userInfo}>
        <p>
          Seja bem vindo, <span title={userName}>{userName}</span>
        </p>
      </div>

      <Menu
        theme="dark"
        selectedKeys={[location.pathname, location.pathname.replace('/', '')]}
        className={styles.menu}
        mode="inline"
        onClick={closeMenu}
      >
        <Menu.Item
          className={styles.menuTitle}
          icon={<HomeOutlined style={{ fontSize: 25 }} />}
          key="/"
        >
          <Link to="/">Início</Link>
        </Menu.Item>

        <SubMenu
          className={styles.menuTitle}
          key="subDrinks"
          icon={<DrinkIcon style={{ fontSize: 25 }} />}
          title="Bebidas"
        >
          <Menu.Item
            icon={<SearchOutlined style={{ fontSize: 25 }} />}
            key={routes.SEARCH_DRINKS}
          >
            <Link to={routes.SEARCH_DRINKS}>Pesquisar Bebidas</Link>
          </Menu.Item>

          {permissions.isBarmen && (
            <Menu.Item
              icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
              key={routes.MANAGE_DRINKS}
            >
              <Link to={routes.MANAGE_DRINKS}>Gerenciar Bebidas</Link>
            </Menu.Item>
          )}
        </SubMenu>

        {!permissions.isGuest && (
          <SubMenu
            className={styles.menuTitle}
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

        {permissions.isBarmen && (
          <Menu.Item
            className={styles.menuTitle}
            icon={<PictureOutlined style={{ fontSize: 25 }} />}
            key={routes.MANAGE_IMAGES}
          >
            <Link to={routes.MANAGE_IMAGES}>Gerenciar Imagens</Link>
          </Menu.Item>
        )}

        {permissions.isWaiter && (
          <Menu.Item
            className={styles.menuTitle}
            icon={<TableIcon style={{ fontSize: 25 }} />}
            key={routes.MANANGE_TABLES}
            title="Mesas"
          >
            <Link to={routes.MANANGE_TABLES}>Gerenciar Mesas</Link>
          </Menu.Item>
        )}

        {permissions.isAdmin && (
          <SubMenu
            className={styles.menuTitle}
            key="subDashboard"
            icon={<DesktopOutlined style={{ fontSize: 25 }} />}
            title="Painel dos Admins"
          >
            <Menu.Item
              icon={<UserOutlined style={{ fontSize: 25 }} />}
              key={routes.MANAGE_USERS}
            >
              <Link to={routes.MANAGE_USERS}>Gerenciar Usuários</Link>
            </Menu.Item>
            <Menu.Item
              icon={<DashboardOutlined style={{ fontSize: 25 }} />}
              key={routes.DASHBOARD}
            >
              <Link to={routes.DASHBOARD}>Dashboard</Link>
            </Menu.Item>
          </SubMenu>
        )}

        <SubMenu
          className={styles.menuTitle}
          key="subAccount"
          icon={<IdcardOutlined style={{ fontSize: 25 }} />}
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
