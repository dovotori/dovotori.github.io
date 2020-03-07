import React from 'react';
import styled from 'styled-components';

const Border = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: ${(p) => p.theme.secondaryGradient};
  z-index: 11;
`;

const Wrap = styled.div`
  padding: 10px 4%;
  background: ${(p) => p.theme.secondaryGradient};
`;

const P = styled.p`
  font-size: 0.7em;
  text-align: right;
  color: ${(p) => p.theme.dark};
`;

const IMG = styled.img`
  display: block;
`;

const Footer = () => (
  <div className="footer">
    <Wrap>
      <P>
        <IMG
          alt="license creative common"
          src="Assets/app/CClicense80x15.png"
        />
      </P>
    </Wrap>
    <Border />
  </div>
);

export default Footer;
