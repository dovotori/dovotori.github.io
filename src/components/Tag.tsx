import type { CategoryId } from "src/types";
import styled from "styled-components";
import { getColorType } from "../utils";

const Wrap = styled.span<{ $colorType: number }>`
  font-size: 0.8em;
  color: ${(p) => p.theme.text};
  white-space: nowrap;
  margin: 0;
  border-bottom: solid 2px ${(p) => p.theme.getColor ?? p.theme.primary};
`;

export default ({
  className,
  label,
  category,
}: {
  className?: string;
  label: string;
  category: CategoryId;
}) => {
  const $colorType = getColorType(category);
  return (
    <Wrap className={className} $colorType={$colorType}>
      {label}
    </Wrap>
  );
};
