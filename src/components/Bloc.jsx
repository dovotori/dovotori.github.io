import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const Bloc = ({ className, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const onScrollTop = useCallback((d) => {
    if (d === null) {
      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <Wrap className={`${className} bloc`} ref={onScrollTop}>
      {children}
    </Wrap>
  );
};

export default Bloc;