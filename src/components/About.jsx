import React from 'react';
import styled from 'styled-components';
import Linkedin from 'Assets/svg/linkedin.svg';
import Gitlab from 'Assets/svg/gitlab.svg';
import CvContainer from '../containers/CvContainer';
import ButtonBack from './ButtonBack';
import TypingMessage from './TypingMessage';

import Bloc from './Bloc';
import { Title } from '../themes/styled';

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
`;

const MarginLeft = styled.div`
  margin: ${(p) => !p.isTouch && '0 0 0 20%'};
`;

const StyledButtonBack = styled(ButtonBack)`
  margin: ${(p) => (!p.isTouch ? '6em 0 2em' : '6em auto 2em')};
`;

const StyledTypingMessage = styled(TypingMessage)`
  pointer-events: none;
  position: relative;
`;

const StyledTitle = styled(Title)`
  position: relative;
`;

const Quote = styled.p`
  position: absolute;
  font-size: 10em;
  line-height: 0.6;
  color: ${(p) => p.theme.midl};
  text-shadow: none;
  opacity: 0.5;
  top: 0;
  left: 50%;

  :hover {
    color: ${(p) => p.theme.primary};
  }
`;

const About = ({ hello, isTouchDevice }) => (
  <Wrap>
    <WrapContent>
      <MarginLeft isTouch={isTouchDevice}>
        <StyledTitle colorType>
          <a href="mailto:dorian.r@openmailbox.org">
            <Quote>&rdquo;</Quote>
          </a>
          <StyledTypingMessage message={hello.title} />
        </StyledTitle>
        <Description>{hello.text}</Description>
        <Links>
          <a href="https://gitlab.com/dovotori">
            <Gitlab />
          </a>
          <a href="https://fr.linkedin.com/in/dorian-ratovo-636a9a95">
            <Linkedin />
          </a>
        </Links>
      </MarginLeft>
      <CvContainer />

      <MarginLeft isTouch={isTouchDevice}>
        <StyledButtonBack colorType isTouch={isTouchDevice} />
      </MarginLeft>
    </WrapContent>
  </Wrap>
);

export default About;
