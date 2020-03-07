import React, { useCallback } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
`;

const Bloc = ({ className, children }) => {
  const onScrollTop = useCallback((d) => {
    if (d === null) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Wrap>
      <div className={className} ref={onScrollTop}>
        {children}
      </div>
    </Wrap>
  );
};

export default Bloc;
