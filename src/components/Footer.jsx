import React from 'react';
import styled from 'styled-components';

import license from 'Assets/img/CClicense80x15.png';
import Toggle from './Toggle';


const Wrap = styled.div`
  padding: 10px 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  text-align: right;
  color: ${(p) => p.theme.text};
`;


const Img = styled.img`
  display: block;
  width: 80px;
  height: 14px;
`;

const Span = styled.span`
  margin-left: 6px;
  letter-spacing: 0.04em;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  width: 10%;
  min-width: 150px;
`;

const Footer = ({ toggleTheme, isDarkMode }) => (
  <div className="footer">
    <Wrap>
      <Div>
        <Toggle onClick={toggleTheme} checked={isDarkMode} />
        <Span>{isDarkMode ? 'Light' : 'Dark'}</Span>
      </Div>
      <Img
        alt="license creative common"
        src={license}
      />
    </Wrap>
  </div>
);

export default Footer;
