import React, { useCallback } from 'react';
import styled from 'styled-components';

import license from 'Assets/img/cclicense80x15.png';
import Toggle from './Toggle';
import availablesLang from '../constants/lang';

const Wrap = styled.div`
  padding: 10px 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  color: ${(p) => p.theme.text};
`;


const Img = styled.img`
  display: block;
  width: 80px;
  height: 14px;
`;

const Span = styled.span`
  padding: 0.4em;
  margin-left: 0.8em;
  font-size: 0.8em;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.light};
  text-transform: uppercase;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  width: 10%;
  min-width: 150px;
`;

const Button = styled.button`
  margin: 0 1em;
  padding: 0.4em;
  font-size: 0.8em;
  letter-spacing: 0.2em;
  color: ${(p) => p.theme.light};
  text-transform: uppercase;
   &:hover {
     color: ${(p) => p.theme.text};
   }
`;

const Footer = ({
  toggleTheme, isDarkMode, setLang, texts,
}) => {
  const renderLang = useCallback(() => availablesLang.map((lang) => (<Button key={lang} onClick={() => setLang(lang)}>{lang}</Button>), [availablesLang]));
  return (
    <div className="footer">
      <Wrap>
        <Div>
          {renderLang()}
        </Div>
        <Div>
          <Toggle onClick={toggleTheme} checked={isDarkMode} />
          <Span>{(isDarkMode ? texts.lightMode : texts.darkMode)}</Span>
        </Div>
        <Img
          alt="license creative common"
          src={license}
        />
      </Wrap>
    </div>
  );
};

export default Footer;
