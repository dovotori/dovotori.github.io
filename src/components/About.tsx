import { ReactComponent as QuoteIcon } from "Assets/svg/quote.svg";
import styled from "styled-components";
import CvContainer from "../containers/CvContainer";
import { jiggle } from "./Animations";
import Bloc from "./Bloc";
import ButtonBack from "./ButtonBack";
import SocialLinks from "./SocialLinks";

const StyledSocialLinks = styled(SocialLinks)`
  margin: 10em 0;
  svg {
    height: 30px;
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

const MarginLeft = styled.div<{ $isTouch: boolean }>`
  margin: ${(p) => !p.$isTouch && "0 0 0 20%"};
`;

const StyledButtonBack = styled(ButtonBack)`
  margin: 12em auto 2em;
`;

const Link = styled.a<{ $isTouch: boolean }>`
  margin-top: ${(p) => (!p.$isTouch ? 0 : "10em")};
  display: flex;
  justify-content: flex-end;
`;

const Quote = styled.div`
  &:hover svg {
    animation: ${jiggle} 1s linear;
    color: ${(p) => p.theme.primaryDark};
  }
`;

const StyledQuoteIcon = styled(QuoteIcon)`
  margin-right: 0.2em;
  stroke: ${(p) => p.theme.primary};
  height: 4em;
  color: transparent;
`;

const Center = styled.div`
  text-align: center;
  margin: 4em auto;
`;

const About = ({
  description,
  isTouchDevice,
  back,
}: {
  description: string[];
  isTouchDevice: boolean;
  back: string;
}) => (
  <Wrap>
    <WrapContent>
      <MarginLeft $isTouch={isTouchDevice}>
        <Link href={`mailto:${process.env.MAIL}`} $isTouch={isTouchDevice} aria-label="Send email">
          <Quote>
            <StyledQuoteIcon />
          </Quote>
          <Quote>
            <StyledQuoteIcon />
          </Quote>
        </Link>
        {description.map((text) => (
          <Description key={text}>{text}</Description>
        ))}
      </MarginLeft>
      <CvContainer />
      <MarginLeft $isTouch={isTouchDevice}>
        <StyledSocialLinks />
      </MarginLeft>
      <MarginLeft $isTouch={isTouchDevice}>
        <Center>
          <StyledButtonBack label={back} />
        </Center>
      </MarginLeft>
    </WrapContent>
  </Wrap>
);

export default About;
