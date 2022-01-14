import { chooseRandomColor } from "./chooseRandomColor";

export const additionals = new Map<string, string>(
  Object.entries({
    gelo: "cyan",
    limao: "green",
    limão: "green",
    amora: "red",
    "amora vermelha": "red",
    "amora roxa": "purple",
    canela: "orange",
    blueberry: "geekblue",
  })
);

/**
 * Pega uma cor para um adicional.
 * @param {string} additional Nome do adicional.
 * @example
 *  getAdditionalTagColor("gelo") // return "cyan";
 *  getAdditionalTagColor() // return a random color.
 */
export function getAdditionalTagColor(additional: string): string {
  return additionals.has(additional)
    ? additionals.get(additional) || ""
    : chooseRandomColor();
}
