import { CloseOutlined, MenuOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

interface NavMenuButtonProps {
  menuShow: boolean;
  setMenuShow: (menuShow: boolean) => void;
}

export function NavMenuButton({
  menuShow,
  setMenuShow,
}: NavMenuButtonProps): JSX.Element {
  function switchMenu(): void {
    setMenuShow(!menuShow);
  }

  return (
    <button
      type="button"
      onClick={switchMenu}
      className={`${styles.menuToggle} ${menuShow ? styles.active : ''}`}
    >
      {menuShow ? (
        <CloseOutlined style={{ fontSize: 20, color: '#e74c3c' }} />
      ) : (
        <MenuOutlined style={{ fontSize: 20 }} />
      )}
    </button>
  );
}
