import { CloseOutlined, MenuOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";

interface NavMenuButtonProps {
  menuShow: boolean;
  setMenuShow: (menuShow: boolean) => void;
}

export function NavMenuButton({ menuShow, setMenuShow }: NavMenuButtonProps) {
  function switchMenu() {
    setMenuShow(!menuShow);
  }

  return (
    <button
      onClick={switchMenu}
      className={`${styles.menuToggle} ${menuShow ? styles.active : ""}`}
    >
      {menuShow ? (
        <CloseOutlined style={{ fontSize: 20, color: "#e74c3c" }} />
      ) : (
        <MenuOutlined style={{ fontSize: 20 }} />
      )}
    </button>
  );
}
