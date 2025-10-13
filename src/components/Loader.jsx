import styled from "styled-components";

import { loading, blink } from "../themes/animations";

const Div = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bars = styled.div.attrs({
  className: "loader",
})`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) rotate(45deg);
  overflow: hidden;
  opacity: 0.3;
  margin: 2em 0;
`;

const Bar = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${(p) => p.theme.getColor};
  animation: ${loading} 1s ${(p) => p.theme.elastic} infinite;
  animation-direction: alternate-reverse;
  animation-delay: ${(p) => p.delay}ms;
  transform-origin: 0 0;
`;

const Text = styled.div`
  color: ${(p) => p.theme.light};
  ${(p) => p.theme.monospace}
  text-transform: uppercase;
`;
const Blink = styled.span`
  animation: ${blink} 1s linear infinite;
  color: ${(p) => p.theme.primary};
`;

const Loader = ({ className, $colorType }) => (
  <Div className={className}>
    {/* <Bars>
      {[0, 1, 2, 3].map((idx) => (
        <Bar key={idx} delay={idx * 100} style={{ top: `${idx * 5}px` }} $colorType={$colorType} />
      ))}
    </Bars> */}
    <Text>
      <Blink>_</Blink>
      loading
    </Text>
  </Div>
);

export default Loader;
