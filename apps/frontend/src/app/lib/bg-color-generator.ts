export const generateBackgroundColor = (seed: number) => {
  const saturation = 50;
  const lightness = 70;

  const hue = (seed * 137.508) % 360;

  // Convert HSL to RGB
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;

  if (0 <= h && h < 1) {
    r = (c + m) * 255;
    g = (x + m) * 255;
    b = m * 255;
  } else if (1 <= h && h < 2) {
    r = (x + m) * 255;
    g = (c + m) * 255;
    b = m * 255;
  } else if (2 <= h && h < 3) {
    r = m * 255;
    g = (c + m) * 255;
    b = (x + m) * 255;
  } else if (3 <= h && h < 4) {
    r = m * 255;
    g = (x + m) * 255;
    b = (c + m) * 255;
  } else if (4 <= h && h < 5) {
    r = (x + m) * 255;
    g = m * 255;
    b = (c + m) * 255;
  } else {
    r = (c + m) * 255;
    g = m * 255;
    b = (x + m) * 255;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;
};
