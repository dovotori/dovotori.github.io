import { css } from 'styled-components';

import stripes from 'Assets/img/stripes.png';
import stripesWhite from 'Assets/img/stripesWhite.png';

const getType = (p) => {
  const { colorType, $colorType } = p;
  if ($colorType !== undefined) {
    return $colorType;
  }
  return colorType;
};

const hue = {
  primary: 160, // hsl(160, 100%, 70%) // rgb(102, 255, 204) // #66ffcc
  secondary: 0, // hsl(30, 100%, 70%) // rgb(255, 179, 102) // #ffb366
  tertiary: 247, // hsl(290, 100%, 70%) // rgb(230, 102, 255) // #e666FF #7866ff
};

const common = {
  elastic1: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
  elastic2: 'cubic-bezier(.75,-0.5,0,1.75)',
  breakpoint: {
    tablet: 1020,
    mobile: 420,
  },
  title: css`
    text-align: left;
    font-size: 6em;
    letter-spacing: 0.2em;
    color: ${(p) => p.theme.getColor};
    overflow-wrap: break-word;
    text-transform: uppercase;
    text-shadow: 2px 2px 0 ${(p) => p.theme.backgroundHighlight};
    @media (max-width: 1020px) {
      font-size: 4em;
    }
    @media (max-width: 570px) {
      font-size: 3em;
    }
  `,
  monospace: css`
    letter-spacing: 0.2em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  `,
  primaryGradient: 'linear-gradient(to right, #006666, #a5ffd4)',
  secondaryGradient: 'linear-gradient(to right, #FF4D4D,  #993D3D)',
  tertiaryGradient: 'linear-gradient(to right, #514799, #4531d5)',
  neutralGradient: 'linear-gradient(to right, #444,  #aaa)',
  // #5ba8c2
  // #8b9fcb
  // #514799
  // #997869
  // #ffffca
  // #c6eab2
  media: {
    mobile: (...args) => css`
      @media (max-width: 570px) {
        ${css(...args)};
      }
    `,
    tablet: (...args) => css`
      @media (max-width: 1020px) {
        ${css(...args)};
      }
    `,
    desktop: (...args) => css`
      @media (min-width: 1020px) {
        ${css(...args)};
      }
    `,
  },
  getColor: (p) => {
    const type = getType(p);
    if (type === 0) {
      return p.theme.primary;
    }
    if (type === 1) {
      return p.theme.secondary;
    }
    if (type === 2) {
      return p.theme.tertiary;
    }
    return '#999';
  },
  getGradient: (p) => {
    const type = getType(p);
    if (type === 0) {
      return p.theme.primaryGradient;
    }
    if (type === 1) {
      return p.theme.secondaryGradient;
    }
    if (type === 2) {
      return p.theme.tertiaryGradient;
    }
    return p.theme.neutralGradient;
  },
  motion: { stiffness: 120, damping: 20 },
  zindex: {
    logo: 100,
    menu: 50,
    content: 10,
  },
  active: '&:active { transform-origin: center; transform: scale(0.95); }',
};

export const dark = {
  ...common,
  primary: `hsl(${hue.primary}, 100%, 70%)`,
  primaryDark: `hsl(${hue.primary}, 60%, 60%)`,
  secondary: `hsl(${hue.secondary}, 100%, 70%)`,
  secondaryDark: `hsl(${hue.secondary}, 60%, 60%)`,
  tertiary: `hsl(${hue.tertiary}, 100%, 70%)`,
  tertiaryDark: `hsl(${hue.tertiary}, 100%, 60%)`,
  background: '#222',
  backgroundHighlight: '#000',
  midl: '#666',
  light: '#bbb',
  text: '#fff',
  stripes: stripesWhite,
  isLight: false,
};

export const light = {
  ...common,
  primary: `hsl(${hue.primary}, 80%, 50%)`,
  primaryDark: `hsl(${hue.primary}, 60%, 60%)`,
  secondary: `hsl(${hue.secondary}, 80%, 50%)`,
  secondaryDark: `hsl(${hue.secondary}, 60%, 60%)`,
  tertiary: `hsl(${hue.tertiary}, 80%, 50%)`,
  tertiaryDark: `hsl(${hue.tertiary}, 100%, 60%)`,
  background: '#fff',
  backgroundHighlight: '#ddd',
  midl: '#888',
  light: '#222',
  text: '#000',
  stripes,
  isLight: true,
};
