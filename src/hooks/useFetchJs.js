import { useEffect, useState } from "react";

const useFetchJs = (name) => {
  const [pending, setPending] = useState(true);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      try {
        const js = await import(`Assets/js/${name}.js`);
        setValue(js);
      } catch (e) {
        console.error(e);
        setError(true);
      }
      setPending(false);
    };
    fetchData();
  }, [name]);

  return { pending, value, error };
};

export default useFetchJs;
