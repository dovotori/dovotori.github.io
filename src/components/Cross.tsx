import { ReactComponent as CrossSvg } from "Assets/svg/cross.svg";
import styled from "styled-components";

export default styled(CrossSvg)<{ $colorType?: number }>`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${(p) => p.theme.getColor};
  fill: none;
`;
