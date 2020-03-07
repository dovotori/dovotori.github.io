import { keyframes } from 'styled-components';

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

export const glitchy = keyframes`
  0%   { transform: translate3d(-2px, 2px, 0); }
  25%  { transform: translate3d(-2px, -2px, 0); }
  50%  { transform: translate3d(2px, 2px, 0); }
  75%  { transform: translate3d(2px, -2px, 0); }
  100%  { transform: translate3d(-2px, 2px, 0); }
`;

export const backgroundslide = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
`;

export const loading = keyframes`
  0% { transform: translateX(0%) scaleX(0); }
  50% { transform: translateX(0%) scaleX(1); }
  100% { transform: translateX(100%) scaleX(0); }
`;
