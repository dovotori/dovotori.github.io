import React, { useCallback } from 'react';
import styled from 'styled-components';

import license from 'Assets/img/cclicense80x15.png';
import { ReactComponent as Mail } from 'Assets/svg/mail.svg';
import ToggleMode from './ToggleMode';
import availablesLang from '../constants/locales';

const Wrap = styled.div`
  padding: 2em 4%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  color: ${(p) => p.theme.text};
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  margin: 1em;

  a {
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 300ms ease-out;
  }
  a:hover {
    opacity: 1;
  }
`;

const StyledMail = styled(Mail)`
  color: ${(p) => p.theme.light};
  height: 20px;
  .toOpen {
    transition: transform 300ms ease-out, color 300ms ease-out;
  }
  &:hover .toOpen {
    transform: rotate3d(1, 0, 0, 170deg);
  }
  &:hover {
    color: ${(p) => p.theme.primary};
  }
`;

const Img = styled.img`
  display: block;
  width: 80px;
  height: 14px;
  margin: 0 0.4em;
`;

const Button = styled.button`
  position: relative;
  padding: 0.4em;
  margin: 0 0.4em;
  text-transform: uppercase;
  text-align: center;
  min-width: 120px;
  ${(p) => p.theme.monospace}
  font-weight: normal;
  color: ${(p) => p.theme.light};
  &:hover {
    color: ${(p) => p.theme.text};
    .line {
      transform: none;
    }
  }
`;

const Line = styled.span`
  display: inline-block;
  position: absolute;
  bottom: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: ${(p) => p.theme.primary};
  z-index: 0;
  transition: transform 300ms ease-out;
  transform: ${(p) => (p.isHighlight ? 'none' : 'scale(0.01)')};
`;

const SimpleSpan = styled.span`
  position: relative;
  z-index: 1;
  transition: background-color 0.2s ease-out;
  background-color: ${(p) => p.theme.background};
  padding: 0 0 0 0.4em;
`;

const Footer = ({ toggleTheme, isDarkMode, setLang, texts, lang }) => {
  const renderLang = useCallback(
    () =>
      availablesLang.map((availableLang) => (
        <Button key={availableLang.id} onClick={() => setLang(availableLang.id)}>
          <SimpleSpan>{availableLang.short}</SimpleSpan>
          <Line isHighlight={availableLang.id === lang} className="line" />
        </Button>
      )),
    [availablesLang, lang]
  );
  return (
    <Wrap className="footer">
      <Div>
        <a href={`mailto:${process.env.MAIL}`} title="contact">
          <StyledMail />
        </a>
      </Div>
      <Div>{renderLang()}</Div>
      <Div>
        <a href="https://creativecommons.org/licenses/by/4.0/" title="license">
          <Img alt="license creative common" src={license} />
        </a>
      </Div>
      <Div>
        <ToggleMode isDarkMode={isDarkMode} texts={texts} toggleTheme={toggleTheme} />
      </Div>
    </Wrap>
  );
};

export default Footer;
