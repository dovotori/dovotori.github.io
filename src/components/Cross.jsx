import styled from "styled-components";

import { ReactComponent as CrossSvg } from "Assets/svg/cross.svg";

export default styled(CrossSvg)`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${(p) => p.theme.getColor};
  fill: none;
`;
