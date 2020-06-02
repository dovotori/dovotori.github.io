import React, { useMemo } from "react";
import styled from "styled-components";

import { polarToCartesian } from "../utils";
import Arc from "./Arc";

const Wrap = styled.g`
  cursor: pointer;

  & > path {
    transform: none;
    transition: transform 300ms ease-out, opacity 2s ease-out;
    transform-origin: center center;
  }

  &:hover > path {
    transform: ${(p) => (p.noHoverAnim ? "none" : "scale(1.05)")};
  }
`;

const StyledArc = styled(Arc)`
  opacity: ${(p) => {
    if (!p.visible) return 0;
    switch (p.depth) {
      case 2:
        return 0.9;
      case 3:
        return 0.8;
      case 4:
        return 0.7;
      default:
        return 1;
    }
  }};
`;

const G = styled.g``;

const TextArc = styled.text`
  text-anchor: middle;
  fill: ${(p) => p.theme.background};
  font-size: 0.5em;
  stroke: none;
`;

const Picto = styled.image`
  filter: invert(${(p) => (p.theme.isLight ? 100 : 0)}%);
`;

const ArcWithItem = ({
  x,
  y,
  radius,
  startAngle,
  className,
  name,
  image,
  depth,
  strokeWidth,
  children,
  onClick,
  angle,
  margin,
  noHoverAnim,
}) => {
  const endAngle = startAngle + angle - margin;
  const imageWidth = strokeWidth * 0.7;
  const middleAngle = startAngle + angle / 2 - margin / 2;
  const imagePos = polarToCartesian(x, y, radius, middleAngle);
  const visible = useMemo(
    () => !((startAngle === 0 || startAngle === 360) && angle === 0),
    [startAngle, angle]
  );

  return (
    <Wrap className={className} onClick={onClick} noHoverAnim={noHoverAnim}>
      <StyledArc
        x={x}
        y={y}
        radius={radius}
        startAngle={startAngle}
        endAngle={endAngle}
        depth={depth}
        visible={visible}
      />
      {visible && depth <= 2 && (
        <G>
          {image ? (
            <Picto
              href={image}
              x={imagePos.x - imageWidth / 2}
              y={imagePos.y - imageWidth / 2}
              height={imageWidth}
              width={imageWidth}
            />
          ) : (
            <TextArc x={imagePos.x} y={imagePos.y}>
              {name}
            </TextArc>
          )}
        </G>
      )}
      {children}
    </Wrap>
  );
};

export default ArcWithItem;
