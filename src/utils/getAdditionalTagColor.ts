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

export function getAdditionalTagColor(additional: string) {
  return additionals.has(additional)
    ? additionals.get(additional)
    : chooseRandomColor();
}
