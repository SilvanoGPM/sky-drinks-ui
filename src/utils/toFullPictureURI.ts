import { DrinkType } from "src/types/drinks";
import { imageToFullURI } from "./imageUtils";

export function toFullPictureURI(object: DrinkType) {
  return {
    ...object,
    picture: imageToFullURI(object.picture),
  };
}
