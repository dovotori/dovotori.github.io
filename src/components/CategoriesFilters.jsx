import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getColorType } from '../utils';

const Wrap = styled.div`
  text-align: center;
  max-width: 1212px;
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
  transition: color 100ms ease-out, background-color 100ms ease-out, box-shadow 100ms ease-out;
  color: ${(p) => p.theme.text};
  text-transform: uppercase;
  ${(p) => p.theme.monospace}
  ${(p) => p.theme.active}
  &:hover {
    opacity: 1;
  }
`;

const Cross = styled.svg`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${(p) => p.theme.getColor};
  fill: none;
`;

const CategoriesFilters = ({ selected, className, categories }) => (
  <Wrap className={className}>
    {Object.keys(categories).map((categoryId, index) => {
      const isLinkSelected = selected === parseInt(categoryId, 10);
      return (
        <Fragment key={categories[categoryId].slug}>
          {index !== 0 && (
            <Cross viewBox="0 0 10 10">
              <path d="M 0 0 L 10 10 Z M 0 10 L 10 0 Z" />
            </Cross>
          )}
          <StyledLink
            to={isLinkSelected ? '/' : `/category/${categories[categoryId].slug}`}
            selected={isLinkSelected}
            $colorType={getColorType(parseInt(categoryId, 10))}
          >
            {categories[categoryId].label}
          </StyledLink>
        </Fragment>
      );
    })}
  </Wrap>
);

export default CategoriesFilters;
