import styled from "styled-components";

import { blink } from "../themes/animations";

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

const Text = styled.div`
  color: ${(p) => p.theme.light};
  ${(p) => p.theme.monospace}
  text-transform: uppercase;
`;
const Blink = styled.span`
  animation: ${blink} 1s linear infinite;
  color: ${(p) => p.theme.primary};
`;

const Loader = ({ className }) => (
  <Div className={className}>
    <Text>
      <Blink>_</Blink>
      loading
    </Text>
  </Div>
);

export default Loader;
