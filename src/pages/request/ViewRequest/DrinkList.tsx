import { Badge, Divider } from 'antd';
import { Link } from 'react-router-dom';

import routes from 'src/routes';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { getDrinksGroupedByUUID } from 'src/utils/getDrinksGroupedByUUID';
import { toFullPictureURI } from 'src/utils/toFullPictureURI';

import styles from './styles.module.scss';

interface DrinkListProps {
  request: RequestType;
}

export function DrinkList({ request }: DrinkListProps): JSX.Element {
  return (
    <>
      <Divider
        style={{ fontSize: '1.5rem', margin: '2rem 0' }}
        orientation="left"
      >
        Bebidas
      </Divider>

      <div>
        {Object.keys(getDrinksGroupedByUUID(request)).map((key) => {
          const drinksWithFullPicture = request.drinks.map(toFullPictureURI);

          const drinksGrouped = getDrinksGroupedByUUID({
            drinks: drinksWithFullPicture,
          } as RequestType);

          const [drink] = drinksGrouped[key];
          const { length } = drinksGrouped[key];

          const { picture, name, price } = drink;

          return (
            <div title={name} key={key} className={styles.drink}>
              <div className={styles.info}>
                <Link to={routes.VIEW_DRINK.replace(':uuid', key)}>
                  <p className={styles.name}>{name}</p>
                </Link>
                <p className={styles.price}>
                  {formatDisplayPrice(price * length)}
                </p>
              </div>

              <Badge count={length}>
                <figure>
                  <img src={picture} alt={name} />
                </figure>
              </Badge>
            </div>
          );
        })}
      </div>
    </>
  );
}
