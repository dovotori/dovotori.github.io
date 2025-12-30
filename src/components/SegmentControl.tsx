import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: 40px;
  border-radius: 20px;
  background: ${(p) => p.theme.backgroundSubtleGradient};
`;

const Segment = styled.button<{ $selected: boolean }>`
  position: relative;
  z-index: 1;
  padding: 0 20px;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  color: ${(p) => (p.$selected ? p.theme.background : p.theme.text)};
  font-weight: ${(p) => (p.$selected ? 600 : 400)};
  transition: color 300ms ease-out;
  ${(p) => p.theme.monospace}
`;

const Marker = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(p) => p.$left}px;
  width: ${(p) => p.$width}px;
  border-radius: 20px;
  background-color: ${(p) => p.theme.primary};
  transition:
    left 300ms cubic-bezier(0.4, 0, 0.2, 1),
    width 300ms cubic-bezier(0.4, 0, 0.2, 1);
`;

export const SegmentControl = ({
  className,
  items,
  selectedId,
  onClick,
}: {
  className?: string;
  items: { label: string; id: string }[];
  selectedId: string;
  onClick: (id: string) => void;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [markerStyle, setMarkerStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const selectedElement = segmentRefs.current.get(selectedId);
    const wrapElement = wrapRef.current;

    if (selectedElement && wrapElement) {
      const wrapRect = wrapElement.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();

      setMarkerStyle({
        left: selectedRect.left - wrapRect.left,
        width: selectedRect.width,
      });
    }
  }, [selectedId]);

  return (
    <Wrap className={className} ref={wrapRef}>
      <Marker $left={markerStyle.left} $width={markerStyle.width} />
      {items.map((item) => (
        <Segment
          key={item.id}
          ref={(el) => {
            if (el) segmentRefs.current.set(item.id, el);
          }}
          $selected={item.id === selectedId}
          onClick={() => onClick(item.id)}
        >
          {item.label}
        </Segment>
      ))}
    </Wrap>
  );
};

export default SegmentControl;
