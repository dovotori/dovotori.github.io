import styled from "styled-components";

const SIZE = 30;

const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Label = styled.span`
  white-space: nowrap;
  margin-left: 1em;
  cursor: pointer;
  text-transform: uppercase;
  ${(p) => p.theme.monospace}
  font-weight: normal;
`;

const HideInput = styled.input`
  opacity: 0;
  z-index: 0;
  width: ${SIZE * 2}px;
  height: ${SIZE}px;
`;

const ToggleTrack = styled.label`
  cursor: pointer;
`;

const Background = styled.div`
  position: absolute;
  z-index: 0;
  opacity: 1;
  top: 0;
  left: 0;
  width: ${SIZE * 2}px;
  height: ${SIZE}px;
  border-radius: ${SIZE / 2}px;
  background: ${(p) => p.theme.backgroundSubtleGradient};
  transition: background-color 0.2s;
`;

const Circle = styled.div<{ checked: boolean }>`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  display: block;
  border-radius: 50%;
  width: ${SIZE}px;
  height: ${SIZE}px;
  background-color: ${(p) => p.theme.primary};
  margin-left: ${(p) => (p.checked ? SIZE : 0)}px;
  transition:
    background-color 0.2s,
    margin-left 0.2s;
`;

const Toggle = ({
  onClick,
  checked,
  className,
  label,
  id,
  name,
}: {
  onClick: () => void;
  checked: boolean;
  className?: string;
  label: string;
  id: string;
  name?: string;
}) => (
  <CheckBoxWrapper className={className}>
    <HideInput id={id} name={name || id} type="checkbox" checked={checked} onChange={onClick} />
    <ToggleTrack htmlFor={id}>
      <Background />
      <Circle checked={checked} />
      <Label>{label}</Label>
    </ToggleTrack>
  </CheckBoxWrapper>
);

export default Toggle;
