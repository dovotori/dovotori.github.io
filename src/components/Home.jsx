import React, { memo } from 'react';
import styled from 'styled-components';

import Bloc from './Bloc';
import Signature from './Signature';
import TeasersListContainer from '../containers/TeasersListContainer';
import CategoriesSelectorContainer from '../containers/CategoriesSelectorContainer';

const StyledHome = styled(Bloc)`
  margin: 10vh auto;
`;

const Home = memo(() => (
  <StyledHome>
    <Signature />
    <CategoriesSelectorContainer />
    <TeasersListContainer />
  </StyledHome>
));

export default Home;
