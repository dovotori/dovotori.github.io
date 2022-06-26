import { useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

import Bol from './Bol';
import ProjectLabo from './ProjectLabo';
import TypingMessage from './TypingMessage';
import Pulse from './Pulse';

const fadeUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: none; opacity: 1; }
`;

const Wrap = styled.div`
  position: relative;
  margin: 20vh auto 0;
}
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
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
`;

const Appear = styled.div`
  animation: ${fadeUp} 1s 1 linear;
  transform-origin: center;
  text-align: center;
`;

const StyledLabo = styled(ProjectLabo)`
  text-align: center;
  margin: 0 auto;
  width: 320px;
  height: 320px;
  z-index: 1;
  position: relative;
  min-height: auto;
`;

const commonName = css`
  width: 100%;
  text-align: left;
  pointer-events: none;
  user-select: none;
  ${(p) => p.isTouch && `text-align: center;`};
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

const common = css`
  transform: none;
  width: 100%;
  left: auto;
  top: auto;
  max-width: none;
  text-align: center;
  position: relative;
  margin-bottom: 10em;
`;

const Absolute = styled.div`
  position: absolute;
  top: 45%;
  left: calc(50% + 100px);
  z-index: 2;

  ${(p) => p.isTouch && `${common}`}
  ${(p) => p.theme.media.mobile`
    ${common}
  `}
`;

const StyledBol = styled(Bol)`
  margin: 0 auto;
  width: 80%;
  display: block;
  position: relative;
  z-index: 1;
`;

const Signature = ({ className, isTouchDevice, hello, isHome = true }) => {
  const [count, setCount] = useState(0);

  const add = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <Wrap>
      <Appear>
        <StyledLink to={isHome ? '/about' : '/'} className={className} title="about" onClick={add}>
          {isTouchDevice ? (
            <StyledBol />

          ) : (
            <StyledLabo slug="picto" $colorType={0} noBackground hasJs />
          )}
          <Pulse className="circle" count={count} />
        </StyledLink>
      </Appear>
      <Absolute isTouch={isTouchDevice}>
        <Name isTouch={isTouchDevice}>
          <StyledTypingMessage
            message={isHome ? 'dorian' : hello}
            firstMessage="ドリアン"
            width="1em"
            isLoop
            delay={5000}
          />
        </Name>

        <Katakana isTouch={isTouchDevice}>
          <StyledTypingMessage
            message={isHome ? 'ドリアン' : 'はじめまして'}
            width="1.5em"
            isLoop
            delay={5000}
          />
        </Katakana>
      </Absolute>
    </Wrap>
  );
};

export default Signature;
