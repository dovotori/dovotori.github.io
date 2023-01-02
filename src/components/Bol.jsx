import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { ReactComponent as BolSvg } from 'Assets/svg/bol2.svg';
import { ReactComponent as BonzaiSvg } from 'Assets/svg/bonzai2.svg';
import { useEffect, useRef } from 'react';
import usePrevious from '../hooks/usePrevious';
import { timeout } from "../utils";

const GlobalStyle = createGlobalStyle`
body[theme='light'] {
  .hair {
    fill: #444;
  }   
  .mode {
    fill: #eee;
  }
}
`;

const revolution = keyframes`
0% {
  transform: none;
}
30% {
  transform: rotate3d(0, 1, 0, 15deg);
}
70% {
  transform: rotate3d(0, 1, 0, -25deg);
}
`;

const Div = styled.div`
  position:relative;
  width: 100%;
  height: 100%;

  svg {
    position:absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate3d(-50%, -50%, 0);
  }

  svg path {
    transition: opacity 100ms ease-out;
    opacity: 0;
  }

  svg path.anim {
    opacity: 1;
  }
`;

const dash = keyframes`
  to {
    stroke-dashoffset: -100;
  }
`;

const blink = keyframes`
  to {
    visibility: hidden;
  }
`;

const move = keyframes`
0%, 100% {
  transform: none;
}
35% {
  transform: translate3d(0.2%, -0.1%, 0);
}
75% {
  transform: translate3d(-0.1%, 0.2%, 0);
}
`;

const evaporate = keyframes`
0%, 100% {
  ransform: none;
}
50% {
  transform: translate3d(0, 0.2%, 0) scale(0.8);
}
`;

const hashi = keyframes`
0%, 10%, 20%, 100% {
  transform: translate3d(0, -2%, 0);
}
5%, 15% {
  transform: translate3d(0, -2%, 0) rotate(2deg);
}
`;

const hashi2 = keyframes`
0%, 10%, 20%, 100% {
  transform: translate3d(0, 2%, 0);
}
5%, 15% {
  transform: translate3d(0, 2%, 0) rotate(-2deg);
}
`;

const noding = keyframes`
0%, 100% {
  transform: none;
}
30% {
  transform: translate3d(-0.05%, 0.1%, 0);
}
75% {
  transform: translate3d(0.03%, -0.05%, 0);
}
`;

const StyledBonzai = styled(BonzaiSvg)`
  z-index: 1;

  g {
    transform-box: fill-box;
    transform-origin: center;
    animation: ${revolution} 10s linear infinite;
  }
`;

const StyledBol = styled(BolSvg)`
  z-index: 2;
  position:relative;
  .mode {
    fill: #333;
  }

  .hair {
    fill: #444;
  }

  .hashi {
    transform-origin: center;
    animation: ${hashi} 10s linear infinite;
  }

  .hashi2 {
    transform-origin: center;
    animation: ${hashi2} 10s linear infinite;
  }

  .motif {
    transform-origin: center;
    animation: ${evaporate} 10s linear infinite;
  }

  .smoke {
    stroke-dasharray: 5;
    animation: ${dash} 10s linear infinite;
  }

  .glasses {
    fill: ${(p) => p.theme.getColor};
    animation: ${blink} 4s steps(5, start) infinite;
  }

  .blinked {
    animation: ${blink} 4s steps(5, start) infinite;
  }

  .egg {
    animation: ${move} 4s linear infinite;
  }

  .roll {
    animation: ${move} 4s linear 1s infinite;
  }

  .hand {
    animation: ${move} 4s linear 1s infinite;
  }

  .face {
    animation: ${noding} 4s linear 2s infinite;
  }
`;

const Bol = ({ className, isSwitched = false }) => {
  const ref = useRef(null);
  const svgs = useRef(null);
  const previousIsSwitched = usePrevious(isSwitched);

  const animSvg = async (svg, isAppear = true) => {
    const paths = svg.querySelectorAll("path");
    for (const p of paths) {
      if (isAppear) {
        p.classList.add('anim');
      } else {
        p.classList.remove('anim');
      }
      await timeout(20);
    }
  };

  useEffect(() => {
    if (ref.current) {
      const isFirstMount = previousIsSwitched === undefined;
      svgs.current = ref.current.querySelectorAll("svg");
      const cpt = isSwitched ? 1 : 0;
      const asyncExec = async () => {
        if (!isFirstMount) {
          await animSvg(svgs.current[!isSwitched ? 1 : 0], false);
        }
        await animSvg(svgs.current[cpt]);
      };
      asyncExec();
    }
  }, [isSwitched]);

  return (<Div ref={ref} className={className}>
    <GlobalStyle />
    <StyledBol $colorType={0} />
    <StyledBonzai />
  </Div>
  );
};

export default Bol;
