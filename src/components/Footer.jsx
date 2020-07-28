import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import license from 'Assets/img/cclicense80x15.png';
import { ReactComponent as Mail } from 'Assets/svg/mail.svg';
import Toggle from './Toggle';
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
  margin-top: -5px;
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
`;

const commonItem = css`
  position: relative;
  padding: 0.4em;
  margin: 0 1em;
  text-transform: uppercase;
  text-align: center;
  min-width: 70px;
  ${(p) => p.theme.monospace}
  font-weight: normal;
`;

const Span = styled.span`
  ${commonItem}
  color: ${(p) => (p.isHighlight ? p.theme.primary : p.theme.light)};
`;

const Button = styled.button`
  ${commonItem}
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
  transform: ${(p) => (p.isHighlight ? 'none' : 'scale(0)')};
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
      availablesLang.map((availableLang) =>
        availableLang.id === lang ? (
          <Span key={availableLang.id} isHighlight>
            <SimpleSpan>{availableLang.short}</SimpleSpan>
            <Line isHighlight className="line" />
          </Span>
        ) : (
          <Button key={availableLang.id} onClick={() => setLang(availableLang.id)}>
            <SimpleSpan>{availableLang.short}</SimpleSpan>
            <Line className="line" />
          </Button>
        )
      ),
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
        <Toggle id="themeMode" onClick={toggleTheme} checked={isDarkMode} />
        <Span>{isDarkMode ? texts.lightMode : texts.darkMode}</Span>
      </Div>
    </Wrap>
  );
};

export default Footer;
