import { Fragment } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getColorType } from "../utils";
import Cross from "./Cross";

const Wrap = styled.div`
  text-align: center;
  max-width: 1400px;
  margin: 4em auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(p) => p.theme.media.mobile`flex-direction: column;`}
`;

const StyledLink = styled(Link)`
  position: relative;
  padding: 1em 2em;
  opacity: ${(p) => (p.selected ? 1 : 0.5)};
  font-weight: ${(p) => (p.selected ? 800 : 400)};
  transition:
    color 100ms ease-out,
    background-color 100ms ease-out,
    box-shadow 100ms ease-out;
  color: ${(p) => p.theme.text};
  text-transform: uppercase;
  ${(p) => p.theme.monospace}
  ${(p) => p.theme.active}
  &:hover {
    opacity: 1;
  }
`;

const CategoriesFilters = ({
  selected,
  className,
  categories,
  onClickCategory = () => {},
}) => (
  <Wrap className={className}>
    {Object.keys(categories).map((categoryId, index) => {
      const isLinkSelected = selected === parseInt(categoryId, 10);
      return (
        <Fragment key={categories[categoryId].slug}>
          {index !== 0 && <Cross $colorType={0} />}
          <StyledLink
            to={
              isLinkSelected ? "/" : `/category/${categories[categoryId].slug}`
            }
            selected={isLinkSelected}
            $colorType={getColorType(parseInt(categoryId, 10))}
            onClick={onClickCategory(categoryId)}
          >
            {categories[categoryId].label}
          </StyledLink>
        </Fragment>
      );
    })}
  </Wrap>
);

export default CategoriesFilters;
