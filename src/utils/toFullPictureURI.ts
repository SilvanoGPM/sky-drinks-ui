import { imageToFullURI } from './imageUtils';

/**
 * Adiciona a URI da imagem completa a uma bebida.
 * @param  {DrinkType} drink Bebida para adicionar a URI completa.
 */
export function toFullPictureURI(drink: DrinkType): DrinkType {
  return {
    ...drink,
    picture: imageToFullURI(drink.picture),
  };
}
