import React, { useLayoutEffect } from "react";
import styled from "styled-components";

import useFetchHtml from "../hooks/useFetchHtml";
import useFetchJs from "../hooks/useFetchJs";
// import useFetchAssets from "../hooks/useFetchAssets";
import { getHtmlPath } from "../utils";

const Balise = styled.div`
`;

const Html = ({ className, slug }) => {
   const { pending: pendingHtml, value: html, error: errorHtml } = useFetchHtml(
    getHtmlPath(slug)
  );

  const { pending: pendingJs, value: js, error: errorJs } = useFetchJs(slug);


  useLayoutEffect(() => {
    if (
      !pendingHtml &&
      !errorHtml &&
      !pendingJs &&
      !errorJs &&
      js
    ) {
      js.default();
    }
  }, [
    pendingHtml,
    errorHtml,
    pendingJs,
    js,
    errorJs,
  ]);

  return (
    <Balise className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default Html;