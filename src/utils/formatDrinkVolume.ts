import { pluralize } from "./pluralize";

export function formatDrinkVolume(volume: number) {
  if (volume >= 1000) {
    const liter = (volume / 1000);
    return `${liter.toFixed(1)} ${pluralize(liter, 'litro', 'litros')}.`;
  }

  return `${volume} ${pluralize(volume, 'mililitro', 'mililitros')}.`;
}
