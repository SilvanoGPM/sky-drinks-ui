import {
  AppstoreOutlined,
  CloseOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  RocketOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import {
  DrinkIcon,
  MyRequestsIcon,
  PerformRequestIcon,
  TableIcon,
} from "src/components/CustomIcons";
import styles from "./styles.module.scss";

const { SubMenu } = Menu;

export function Home() {
  const [menuShow, setMenuShow] = useState(false);

  function switchMenu() {
    setMenuShow(!menuShow);
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.menuWrapper} ${menuShow ? styles.active : ""}`}>
        <h2 className={styles.menuHeader}>SkyDrinks</h2>

        <Menu
          defaultSelectedKeys={["home"]}
          className={styles.menu}
          mode="inline"
        >
          <Menu.Item
            icon={<HomeOutlined style={{ fontSize: 25 }} />}
            key="home"
          >
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
              Realizar Pedidos
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

      <button
        onClick={switchMenu}
        className={`${styles.menuToggle} ${menuShow ? styles.active : ""}`}
      >
        {menuShow ? (
          <CloseOutlined style={{ fontSize: 20, color: '#e74c3c' }} />
        ) : (
          <MenuOutlined style={{ fontSize: 20 }} />
        )}
      </button>

      <div className={styles.drinksContainer}>
        <div className={`${styles.spacer} ${menuShow ? styles.active : ''}`} />

        <div className={styles.drinksInfo}>
          Total de Drinks: 3 Preço estimado: R$ 34,50
        </div>

        <div className={styles.latest}>Últimos Drinks</div>
      </div>
    </div>
  );
}
