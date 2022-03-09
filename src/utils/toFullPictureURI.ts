import { drinkImageToFullURI } from './imageUtils';

/**
 * Adiciona a URI da imagem completa a uma bebida.
 * @param  {DrinkType} drink Bebida para adicionar a URI completa.
 */
export function toFullDrinkImageURI(drink: DrinkType): DrinkType {
  return {
    ...drink,
    picture: drinkImageToFullURI(drink.picture),
  };
}
