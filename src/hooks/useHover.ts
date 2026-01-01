import { useEffect, useRef, useState } from "react";

export default function useHover<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onEnter = () => setValue(true);
    const onLeave = () => setValue(false);
    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return { ref, value };
}
