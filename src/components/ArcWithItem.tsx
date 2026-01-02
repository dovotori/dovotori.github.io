import { useMemo } from "react";
import styled from "styled-components";

import { polarToCartesian } from "../utils";
import Arc from "./Arc";

const Wrap = styled.g<{ $noHoverAnim?: boolean }>`
  cursor: pointer;

  & > path {
    transform: none;
    transition:
      transform 300ms ${(p) => p.theme.elastic1},
      opacity 2s ease-out;
    transform-origin: center center;
  }

  &:hover > path {
    transform: ${(p) => (p.$noHoverAnim ? "none" : "scale(1.05)")};
  }
`;

const StyledArc = styled(Arc)<{ depth: number; visible: boolean }>`
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

const ArcWithItem = ({
  id,
  x,
  y,
  radius,
  startAngle,
  className,
  name,
  Picto,
  depth,
  strokeWidth,
  children,
  angle,
  margin,
  noHoverAnim,
  showIcon,
  onClick,
}: {
  id: string;
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  className?: string;
  name: string;
  Picto?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  depth: number;
  strokeWidth: number;
  children?: React.ReactNode;
  angle: number;
  margin: number;
  noHoverAnim?: boolean;
  showIcon?: boolean;
  onClick?: () => void;
}) => {
  const endAngle = startAngle + angle - margin;
  const imageWidth = strokeWidth * 0.7;
  const middleAngle = startAngle + angle / 2 - margin / 2;
  const imagePos = polarToCartesian(x, y, radius, middleAngle);
  const visible = useMemo(
    () => !((startAngle === 0 || startAngle === 360) && angle === 0),
    [startAngle, angle],
  );

  // compute rotation for the text so it follows the arc's tangent
  // and flip it when it's on the bottom half (between 90 and 270 degrees)
  const textRotation = (() => {
    let r = middleAngle % 360;
    if (r < 0) r += 360;
    if (r > 90 && r < 270) r += 180;
    return r;
  })();

  if (Number.isNaN(endAngle)) {
    return null;
  }

  return (
    <Wrap className={className} onClick={onClick} $noHoverAnim={noHoverAnim} data-depth={depth}>
      <StyledArc
        x={x}
        y={y}
        radius={radius}
        startAngle={startAngle}
        endAngle={endAngle}
        depth={depth}
        visible={visible}
      />
      {(showIcon || (visible && depth <= 2)) && (
        <G>
          {Picto ? (
            <Picto
              className="picto"
              x={imagePos.x - imageWidth / 2}
              y={imagePos.y - imageWidth / 2}
              height={imageWidth}
              width={imageWidth}
              name={id}
            />
          ) : (
            <TextArc
              x={imagePos.x}
              y={imagePos.y}
              transform={`rotate(${textRotation} ${imagePos.x} ${imagePos.y})`}
              dominantBaseline="middle"
            >
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
