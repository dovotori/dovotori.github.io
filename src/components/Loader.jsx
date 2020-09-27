import React from 'react';
import styled from 'styled-components';

import { loading, blink } from '../themes/animations';

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

const Text = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  color: ${(p) => p.theme.text};
  ${(p) => p.theme.monospace}
  font-size: 0.6em;
`;
const Blink = styled.span`
  animation: ${blink} 1s linear infinite;
`;

const Loader = ({ className, $colorType }) => (
  <div className={className}>
    <Wrap>
      {[0, 1, 2, 3].map((idx) => (
        <Bar key={idx} delay={idx * 100} style={{ top: `${idx * 5}px` }} $colorType={$colorType} />
      ))}
    </Wrap>
    <Text>
      <Blink>_</Blink>
      loading
    </Text>
  </div>
);

export default Loader;
