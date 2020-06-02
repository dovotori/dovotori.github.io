import { useEffect, useState } from "react";
import { parseCsv } from "../utils";

const useFetchAssets = (sources) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setPending(true);
      try {
        const promesses = sources.map(async (source) => {
          const { type, path, name } = source;
          const data = await fetch(path);
          const text = await data.text();
          switch (type) {
            case "json":
              return { name, data: JSON.parse(text) };
            case "csv":
              return { name, data: parseCsv(text) };

            default:
              return { name, data: text };
          }
        });
        const assets = await Promise.all(promesses);
        setValue(
          assets.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.data }), {})
        );
      } catch (e) {
        setError(true);
      }
      setPending(false);
    };
    fetchData();
  }, [sources]);

  return { pending, value, error };
};

export default useFetchAssets;
