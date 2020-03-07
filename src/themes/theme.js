import { css } from 'styled-components';

const hue = {
  primary: 160, // hsl(160, 100%, 70%) // rgb(102, 255, 204) // #66ffcc
  secondary: 30, // hsl(30, 100%, 70%) // rgb(255, 179, 102) // #ffb366
  tertiary: 290, // hsl(290, 100%, 70%) // rgb(230, 102, 255) // #e666FF
};

export default {
  primary: `hsl(${hue.primary}, 100%, 70%)`,
  primaryDark: `hsl(${hue.primary}, 60%, 60%)`,
  primaryGradient: 'linear-gradient(to right, #006666, #66ffcc)',
  secondary: `hsl(${hue.secondary}, 100%, 70%)`,
  secondaryDark: `hsl(${hue.secondary}, 60%, 60%)`,
  secondaryGradient: 'linear-gradient(to right, #660000, #ffb366)',
  tertiary: `hsl(${hue.tertiary}, 100%, 70%)`,
  tertiaryDark: `hsl(${hue.tertiary}, 100%, 70%)`,
  tertiaryGradient: 'linear-gradient(to right, #330033,  #990066)',
  elastic1: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
  elastic2: 'cubic-bezier(.75,-0.5,0,1.75)',
  dark: '#222',
  darker: '#111',
  midl: '#666',
  light: '#bbb',
  breakpoint: {
    mobile: 420,
    tablet: 1020,
  },
  monospace: css`
    font-size: 0.7em;
    line-height: 1.6em;
    letter-spacing: 0.4em;
    font-family: monospace;
  `,
  media: {
    mobile: (...args) => css`
        @media (max-width: 420px) {
          ${css(...args)};
        }
      `,
    tablet: (...args) => css`
        @media (max-width: 1020px) {
          ${css(...args)};
        }
      `,
  },
  getColor: (p) => {
    if (p.colorType === 1) {
      return p.theme.secondary;
    } if (p.colorType === 2) {
      return p.theme.tertiary;
    }
    return p.theme.primary;
  },
  getGradient: (p) => {
    if (p.colorType === 1) {
      return p.theme.secondaryGradient;
    } if (p.colorType === 2) {
      return p.theme.tertiaryGradient;
    }
    return p.theme.primaryGradient;
  },
  motion: { stiffness: 120, damping: 20 },
  zindex: {
    logo: 100,
    menu: 50,
    content: 10,
  },
  active: '&:active { transform-origin: center; transform: scale(0.95); }',
};
