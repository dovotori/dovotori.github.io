import React from 'react';
import styled from 'styled-components';

import { loading } from '../themes/animations';

const Wrap = styled.div.attrs({
  className: 'loader',
})`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) rotate(45deg);
  overflow: hidden;
  opacity: 0.3;
`;

const Bar = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${(p) => p.theme.getColor};
  animation: ${loading} 1s ${(p) => p.theme.elastic} infinite;
  animation-direction: alternate-reverse;
  animation-delay: ${(p) => p.delay}ms;
  transform-origin: 0 0;
`;

const Loader = ({ className, colorType }) => (
  <Wrap className={className}>
    {[0, 1, 2, 3].map((idx) => (
      <Bar
        key={idx}
        delay={idx * 100}
        style={{ top: `${idx * 5}px` }}
        colorType={colorType}
      />
    ))}
  </Wrap>
);

export default Loader;
