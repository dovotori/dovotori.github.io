import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getColorType } from "../utils";

const Wrap = styled.div`
  text-align: center;
  width: calc(100% - 20px);
  max-width: 1212px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${p => p.isTouchDevice ? 0 : '4em'} auto;
  padding-left: 0.4em;
`;

const StyledLink = styled(Link)`
  padding: 1em 2em;
  margin: 1em 0;
  opacity: ${(p) => (p.selected ? 1 : 0.5)};
  transition: color 100ms ease-out, background-color 100ms ease-out,
    box-shadow 100ms ease-out;
  color: ${(p) => (p.selected ? p.theme.background : p.theme.text)};
  background-color: ${(p) => (p.selected ? p.theme.getColor : "none")};
  ${(p) => p.theme.monospace}
  ${(p) => p.theme.active}
  &:hover {
    opacity: 1;
    box-shadow: 2px 2px 2px
      ${(p) => (p.selected ? "none" : p.theme.backgroundHighlight)};
  }
`;

const CategoriesFilters = ({ selected, className, categories, isTouchDevice }) => (
  <Wrap className={className} isTouchDevice={isTouchDevice}>
    {Object.keys(categories).map((categoryId) => {
      const isLinkSelected = selected === parseInt(categoryId, 10);
      return (
        <StyledLink
          key={categories[categoryId].slug}
          to={isLinkSelected ? "/" : `/category/${categories[categoryId].slug}`}
          selected={isLinkSelected}
          colorType={getColorType(parseInt(categoryId, 10))}
        >
          {categories[categoryId].label}
        </StyledLink>
      );
    })}
  </Wrap>
);

export default CategoriesFilters;
