import React from "react";
import styled from "styled-components";

const CheckBoxWrapper = styled.div`
  position: relative;
`;

const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 24px;
  border-radius: 15px;
  background-color: ${(p) => p.theme.light};
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background-color: ${(p) => p.theme.backgroundHighlight};
    transition: 0.2s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 20px;
  &:checked + ${CheckBoxLabel} {
    background: ${(p) => p.theme.light};
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: background-color 0.2s, margin-left 0.2s;
    }
  }
`;

const Toggle = ({ onClick, checked, className }) => (
  <CheckBoxWrapper className={className}>
    <CheckBox
      id="checkbox"
      type="checkbox"
      onChange={onClick}
      checked={checked}
    />
    <CheckBoxLabel htmlFor="checkbox" />
  </CheckBoxWrapper>
);

export default Toggle;
