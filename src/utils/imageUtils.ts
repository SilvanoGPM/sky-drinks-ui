export function normalizeImage(image: string) {
  return image?.replace("images", "").replaceAll("/", "");
}
