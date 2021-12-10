import styled from 'styled-components';

import { ReactComponent as Linkedin } from 'Assets/svg/cv/linkedin.svg';
import { ReactComponent as Gitlab } from 'Assets/svg/cv/gitlab.svg';
import { ReactComponent as QuoteIcon } from 'Assets/svg/quote.svg';

import { ReactComponent as Mail } from 'Assets/svg/mail.svg';
import CvContainer from '../containers/CvContainer';
import ButtonBack from './ButtonBack';
import TypingMessage from './TypingMessage';
import Bloc from './Bloc';
import CrossSvg from './Cross';
import { jiggle } from './Animations';

const Links = styled.div`
  margin: 4em 0;
  text-align: center;
  svg {
    min-width: 40px;
    width: 10%;
    margin: 0 1em;
    filter: grayscale(100%);
    transition: filter 300ms ease-out;

    &:hover {
      filter: none;
    }
  }
`;

const Wrap = styled(Bloc)`
  padding: 20% 0 10%;
`;

const WrapContent = styled.div`
  margin: 0 auto;
  padding: 0 1.5em;
  max-width: 700px;
`;

const Description = styled.p`
  color: ${(p) => p.theme.light};
  width: 100%;
  font-style: italic;
  margin-bottom: 1em;
`;

const MarginLeft = styled.div`
  margin: ${(p) => !p.isTouch && '0 0 0 20%'};
`;

const StyledButtonBack = styled(ButtonBack)`
  margin: 12em auto 2em;
`;

const StyledTypingMessage = styled(TypingMessage)`
  pointer-events: none;
  position: relative;
`;

const StyledTitle = styled.h3`
  ${(p) => p.theme.title}
  position: relative;
  font-size: 4em;
  margin-top: ${(p) => (!p.isTouch ? 0 : '1.5em')};
  margin-bottom: 0;
  line-height: 1;
`;

const Quote = styled.div`
  display: flex;
  position: absolute;
  color: transparent;
  bottom: 2px;
  top: -0.5em;
  right: 0;
  max-width: 50%;
  :hover {
    animation: ${jiggle} 1s linear;
  }

  :hover svg {
    color: ${(p) => p.theme.primaryDark};
  }
`;

const StyledQuoteIcon = styled(QuoteIcon)`
  margin-right: 0.2em;
  stroke: ${(p) => p.theme.primary};
  height: 1em;
`;

const Center = styled.div`
  text-align: center;
  margin: 4em auto;
`;

const StyledMail = styled(Mail)`
  color: ${(p) => p.theme.light};
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

const Bar = styled.div`
  width: 25%;
  height: 1px;
  margin: 1em auto 2em;
  background: ${(p) => p.theme.getGradient};
`;

const Cross = styled(CrossSvg)`
  margin: 0 auto;
`;

const About = ({ hello, isTouchDevice }) => (
  <Wrap>
    <WrapContent>
      <MarginLeft isTouch={isTouchDevice}>
        <StyledTitle $colorType isTouch={isTouchDevice}>
          <a href={`mailto:${process.env.MAIL}`}>
            <Quote>
              <StyledQuoteIcon />
              <StyledQuoteIcon />
            </Quote>
          </a>
          <StyledTypingMessage message={hello.about} firstMessage="はじめまして" />
        </StyledTitle>
        <Bar />
        {hello.description.map((text) => (
          <Description key={text}>{text}</Description>
        ))}
        <Center>
          <Cross />
        </Center>
      </MarginLeft>
      <CvContainer />
      <MarginLeft isTouch={isTouchDevice}>
        <Center>
          <Cross />
        </Center>
        <Links>
          <a href="https://gitlab.com/dovotori">
            <Gitlab />
          </a>
          <a href="https://fr.linkedin.com/in/dorian-ratovo-636a9a95">
            <Linkedin />
          </a>
          <a href={`mailto:${process.env.MAIL}`} title="contact">
            <StyledMail />
          </a>
        </Links>
        <Bar />
      </MarginLeft>
      <MarginLeft isTouch={isTouchDevice}>
        <Center>
          <StyledButtonBack $colorType isTouch={isTouchDevice} />
        </Center>
      </MarginLeft>
    </WrapContent>
  </Wrap>
);

export default About;
