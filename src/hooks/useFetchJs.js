import { useEffect, useState } from "react";

const useFetchJs = (name, hasJs = true) => {
  const [pending, setPending] = useState(true);
  const [js, setJs] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPending(true);
    setError(false);
    setJs(null);
    if (hasJs) {
      const fetchData = async () => {
        setError(false);
        try {
          const chunk = await import(`Labo/${name}/index.js`);
          setJs(chunk);
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
  }, [name, hasJs]);

  return { pending, js, error };
};

export default useFetchJs;
