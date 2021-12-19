import styled from 'styled-components';

import Bloc from './Bloc';
import TeasersListContainer from '../containers/TeasersListContainer';
import CategoriesFiltersContainer from '../containers/CategoriesFiltersContainer';

const StyledHome = styled(Bloc)`
  margin: 0 auto 20vh;
  @media (max-width: 570px) {
    margin-top: 10vh;
  }
`;

const Home = () => (
  <StyledHome>
    <CategoriesFiltersContainer />
    <TeasersListContainer />
  </StyledHome>
);

export default Home;
