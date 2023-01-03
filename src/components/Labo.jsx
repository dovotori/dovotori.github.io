import { useEffect } from "react";

import useFetchLabo from "../hooks/useFetchLabo";

const Labo = ({
  className,
  slug,
  hasHtml = false,
  hasJs = false,
  onLoad = null,
}) => {
  const { js, html, isLoaded } = useFetchLabo(slug, hasHtml, hasJs);

  useEffect(() => {
    if (isLoaded) {
      const runJs = async () => {
        try {
          if (js) {
            await js.default();
          }
        } catch (e) {
          console.error(e);
        }
        if (onLoad) {
          onLoad();
        }
      };
      runJs();
    }
    return () => {
      if (js && js.destroy && typeof js.destroy === "function") {
        js.destroy();
      }
    };
  }, [isLoaded, js]);

  return (
    <div key={slug} className={className} id={slug}>
      {/* eslint-disable-next-line react/no-danger */}
      {html && <div dangerouslySetInnerHTML={{ __html: html.default }} />}
    </div>
  );
};

export default Labo;
