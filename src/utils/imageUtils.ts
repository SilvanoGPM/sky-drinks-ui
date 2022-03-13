/**
 * Normaliza uma determinada imagem, removendo o caminho *images* e todas as barras.
 * @param {string} image Caminho da imagem a ser normalizado.
 */
export function normalizeImage(image: string): string {
  return image?.replace('images', '').replaceAll('/', '');
}
