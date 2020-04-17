import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import * as svgs from 'Assets/svg/cv2';
import { mapFromRange } from '../utils';
import ArcWithItem from './ArcWithItem';

// .test {
//       color: #3b4994;
//       color: #8c62aa;
//       color: #be64ac;
//       color: #dfb0d6;
//       color: #5698b9;
//       color: #5ac8c8;
//       color: #ace4e4;
//       color: #a5add3;
//       color: #e8e8e8;
//     }

const STROKE_WIDTH = 30;
const CENTER_WIDTH = 30;

const WIDTH = 400;
const MARGIN = 1;
const CONCENTRIC_MARGIN = 4;

const Svg = styled.svg`
  .dev path {
    stroke: ${(p) => p.theme.text};
  }

  .design path {
    stroke: ${(p) => p.theme.primary};
  }
`;

const Text = styled.text`
  text-anchor: middle;
  fill: ${(p) => p.theme.text};
`;

const StyledArcWithItem = styled(ArcWithItem)`
  stroke: #3b4994;
  stroke-width: ${STROKE_WIDTH};
`;

const Chart = ({ data }) => {
  const [curretName, setCurrentName] = useState(data.name);
  const [text, setText] = useState(data.name);

  const handleClickArc = useCallback(
    (node, parent) => (e) => {
      e.stopPropagation();
      const goBack = node.name === curretName;
      if (goBack) {
        setCurrentName(parent.name);
      } else if (node.children) {
        setCurrentName(node.name);
      }
      setText(goBack ? parent.text || parent.name : node.text || node.name);
    },
    [curretName],
  );

  const goBack = useCallback(() => {
    setCurrentName(data.name);
    setText(data.text || data.name);
  }, [data]);

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
          angle = isFirst ? parentAngle : mapFromRange(value, 0, 100, 0, parentAngle);
          newEnd = isFirst ? parentAngle : mapFromRange(value, 0, 100, 0, parentAngle);
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
            startAngle={isActive ? currentStartAngle : 360}
            depth={depth}
            image={image}
            margin={MARGIN}
            name={name}
          >
            {childHasChildren
              && drawNodes(
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
    [handleClickArc],
  );

  return (
    <Svg className="chart" viewBox={`0 0 ${WIDTH} ${WIDTH}`}>
      <g>{drawNodes(curretName, WIDTH / 2, WIDTH / 2, data)}</g>
      <Text x={WIDTH / 2} y={WIDTH / 2}>
        {text}
      </Text>
      {curretName !== data.name
      && (
      <Text x={WIDTH / 2} y={WIDTH / 2 - STROKE_WIDTH / 2} onClick={goBack}>
        BACK
      </Text>
      )}
    </Svg>
  );
};

export default Chart;
