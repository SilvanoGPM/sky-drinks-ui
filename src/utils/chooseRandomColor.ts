import { randomItem } from './randomItem';

/**
 * Escolhe uma cor aleatória.
 */
export function chooseRandomColor(): string {
  const colors = [
    '#eccc68',
    '#7bed9f',
    '#ff6b81',
    '#ff6348',
    '#5352ed',
    '#ced6e0',
    '#40407a',
    '#218c74',
    '#7158e2',
  ];

  return randomItem(colors);
}
