export const rgbToHsl = (r, g, b) => {
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
  return {
    h: Math.floor(h * 360),
    s: Math.floor(s * 100),
    l: Math.floor(l * 100),
  };
};

const hueToRgb = (p, q, t) => {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
};

export const hslToRgb = (hue, sat, light) => {
  let r;
  let g;
  let b;

  const h = hue / 360;
  const s = sat / 100;
  const l = light / 100;

  if (s === 0) {
    r = l;
    g = l;
    b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const hsvToHsl = (h, s, v) => {
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

export const hslToHsv = (h, s, l) => {
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
