/**
 * Retorna um número RGB aleatório.
 */
export function randomRGBNum(): number {
  return Math.floor(Math.random() * (235 - 52 + 1) + 52);
}

/**
 * Retorna um RGB aleatório.
 */
export function randomRGB(): string {
  return `rgb(${randomRGBNum()}, ${randomRGBNum()}, ${randomRGBNum()})`;
}

/**
 * Adidicona o canal alpha a um RGB.
 * @param {string} rgb RGB a ser adicionado.
 * @param {number} alpha Valor do canal alpha.
 */
export function addAlphaToRGB(rgb: string, alpha: number): string {
  return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
}

/**
 * Retorna um RGB de cor quente aleatório.
 */
export function randomHotRGBColor(): string {
  const green = randomRGBNum();

  if (green > 90 && green < 180) {
    return randomHotRGBColor();
  }

  return `rgb(255, ${green}, 0)`;
}
