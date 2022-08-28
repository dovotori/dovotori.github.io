import styled, { keyframes } from 'styled-components';

import { ReactComponent as QuoteIcon } from 'Assets/svg/quote.svg';
import SocialLinks from './SocialLinks';
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

const StyledSocialLinks = styled(SocialLinks)`
  margin: 10em 0;
  svg {
    min-width: 40px;
    width: 2em;
    margin: 0 1.5em;
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
        <StyledSocialLinks />
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
