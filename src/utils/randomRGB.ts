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
