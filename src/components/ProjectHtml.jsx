import React, {useCallback, useState} from "react";
import styled from "styled-components";

import Html from "./Html";
import Loader from "./Loader";

const Wrap = styled.div`
  position: relative;
  margin: 0 auto 10vh;
  min-height: 100px;
  text-align: left;
  color: ${(p) => p.theme.light};

  img {
    width: 100%;
    height: auto;
    margin: 1em auto;
    box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  }
`;

const StyledHtml = styled(Html)`
  canvas {
    display: block;
    margin: 0 auto;
    width: auto;
    height: auto;
    max-height: 100vh;
    max-width: 100%;
  }
`;

const ProjectHtml = (props) => {
  const { colorType, className, slug } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const onHtmlLoad = useCallback(() => {setIsLoaded(true);}, [setIsLoaded]);

  return (
    <Wrap className={className}>
      <StyledHtml slug={slug} onLoad={onHtmlLoad} />
      {!isLoaded && <Loader colorType={colorType} className={`loader${slug}`} />}
    </Wrap>
  );
};

export default ProjectHtml;
