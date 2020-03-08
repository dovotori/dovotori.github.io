import React, { useCallback } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const Bloc = ({ className, children }) => {
  const onScrollTop = useCallback((d) => {
    if (d === null) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Wrap className={className} ref={onScrollTop}>
      {children}
    </Wrap>
  );
};

export default Bloc;
