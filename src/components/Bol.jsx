import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { ReactComponent as BolSvg } from 'Assets/svg/bol.svg';

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
    transform: none;
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

const StyledBol = styled(BolSvg)`
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
`;

const Bol = ({ className }) => (<>
  <GlobalStyle />
  <StyledBol className={className} $colorType={0} />
</>
);

export default Bol;
