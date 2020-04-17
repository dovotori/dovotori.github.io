import React, { memo } from 'react';
import styled from 'styled-components';

import Bloc from './Bloc';
import SignatureContainer from '../containers/SignatureContainer';
import TeasersListContainer from '../containers/TeasersListContainer';
import CategoriesSelectorContainer from '../containers/CategoriesSelectorContainer';

const StyledHome = styled(Bloc)`
  margin: 20vh auto;
`;

const Home = memo(() => (
  <StyledHome>
    <SignatureContainer />
    <CategoriesSelectorContainer />
    <TeasersListContainer />
  </StyledHome>
));

export default Home;
