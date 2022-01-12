function randomNum() {
  return Math.floor(Math.random() * (235 - 52 + 1) + 52);
}

export function randomRGB() {
  return `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
}

export function addAlphaToRGB(rgb: string, alpha: number) {
  return rgb
    .replace("rgb", "rgba")
    .replace(")", `, ${alpha})`);
}

export function randomHotRGBColor(): string {
  const green = randomNum();

  if (green > 90 && green < 180) {
    return randomHotRGBColor();
  }

  return `rgb(255, ${green}, 0)`;
}
