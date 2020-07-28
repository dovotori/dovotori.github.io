import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import Teaser from './Teaser';

const StyledTeaser = styled(Teaser)`
  transition-delay: ${(p) => p.index * 10}ms;
`;

const Wrap = styled.div.attrs({
  className: 'teasers-list',
})`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: calc(100% - 20px);
  margin-left: 10px;
`;

const TeasersList = ({ entries, isTouchDevice, className }) => {
  const [currentHover, setCurrentHover] = useState('');
  const sortEntries = useMemo(() => entries.sort((a, b) => (a.date > b.date ? -1 : 1)), [
    entries.length,
  ]);
  return (
    <Wrap className={className} isTouchDevice={isTouchDevice}>
      {sortEntries.map((item, index) => (
        <StyledTeaser
          key={item.id}
          entry={item}
          index={index}
          currentHover={currentHover}
          setCurrentHover={setCurrentHover}
          isTouchDevice={isTouchDevice}
        />
      ))}
    </Wrap>
  );
};

export default TeasersList;
