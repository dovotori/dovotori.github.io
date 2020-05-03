import { useEffect, useState } from "react";

const useFetchHtml = (url, hasHtml) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setPending(true);
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          const text = await response.text();
          setValue(text);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      }
      setPending(false);
    };
    if (hasHtml) {
      fetchData();
    }
  }, [url, hasHtml]);

  return { pending, value, error };
};

export default useFetchHtml;
