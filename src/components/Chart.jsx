import { useCallback, useState } from "react";
import styled from "styled-components";

import * as svgs from "Assets/svg/cv2";
import { mapFromRange } from "../utils";
import ArcWithItem from "./ArcWithItem";

const STROKE_WIDTH = 30;
const CENTER_WIDTH = 30;

const WIDTH = 400;
const MARGIN = 1;
const CONCENTRIC_MARGIN = 4;

const Svg = styled.svg`
  margin-top: -5em;

  .dev path {
    stroke: ${(p) => p.theme.text};
  }

  .design path {
    stroke: ${(p) => p.theme.primary};
  }
  .picto path,
  .picto polygon,
  .picto circle {
    stroke: none;
    fill: ${(p) => p.theme.background};
  }
  text {
    font-size: 0.7em;
  }
`;

const StyledArcWithItem = styled(ArcWithItem)`
  stroke: #3b4994;
  stroke-width: ${STROKE_WIDTH};
`;

const Chart = ({ className, data, showAllIcons = false }) => {
  const [curretName, setCurrentName] = useState(data.name);

  const handleClickArc = useCallback(
    (node, parent) => (e) => {
      e.stopPropagation();
      const goBack = node.name === curretName;
      if (goBack) {
        setCurrentName(parent.name);
      } else if (node.children) {
        setCurrentName(node.name);
      }
    },
    [curretName],
  );

  const drawNodes = useCallback(
    (current, x, y, node, depth = 1, parentStart = 0, parentAngle = 360) => {
      let currentStartAngle = parentStart;
      const radius = CENTER_WIDTH + depth * (STROKE_WIDTH + CONCENTRIC_MARGIN);
      return node.children.map((child) => {
        const { value, name } = child;
        const isActive = current === data.name || current === name;
        let angle = 0;
        let newEnd = parentAngle;
        let image = null;
        let newDepth = depth;
        let nextCurrent = current;
        const childHasChildren = !!child.children;
        if (isActive) {
          const isFirst = current !== data.name && depth === 1;
          angle = isFirst
            ? parentAngle
            : mapFromRange(value, 0, 100, 0, parentAngle);
          newEnd = isFirst
            ? parentAngle
            : mapFromRange(value, 0, 100, 0, parentAngle);
          image = svgs[name] || null;
          newDepth = depth + 1;
          nextCurrent = data.name;
        }
        const returnValue = (
          <StyledArcWithItem
            key={name}
            angle={angle}
            className={name}
            noHoverAnim={!childHasChildren}
            onClick={handleClickArc(child, node)}
            x={x}
            y={y}
            strokeWidth={STROKE_WIDTH}
            radius={radius}
            startAngle={currentStartAngle}
            depth={depth}
            Picto={image}
            margin={MARGIN}
            name={name}
            showIcon={showAllIcons}
          >
            {childHasChildren &&
              drawNodes(
                nextCurrent,
                x,
                y,
                child,
                newDepth,
                currentStartAngle,
                newEnd,
              )}
          </StyledArcWithItem>
        );
        currentStartAngle += angle;
        return returnValue;
      });
    },
    [handleClickArc, showAllIcons],
  );

  return (
    <Svg className={`${className} chart`} viewBox={`0 0 ${WIDTH} ${WIDTH}`}>
      <g>{drawNodes(curretName, WIDTH / 2, WIDTH / 2, data)}</g>
    </Svg>
  );
};

export default Chart;
