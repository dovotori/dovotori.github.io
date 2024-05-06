import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import Bloc from "./Bloc";
import TeasersListContainer from "../containers/TeasersListContainer";
import CategoriesFiltersContainer from "../containers/CategoriesFiltersContainer";
import { setCategory } from "../actions/device";
import { getCategories } from "../selectors";

const StyledHome = styled(Bloc)`
  margin: 0 auto 20vh;
  @media (max-width: 570px) {
    margin-top: 10vh;
  }
`;

const Home = () => {
  const dispatch = useDispatch();
  const category = useParams().category || null;
  const categories = getCategories();
  const categoryId = category
    ? Object.keys(categories).findIndex((k) => {
        const c = categories[k];
        return c.slug === category;
      })
    : -1;

  useEffect(() => {
    dispatch(setCategory(categoryId));
  }, [categoryId]);

  return (
    <StyledHome>
      <CategoriesFiltersContainer />
      <TeasersListContainer />
    </StyledHome>
  );
};

export default Home;
