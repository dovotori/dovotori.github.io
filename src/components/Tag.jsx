import styled from "styled-components";
import { getColorType } from "../utils";

// import Logotype from './Logotype'

const Wrap = styled.span`
  font-size: 0.8em;
  color: ${(p) => p.theme.text};
  white-space: nowrap;
  margin: 0;
  border-bottom: solid 2px ${(p) => p.theme.getColor ?? p.theme.primary};
`;

// const StyledLogotype = styled(Logotype)`
//   display: inline-block;
//   width: 10px;
//   filter: grayscale(100%);
//   margin-right: 5px;
// `

export default ({ className, label, category, picto, hidePicto = true }) => {
  const $colorType = getColorType(category);
  return (
    <Wrap className={className} $colorType={$colorType}>
      {/* {picto && !hidePicto ? <StyledLogotype name={picto} /> : null} */}
      {label}
    </Wrap>
  );
};
