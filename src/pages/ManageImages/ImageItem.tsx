import { Badge, Button, Image, List, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { animated, useSpring } from 'react-spring';

import routes from 'src/routes';
import { DrinkIcon } from 'src/components/custom/CustomIcons';
import { drinkImageToFullURI } from 'src/utils/imageUtils';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

interface ItemProps {
  image: string;
  drinks: DrinkType[];
  index: number;
  loadingDelete: boolean;
  deleteImage: (image: string) => () => void;
}

export function ImageItem({
  drinks,
  image,
  loadingDelete,
  deleteImage,
  index,
}: ItemProps): JSX.Element {
  const props = useSpring({
    to: { translateX: 0, opacity: 1 },
    from: { translateX: -300, opacity: 0.1 },
    delay: Math.min(index, 5) * 200,
  });

  function getDrinksContent(imageDrinks: DrinkType[]): JSX.Element[] {
    return imageDrinks.map(({ uuid, name }) => (
      <Link key={uuid} to={routes.VIEW_DRINK.replace(':uuid', uuid)}>
        <p className={styles.drinkName}>{name}</p>
      </Link>
    ));
  }

  const picture = drinkImageToFullURI(image);

  const popoverTrigger = window.innerWidth > 700 ? 'hover' : 'click';

  const actions = [
    ...(drinks.length > 0
      ? [
          <Popover
            key="drinks"
            trigger={popoverTrigger}
            title="Bebidas"
            content={getDrinksContent(drinks)}
          >
            <Button shape="round" icon={<DrinkIcon />} />
          </Popover>,
        ]
      : []),

    <Button
      key="remove"
      shape="round"
      loading={loadingDelete}
      icon={<DeleteOutlined style={{ color: '#e74c3c' }} />}
      onClick={deleteImage(image)}
    />,
  ];

  return (
    <animated.div style={props}>
      <List.Item actions={actions} className={styles.item}>
        <Image
          src={picture}
          alt={image}
          style={{ minWidth: 100 }}
          width={100}
          height={100}
        />
        <div className={styles.info}>
          <List.Item.Meta title={<p className={styles.imageName}>{image}</p>} />
          <div className={styles.badge}>
            {drinks.length > 0 ? (
              <Badge status="success" text="Essa imagem possuí bebida!" />
            ) : (
              <Badge status="error" text="Essa imagem não possuí bebida!" />
            )}
          </div>
        </div>
      </List.Item>
    </animated.div>
  );
}
