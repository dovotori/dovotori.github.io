import { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CategoryId, MyContent } from "src/types";
import styled from "styled-components";
import { getColorType } from "../utils";
import Cross from "./Cross";
import TypingMessage from "./TypingMessage";

const Wrap = styled.div`
  text-align: center;
  max-width: 1400px;
  margin: 4em auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(p) => p.theme.media.mobile`flex-direction: column;`}
`;

const StyledLink = styled(Link)<{ selected: boolean; $colorType?: number }>`
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
  letter-spacing: 0.5em;
  white-space: nowrap;
  &:hover {
    opacity: 1;
  }
`;

const StyledTypingMessage = styled(TypingMessage)`
  text-transform: uppercase;
  letter-spacing: 0.5em;
`;

const CategoriesFilters = ({
  selected,
  className,
  categories,
  onClickCategory,
}: {
  selected: CategoryId;
  className?: string;
  categories: MyContent["categories"];
  onClickCategory: (categoryId: CategoryId) => () => void;
}) => {
  const triggers = useRef({});
  const [, forceUpdate] = useState(0);

  const handleMouseEnter = (categoryId) => {
    triggers.current[categoryId] = (triggers.current[categoryId] || 0) + 1;
    forceUpdate((n) => n + 1);
  };

  return (
    <Wrap className={className}>
      {Object.keys(categories).map((_categoryId, index) => {
        const categoryId = parseInt(_categoryId, 10) as CategoryId;
        const isLinkSelected = selected === categoryId;
        return (
          <Fragment key={categories[categoryId].slug}>
            {index !== 0 && <Cross $colorType={0} />}
            <StyledLink
              to={isLinkSelected ? "/" : `/category/${categories[categoryId].slug}`}
              title={categories[categoryId].label}
              aria-label={categories[categoryId].label}
              selected={isLinkSelected}
              $colorType={getColorType(categoryId)}
              onClick={onClickCategory(categoryId)}
              onMouseEnter={() => handleMouseEnter(categoryId)}
            >
              <StyledTypingMessage
                message={categories[categoryId].label}
                firstMessage={categories[categoryId].label}
                delayLetter={30}
                trigger={triggers.current[categoryId] || 0}
              />
            </StyledLink>
          </Fragment>
        );
      })}
    </Wrap>
  );
};

export default CategoriesFilters;
