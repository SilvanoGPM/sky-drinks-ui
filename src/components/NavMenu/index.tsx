import { Menu } from "antd";

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

type NavMenuProps = {
  menuShow: boolean;
};

const { SubMenu } = Menu;

export function NavMenu({ menuShow }: NavMenuProps) {
  
  return (
    <div className={`${styles.menuWrapper} ${menuShow ? styles.active : ""}`}>
      <h2 className={styles.menuHeader}>SkyDrinks</h2>

      <Menu
        onClick={(event) => {
          console.log(event);
        }}
        defaultSelectedKeys={["home"]}
        className={styles.menu}
        mode="inline"
      >
        <Menu.Item icon={<HomeOutlined style={{ fontSize: 25 }} />} key="home">
          Início
        </Menu.Item>

        <SubMenu
          className={styles.subMenu}
          key="subDrinks"
          icon={<DrinkIcon style={{ fontSize: 25 }} />}
          title="Drinks"
        >
          <Menu.Item
            icon={<SearchOutlined style={{ fontSize: 25 }} />}
            key="search-drinks"
          >
            Pesquisar Drinks
          </Menu.Item>
          <Menu.Item
            icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
            key="manage-drinks"
          >
            Gerenciar Drinks
          </Menu.Item>
        </SubMenu>

        <SubMenu
          className={styles.subMenu}
          key="subRequests"
          icon={<ShoppingCartOutlined style={{ fontSize: 25 }} />}
          title="Pedidos"
        >
          <Menu.Item
            icon={<MyRequestsIcon style={{ fontSize: 25 }} />}
            key="my-requests"
          >
            Meus Pedidos
          </Menu.Item>
          <Menu.Item
            icon={<PerformRequestIcon style={{ fontSize: 25 }} />}
            key="perform-request"
          >
            Realizar Pedido
          </Menu.Item>
        </SubMenu>

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
            Gerenciar Mesas
          </Menu.Item>
        </SubMenu>

        <SubMenu
          className={styles.subMenu}
          key="subAccount"
          icon={<UserOutlined style={{ fontSize: 25 }} />}
          title="Conta"
        >
          <Menu.Item
            icon={<LoginOutlined style={{ fontSize: 25 }} />}
            key="login"
          >
            Entrar
          </Menu.Item>
          <Menu.Item
            icon={<RocketOutlined style={{ fontSize: 25 }} />}
            key="my-account"
          >
            Minha Conta
          </Menu.Item>
          <Menu.Item
            icon={<AppstoreOutlined style={{ fontSize: 25 }} />}
            key="manage-users"
          >
            Gerenciar Usuários
          </Menu.Item>
          <Menu.Item
            icon={<LogoutOutlined style={{ fontSize: 25 }} />}
            key="logout"
            danger
          >
            Sair
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
}
