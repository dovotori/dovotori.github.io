import { useEffect, useRef } from "react";

import useFetchLabo from "../hooks/useFetchLabo";

const Labo = ({ className, slug, hasHtml = false, hasJs = false, onLoad = null }) => {
  const { js, html, isLoaded } = useFetchLabo(slug, hasHtml, hasJs);
  const ref = useRef();

  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      try {
        if (html) {
          ref.current.innerHTML = html.default;
        }
        if (js) {
          await js.default();
        }
      } catch (e) {
        console.error(e);
      }
      if (onLoad) {
        onLoad();
      }
    })();

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
      if (js?.destroy && typeof js.destroy === "function") {
        js.destroy();
      }
    };
  }, [isLoaded, js, html, onLoad]);

  return (
    <div key={slug} className={className} id={slug}>
      <div ref={ref} />
    </div>
  );
};

export default Labo;
