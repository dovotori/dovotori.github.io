import svgs from "Assets/svg/cv";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { mapFromRange } from "../utils";
import ArcWithItem from "./ArcWithItem";

const STROKE_WIDTH = 30;
const CENTER_WIDTH = 30;

const WIDTH = 400;
const MARGIN = 1;
const CONCENTRIC_MARGIN = 4;

const Svg = styled.svg`
  margin-top: -5em;

  .frontend path {
    stroke: ${(p) => p.theme.text};
  }

  .backend path {
    stroke: ${(p) => p.theme.midl};
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
`;

const StyledArcWithItem = styled(ArcWithItem)`
  stroke: #3b4994;
  stroke-width: ${STROKE_WIDTH};
`;

const Chart = ({ className, data, showAllIcons = false }) => {
  const [currentId, setCurrentId] = useState(data.id);

  const handleClickArc = useCallback(
    (node, parent) => (e) => {
      e.stopPropagation();
      const goBack = node.id === currentId;
      if (goBack) {
        setCurrentId(parent.id);
      } else if (node.children) {
        setCurrentId(node.id);
      }
    },
    [currentId],
  );

  const drawNodes = useCallback(
    (current, x, y, node, depth = 1, parentStart = 0, parentAngle = 360) => {
      let currentStartAngle = parentStart;
      const radius = CENTER_WIDTH + depth * (STROKE_WIDTH + CONCENTRIC_MARGIN);
      return node.children
        .filter((child) => child.id !== undefined)
        .map((child) => {
          const { value, id, label } = child;
          const isActive = current === data.id || current === id;
          let angle = 0;
          let newEnd = parentAngle;
          let image = null;
          let newDepth = depth;
          let nextCurrent = current;
          const childHasChildren = !!child.children;
          if (isActive) {
            const isFirst = current !== data.id && depth === 1;
            angle = isFirst ? parentAngle : mapFromRange(value, 0, 100, 0, parentAngle);
            newEnd = isFirst ? parentAngle : mapFromRange(value, 0, 100, 0, parentAngle);
            image = svgs[id] || null;
            newDepth = depth + 1;
            nextCurrent = data.id;
          }
          const returnValue = (
            <StyledArcWithItem
              key={id}
              angle={angle}
              className={id}
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
              name={label}
              showIcon={showAllIcons}
            >
              {childHasChildren &&
                drawNodes(nextCurrent, x, y, child, newDepth, currentStartAngle, newEnd)}
            </StyledArcWithItem>
          );
          currentStartAngle += angle;
          return returnValue;
        });
    },
    [handleClickArc, showAllIcons, data.id],
  );

  return (
    <Svg className={`${className} chart`} viewBox={`0 0 ${WIDTH} ${WIDTH}`}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor="#fff" result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g>{drawNodes(currentId, WIDTH / 2, WIDTH / 2, data)}</g>
    </Svg>
  );
};

export default Chart;
