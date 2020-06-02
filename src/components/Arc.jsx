import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { polarToCartesian } from "../utils";

const ANIMATION_THRESHOLD = 0.01;

const Wrap = styled.path`
  fill: none;
`;

const getD = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

const Arc = ({ x, y, radius, startAngle, endAngle, className }) => {
  const ref = useRef(null);

  const current = useRef({
    radius: 0,
    startAngle: 0,
    endAngle: 0,
  });

  useEffect(() => {
    let raf = null;
    let cRadius = current.current.radius;
    let cStart = current.current.startAngle;
    let cEnd = current.current.endAngle;

    const loop = () => {
      const deltaRadius = radius - cRadius;
      const deltaStart = startAngle - cStart;
      const deltaEnd = endAngle - cEnd;

      if (
        Math.abs(deltaRadius) < ANIMATION_THRESHOLD &&
        Math.abs(deltaStart) < ANIMATION_THRESHOLD &&
        Math.abs(deltaEnd) < ANIMATION_THRESHOLD
      ) {
        ref.current.setAttribute("d", getD(x, y, radius, startAngle, endAngle));
        current.current = { radius, startAngle, endAngle };
        window.cancelAnimationFrame(raf);
      } else {
        cRadius += deltaRadius * 0.04;
        cStart += deltaStart * 0.04;
        cEnd += deltaEnd * 0.04;
        ref.current.setAttribute("d", getD(x, y, cRadius, cStart, cEnd));
        raf = window.requestAnimationFrame(loop);
      }
    };

    raf = window.requestAnimationFrame(loop);

    return () => {
      current.current = { radius: cRadius, startAngle: cStart, endAngle: cEnd };
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, [radius, startAngle, endAngle]);

  return <Wrap ref={ref} className={className} />;
};

export default Arc;
