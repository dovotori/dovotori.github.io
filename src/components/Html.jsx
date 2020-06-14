import React, { useEffect, useRef, useMemo } from "react";

import useFetchHtml from "../hooks/useFetchHtml";
import useFetchJs from "../hooks/useFetchJs";
import { getHtmlPath } from '../utils';

const Html = ({ className, slug, onLoad = null }) => {
  const div = useRef(null);
   const { pending: pendingHtml, value: html, error: errorHtml } = useFetchHtml(
    getHtmlPath(slug)
  );

  const { pending: pendingJs, value: js, error: errorJs } = useFetchJs(slug);

  const isHtmlLoaded = useMemo(
    () => !pendingHtml && !errorHtml && !!html, [pendingHtml, errorHtml, html]
  );
  const isJsLoaded = useMemo(
    () => !pendingJs && !errorJs && !!js, [pendingJs, errorJs, js]
  );
  const isNoJs = useMemo(
    () => !pendingJs && js === null, [pendingJs, errorJs, js]
  );

  useEffect(() => {
    if (isHtmlLoaded && isNoJs) {
      if (onLoad) {
        onLoad();
      }
    }
  }, [isHtmlLoaded, isNoJs, onLoad]);

  useEffect(() => {
    if (isHtmlLoaded && isJsLoaded) {
      const runJs = async () => {
        try {
          const content = await js.default({ div: div.current });
          if (content) {
            div.current.appendChild(content);
          }
          if (onLoad) {
            onLoad();
          }
        } catch (e) {
          console.error(e);
        }
      };
      runJs();
    }
  }, [isHtmlLoaded, isJsLoaded]);

  return (
    <div className={className}>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div ref={div}  />
    </div>
  );
};

export default Html;