import { useEffect, useState } from "react";

const useFetchHtml = (name: string, hasHtml = true) => {
  const [pending, setPending] = useState(true);
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPending(true);
    setError(false);
    setHtml(null);
    if (hasHtml) {
      const fetchData = async () => {
        setError(false);
        try {
          const chunk = await import(`Labo/${name}/inject.html`);
          setHtml(chunk);
        } catch (e) {
          console.error(e);
          setError(true);
        }
        setPending(false);
      };
      fetchData();
    } else {
      setPending(false);
    }
  }, [name, hasHtml]);

  return { pending, html, error };
};

export default useFetchHtml;
