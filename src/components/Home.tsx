import styled from "styled-components";
import CategoriesFiltersContainer from "../containers/CategoriesFiltersContainer";
import TeasersListContainer from "../containers/TeasersListContainer";
import Bloc from "./Bloc";

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
