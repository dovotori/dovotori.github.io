import React from "react";
import styled from "styled-components";

import Html from "./Html";

import Loader from "./Loader";

const Wrap = styled.div`
  position: relative;
  margin: 0 auto 10vh;
  min-height: 100px;
  background: ${(p) => p.theme.getGradient};
  box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  text-align: left;
  color: ${(p) => p.theme.light};

  img {
    width: 100%;
    height: auto;
    margin: 1em auto;
    box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  }
`;

const ProjectHtml = (props) => {
  const { colorType, className, slug } = props;

  return (
    <Wrap className={className}>
      <Html slug={slug} />
      <Loader colorType={colorType} className={`loader${slug}`} />
    </Wrap>
  );
};

export default ProjectHtml;
