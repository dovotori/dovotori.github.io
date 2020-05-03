import { useEffect, useState } from "react";

const useFetchJs = (url) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setPending(true);
      try {
        const js = await import(`assets/js/${url}.js`);
        setValue(js);
      } catch (e) {
        setError(true);
      }
      setPending(false);
    };
    fetchData();
  }, [url]);

  return { pending, value, error };
};

export default useFetchJs;
