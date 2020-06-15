import React, { useCallback } from "react";
import styled from "styled-components";

import license from "Assets/img/cclicense80x15.png";
import { ReactComponent as Mail } from "Assets/svg/mail.svg";
import Toggle from "./Toggle";
import availablesLang from "../constants/locales";

const Wrap = styled.div`
  padding: 2em 4%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  color: ${(p) => p.theme.text};
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  margin: 1em;

  a {
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
    transition: transform 300ms ease-out;
  }
  &:hover .toOpen {
    transform: rotate3d(1, 0, 0, 170deg);
  }
`;

const Img = styled.img`
  display: block;
  width: 80px;
  height: 14px;
`;

const Span = styled.span`
  padding: 0.4em;
  margin-left: 0.8em;
  color: ${(p) => p.theme.light};
  text-transform: uppercase;
  ${(p) => p.theme.monospace}
`;

const Button = styled.button`
  ${(p) => p.theme.monospace}
  margin: 0 1em;
  padding: 0.4em;
  color: ${(p) => p.theme.light};
  text-transform: uppercase;
  &:hover {
    color: ${(p) => p.theme.text};
  }
`;

const Footer = ({ toggleTheme, isDarkMode, setLang, texts }) => {
  const renderLang = useCallback(
    () =>
      availablesLang.map((lang) => (
        <Button key={lang.id} onClick={() => setLang(lang.id)}>
          {lang.short}
        </Button>
      )),
    [availablesLang]
  );
  return (
    <Wrap className="footer">
      <Div>
        <a href={`mailto:${process.env.MAIL}`}>
          <StyledMail />
        </a>
      </Div>
      <Div>{renderLang()}</Div>
      <Div>
        <a href="https://creativecommons.org/licenses/by/4.0/">
          <Img alt="license creative common" src={license} />
        </a>
      </Div>
      <Div>
        <Toggle onClick={toggleTheme} checked={isDarkMode} />
        <Span>{isDarkMode ? texts.lightMode : texts.darkMode}</Span>
      </Div>
    </Wrap>
  );
};

export default Footer;
