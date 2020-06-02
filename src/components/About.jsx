import React from "react";
import styled from "styled-components";

import { ReactComponent as Linkedin } from "Assets/svg/cv/linkedin.svg";
import { ReactComponent as Gitlab } from "Assets/svg/cv/gitlab.svg";
import { ReactComponent as QuoteIcon } from "Assets/svg/quote2.svg";
import CvContainer from "../containers/CvContainer";
import ButtonBack from "./ButtonBack";
import Button from "./Button";
import TypingMessage from "./TypingMessage";
import Bloc from "./Bloc";
import { Title } from "../themes/styled";

const Links = styled.div`
  margin: 4em 0;
  svg {
    min-width: 40px;
    width: 10%;
    margin: 0 2em 0 0;
    filter: grayscale(100%);
    transition: filter 300ms ease-out;

    &:hover {
      filter: none;
    }
  }
`;

const Wrap = styled(Bloc)`
  padding: 10% 0;
`;

const WrapContent = styled.div`
  margin: 0 auto;
  padding: 0 10px;
  max-width: 500px;
`;

const Description = styled.p`
  color: ${(p) => p.theme.light};
  width: 100%;
  line-height: 1.4;
  font-style: italic;
  margin-bottom: 1em;
`;

const MarginLeft = styled.div`
  margin: ${(p) => !p.isTouch && "0 0 0 20%"};
`;

const StyledButtonBack = styled(ButtonBack)`
  margin: ${(p) => (!p.isTouch ? "6em 0 2em" : "6em auto 2em")};
`;

const StyledButton = styled(Button)`
  margin: ${(p) => (!p.isTouch ? "6em 0 2em" : "6em auto 2em")};
`;

const StyledTypingMessage = styled(TypingMessage)`
  pointer-events: none;
  position: relative;
`;

const StyledTitle = styled(Title)`
  position: relative;
`;

const Quote = styled.div`
  position: absolute;
  color: ${(p) => p.theme.midl};
  opacity: 0.5;
  top: 0;
  left: 50%;
  display: flex;

  :hover svg {
    color: ${(p) => p.theme.primary};
  }
`;

const StyledQuoteIcon = styled(QuoteIcon)`
  margin-right: 0.1em;
`;

const About = ({ hello, isTouchDevice }) => (
  <Wrap>
    <WrapContent>
      <MarginLeft isTouch={isTouchDevice}>
        <StyledTitle colorType>
          <a href={`mailto:${process.env.MAIL}`}>
            <Quote>
              <StyledQuoteIcon />
              <StyledQuoteIcon />
            </Quote>
          </a>
          <StyledTypingMessage message={hello.about} />
        </StyledTitle>
        {hello.description.map((text) => (
          <Description>{text}</Description>
        ))}
      </MarginLeft>
      <CvContainer />
      <MarginLeft isTouch={isTouchDevice}>
        <Links>
          <a href="https://gitlab.com/dovotori">
            <Gitlab />
          </a>
          <a href="https://fr.linkedin.com/in/dorian-ratovo-636a9a95">
            <Linkedin />
          </a>
        </Links>
      </MarginLeft>
      <MarginLeft isTouch={isTouchDevice}>
        <StyledButton
          to={`mailto:${process.env.MAIL}`}
          colorType
          isTouch={isTouchDevice}
          text={hello.contact}
        />
        <StyledButtonBack colorType isTouch={isTouchDevice} />
      </MarginLeft>
    </WrapContent>
  </Wrap>
);

export default About;
