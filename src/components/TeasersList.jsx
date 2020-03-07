import React, { useState } from 'react';
import styled from 'styled-components';

import Teaser from './Teaser';

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
  entries.sort((a, b) => (a.date > b.date ? -1 : 1));
  return (
    <Wrap className={className} isTouchDevice={isTouchDevice}>
      {entries.map((item) => (
        <Teaser
          key={item.id}
          entry={item}
          currentHover={currentHover}
          setCurrentHover={setCurrentHover}
          isTouchDevice={isTouchDevice}
        />
      ))}
    </Wrap>
  );
};

export default TeasersList;
