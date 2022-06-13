import { Button, Image, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { animated, useSpring } from 'react-spring';

import styles from './styles.module.scss';

interface ItemProps {
  url: string;
  name: string;
  index: number;
  loadingDelete: boolean;
  deleteImage: (image: string) => () => void;
}

export function ImageItem({
  url,
  name,
  loadingDelete,
  deleteImage,
  index,
}: ItemProps): JSX.Element {
  const props = useSpring({
    to: { translateX: 0, opacity: 1 },
    from: { translateX: -300, opacity: 0.1 },
    delay: Math.min(index, 5) * 200,
  });

  const actions = [
    <Button
      key="remove"
      shape="round"
      loading={loadingDelete}
      icon={<DeleteOutlined style={{ color: '#e74c3c' }} />}
      onClick={deleteImage(name)}
    />,
  ];

  return (
    <animated.div style={props}>
      <List.Item actions={actions} className={styles.item}>
        <Image
          src={url}
          alt={name}
          style={{ minWidth: 100 }}
          width={100}
          height={100}
        />
        <div className={styles.info}>
          <List.Item.Meta title={<p className={styles.imageName}>{name}</p>} />
        </div>
      </List.Item>
    </animated.div>
  );
}
