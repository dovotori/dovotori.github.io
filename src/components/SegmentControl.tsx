import { useRef } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(p) => p.theme.backgroundHighlight};
`;

const Div = styled.div<{ $selected: boolean }>`
  white-space: nowrap;
`;

const Marker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  width: 100px;
  border-radius: 20px;
  background-color: ${(p) => p.theme.primary};
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
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Wrap className={className}>
      {items.map((item) => (
        <Div key={item.id} $selected={item.id === selectedId} onClick={() => onClick(item.id)}>
          {item.label}
        </Div>
      ))}
      <Marker ref={ref} />
    </Wrap>
  );
};

export default SegmentControl;
