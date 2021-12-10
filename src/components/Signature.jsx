import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

import ProjectLabo from './ProjectLabo';
import TypingMessage from './TypingMessage';

const fadeUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: none; opacity: 1; }
`;

const StyledTypingMessage = styled(TypingMessage)`
  span {
    justify-content: left;
  }
`;

const StyledLink = styled(Link)`
  position: relative;
  padding: 0;
  display: block;
  ${(p) => p.theme.active}
  text-align: center;
`;

const Wrap = styled.div`
  position: relative;
`;

const Appear = styled.div`
  animation: ${fadeUp} 1s 1 linear;
  transform-origin: center;
`;

const StyledLabo = styled(ProjectLabo)`
  text-align: center;
  margin: 0 auto;
  width: 320px;
  height: 320px;
`;

const commonName = css`
  width: 100%;
  text-align: left;
  pointer-events: none;
  user-select: none;

  ${(p) => p.theme.media.mobile`text-align: center;`};
`;

const Name = styled.h2`
  ${commonName}
  letter-spacing: 0.1em;
  line-height: 1;
  margin: 0;
  color: ${(p) => p.theme.primary};
`;

const Katakana = styled.h1`
  ${commonName}
  margin-top: -0.2em;
  color: ${(p) => p.theme.text};
  ${(p) => p.theme.media.mobile`
    font-size: 200%;
  `}
`;

const Absolute = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate3d(40%, 0, 0);

  ${(p) => p.theme.media.mobile`
    transform: none;
    width: 100%;
    left: auto;
    top: auto;
    max-width: none;
    text-align:center;
    position: relative;
  `}
`;

const Signature = ({ className }) => (
  <Wrap>
    <Appear>
      <StyledLink to="/about" className={className} title="about">
        <StyledLabo slug="picto" $colorType={0} noBackground hasJs />
      </StyledLink>
    </Appear>

    <Absolute>
      <Name>
        <StyledTypingMessage
          message="dorian"
          firstMessage="ドリアン"
          width="0.9em"
          isLoop
          delay={5000}
        />
      </Name>

      <Katakana>
        <StyledTypingMessage message="ドリアン" width="2em" isLoop delay={5000} />
      </Katakana>
    </Absolute>
  </Wrap>
);

export default Signature;
