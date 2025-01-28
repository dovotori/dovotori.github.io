import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

import Bol from './Bol';
import ProjectLabo from './ProjectLabo';
import Pulse from './Pulse';
import TypingMessage from './TypingMessage';

const fadeUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: none; opacity: 1; }
`;

const Wrap = styled.div`
  position: relative;
  margin: 22vh auto;
  display:flex;
  justify-content: center;
}
`;

const StyledTypingMessage = styled(TypingMessage)`
  display: block;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  span {
    justify-content: center;
  }
`;

const StyledLink = styled(Link)`
  position: relative;
  padding: 0;
  display: block;
  ${(p) => p.theme.active}
  text-align: center;
`;

const Appear = styled.div`
  animation: ${fadeUp} 1s 1 linear;
  transform-origin: center;
  text-align: center;
  width: 100%;
  max-width: 300px;
  height: 300px;
  margin: 0 auto;
`;

const StyledLabo = styled(ProjectLabo)`
  text-align: center;
  margin: 0 auto;
  z-index: 1;
  position: relative;
  min-height: auto;
`;

const commonName = css`
  width: 100%;
  pointer-events: none;
  user-select: none;
  ${(p) => p.isTouch && `text-align: center;`};
  ${(p) => p.theme.media.mobile`text-align: center;`};
`;

const Name = styled.h2`
  ${commonName}
  line-height: 1;
  margin: 0;
  color: #fff;
  letter-spacing: 0.1em;
  font-weight: 800;
  text-transform: lowercase;
  text-shadow: 1px 1px 0 #000;
  font-size: 2em;
`;

const Katakana = styled.h1`
  ${commonName}
  opacity: 0.1;
  color: ${(p) => p.theme.text};
  line-height: 0.7;
  position: absolute;
  font-size: ${(p) => (p.$isHome ? '11em' : '8em')};
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 1.5em;
  text-shadow: none;

  span {
    text-align: center;
  }

  ${(p) => p.theme.media.mobile`
    font-size: 800%;
  `}
`;

const common = css`
  width: 100%;
  left: auto;
  top: auto;
  max-width: none;
  text-align: center;
  position: relative;
`;

const Absolute = styled.div`
  ${(p) => p.isTouch && `${common}`}
  ${(p) => p.theme.media.mobile`
    ${common}
  `}
`;

const CenterHorizontal = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 3;
`;

const Text = styled.h4`
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 0.8em;
  line-height: 1;
  white-space: nowrap;
  color: ${(p) => p.theme.background};
  background-color: ${(p) => p.theme.text};
  font-weight: 600;
  padding: 0.2em 1em;
`;

const StyledBol = styled(Bol)`
  margin: 0 auto;
  z-index: 1;
`;

const Signature = ({ className, isTouchDevice, hello, text, isHome = true }) => {
  const [count, setCount] = useState(0);

  const add = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <Wrap>
      <Pulse className="circle" count={count} />
      <Katakana isTouch={isTouchDevice} $isHome={isHome}>
        <StyledTypingMessage message={isHome ? 'ドリアン' : 'はじめまして'} isLoop isVertical />
      </Katakana>
      <Absolute isTouch={isTouchDevice}>
        <StyledLink to={isHome ? '/about' : '/'} className={className} title="about" onClick={add}>
          <Appear>
            {isTouchDevice ? (
              <StyledBol isSwitched={!isHome} />
            ) : (
              <StyledLabo slug="picto" $colorType={0} noBackground hasJs />
            )}
          </Appear>
          <CenterHorizontal isTouch={isTouchDevice}>
            <Name isTouch={isTouchDevice}>
              <StyledTypingMessage
                message={isHome ? 'dorian' : hello}
                firstMessage="ドリアン"
                isLoop
                isCenter
              />
            </Name>
            <Text>{text}</Text>
          </CenterHorizontal>
        </StyledLink>
      </Absolute>
    </Wrap>
  );
};

export default Signature;
