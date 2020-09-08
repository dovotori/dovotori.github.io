export const RGBtoHSL = (r, g, b) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case red:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case green:
        h = (b - r) / d + 2;
        break;
      case blue:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return { h: Math.floor(h * 360), s: Math.floor(s * 100), l: Math.floor(l * 100) };
};

export const HSVtoHSL = (h, s, v) => {
  const hue = h;
  let saturation = s * v;
  let lightness = (2 - s) * v;
  saturation /= lightness <= 1 ? lightness : 2 - lightness;
  lightness /= 2;

  return {
    h: hue,
    s: saturation,
    l: lightness,
  };
};

export const HSLtoHSV = (h, s, l) => {
  const hue = h;
  const ll = l * 2;
  const sss = s * ll <= 1 ? ll : 2 - ll;
  const value = (ll + s) / 2;
  const saturation = (2 * s) / (ll + sss);

  return {
    h: hue,
    s: saturation,
    v: value,
  };
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};
