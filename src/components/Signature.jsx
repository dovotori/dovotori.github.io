import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Canvas from './Canvas';

const StyledLink = styled(Link)`
  position: relative;
  padding: 0;
  display: block;
  cursor: crosshair;
  ${(p) => p.theme.active}
`;

const StyledCanvas = styled(Canvas)`
  margin: 10vh auto 0;
  text-align: center;

  canvas {
    margin: 0 auto;
    width: 20vh;
    height: 20vh;
    max-width: 512px;
    max-height: 512px;
  }
`;

const Signature = (className) => (
  <StyledLink to="/about" className={className}>
    <StyledCanvas slug="webgl" width={512} height={512} colorType={0} />
  </StyledLink>
);

export default Signature;
