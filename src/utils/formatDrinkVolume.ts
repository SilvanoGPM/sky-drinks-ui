import { pluralize } from "./pluralize";
/**
 * Formata um determinado volume.
 * @param {number} volume Volume a ser formatado.
 * @example
 *  formatDrinkVolume(100) // return 100 mililitros
 *  formatDrinkVolume(2500) // return 2,5 litros
 */
export function formatDrinkVolume(volume: number): string {
  if (volume >= 1000) {
    const liter = volume / 1000;
    return `${liter.toFixed(1).replace(".", ",")} ${pluralize(
      liter,
      "litro",
      "litros"
    )}.`;
  }

  return `${volume.toString().replace(".", ",")} ${pluralize(
    volume,
    "mililitro",
    "mililitros"
  )}.`;
}
