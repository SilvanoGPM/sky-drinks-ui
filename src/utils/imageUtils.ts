const baseURL = process.env.REACT_APP_API_URL;
/**
 * Normaliza uma determinada imagem, removendo o caminho *images* e todas as barras.
 * @param {string} image Caminho da imagem a ser normalizado.
 */
export function normalizeImage(image: string): string {
  return image?.replace("images", "").replaceAll("/", "");
}

/**
 * Adiciona a URI completa de uma determinada imagem.
 * @param {string} image Caminho da imagem para adicionar a URI completa.
 */
export function imageToFullURI(image: string): string {
  return `${baseURL}/files/images/${normalizeImage(image)}`;
}
