const baseURL = process.env.REACT_APP_API_URL;

export function normalizeImage(image: string) {
  return image?.replace("images", "").replaceAll("/", "");
}

export function imageToFullURI(image: string) {
  return `${baseURL}/files/images/${normalizeImage(image)}`;
}
