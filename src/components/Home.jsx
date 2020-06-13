import React from "react";
import styled from "styled-components";

import Bloc from "./Bloc";
import SignatureContainer from "../containers/SignatureContainer";
import TeasersListContainer from "../containers/TeasersListContainer";
import CategoriesFiltersContainer from "../containers/CategoriesFiltersContainer";

const StyledHome = styled(Bloc)`
  margin: 20vh auto;
  @media (max-width: 570px) {
    margin-top: 10vh;
  }
`;

const Home = () => (
  <StyledHome>
    <SignatureContainer />
    <CategoriesFiltersContainer />
    <TeasersListContainer />
  </StyledHome>
);

export default Home;
