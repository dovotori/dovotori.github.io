import { useMemo, useState } from "react";
import type { MyContent } from "src/types";
import styled from "styled-components";
import Teaser from "./Teaser";

const StyledTeaser = styled(Teaser)<{ index: number }>`
  transition-delay: ${(p) => p.index * 10}ms;
`;

const Wrap = styled.div.attrs({
  className: "teasers-list",
})`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: calc(100% - 20px);
  margin: 0 auto;
  max-width: 1400px;
`;

const TeasersList = ({
  entries,
  isTouchDevice,
  className,
}: {
  entries: MyContent["entries"];
  isTouchDevice: boolean;
  className?: string;
}) => {
  const [currentHover, setCurrentHover] = useState("");
  const sortEntries = useMemo(() => entries.sort((a, b) => (a.date > b.date ? -1 : 1)), [entries]);
  return (
    <Wrap className={className}>
      {sortEntries.map((item, index) => (
        <StyledTeaser
          key={item.id}
          category={item.category}
          slug={item.slug}
          title={item.title}
          index={index}
          setCurrentHover={setCurrentHover}
          isTouchDevice={isTouchDevice}
        />
      ))}
    </Wrap>
  );
};

export default TeasersList;
