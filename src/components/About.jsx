import styled, { keyframes } from 'styled-components';

import { ReactComponent as Linkedin } from 'Assets/svg/cv/linkedin.svg';
import { ReactComponent as Gitlab } from 'Assets/svg/cv/gitlab.svg';
import { ReactComponent as QuoteIcon } from 'Assets/svg/quote.svg';

import { ReactComponent as Mail } from 'Assets/svg/mail.svg';
import CvContainer from '../containers/CvContainer';
import ButtonBack from './ButtonBack';
import Bloc from './Bloc';
import { jiggle } from './Animations';

export const move = keyframes`
  0% {
    transform: scale(0.9,1);
  }
  25% {
    transform: scale(0.7,1);
  }
  50% {
    transform: scale(0.8,1);
  }
  75% {
    transform: scale(0.7,1);
  }
  100% {
    transform: none;
  }
}
`;

const Links = styled.div`
  margin: 10em 0;
  text-align: center;
  svg {
    min-width: 40px;
    width: 2em;
    margin: 0 2em;
    filter: grayscale(100%);
    transition: filter 300ms ease-out;

    &:hover {
      filter: none;
    }
  }
`;

const Wrap = styled(Bloc)`
  margin: 0 auto 20vh;
`;

const WrapContent = styled.div`
  margin: 0 auto;
  padding: 0 1.5em;
  max-width: 700px;
  ${(p) => p.theme.media.tablet`max-width: 500px;`};
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

const Link = styled.a`
  margin-top: ${(p) => (!p.isTouch ? 0 : '10em')};
  display: flex;
  justify-content: flex-end;
`;

const Quote = styled.div`
  :hover {
    animation: ${jiggle} 1s linear;
  }

  svg {
    color: transparent;
  }

  :hover svg {
    color: ${(p) => p.theme.primaryDark};
  }
`;

const StyledQuoteIcon = styled(QuoteIcon)`
  margin-right: 0.2em;
  stroke: ${(p) => p.theme.primary};
  height: 4em;
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
  width: 50%;
  height: 1px;
  margin: 2em 0;
  background: ${(p) => p.theme.getGradient};
  transform-origin: left center;
  animation: ${move} 6s ${(p) => p.theme.elastic} alternate-reverse infinite;
`;

const About = ({ hello, isTouchDevice }) => (
  <Wrap>
    <WrapContent>
      <MarginLeft isTouch={isTouchDevice}>
        <Link href={`mailto:${process.env.MAIL}`} isTouch={isTouchDevice}>
          <Quote>
            <StyledQuoteIcon />
            <StyledQuoteIcon />
          </Quote>
        </Link>
        {hello.description.map((text) => (
          <Description key={text}>{text}</Description>
        ))}
        <Bar />
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
          <a href={`mailto:${process.env.MAIL}`} title="contact">
            <StyledMail />
          </a>
        </Links>
      </MarginLeft>
      <MarginLeft isTouch={isTouchDevice}>
        <Center>
          <StyledButtonBack isTouch={isTouchDevice} />
        </Center>
      </MarginLeft>
    </WrapContent>
  </Wrap>
);

export default About;
