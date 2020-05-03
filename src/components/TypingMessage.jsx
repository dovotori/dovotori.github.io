import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";

const ANIM_DURATION_RANGE = 30;
const ANIM_FPS = 3000 / 60;

const TypingMessage = ({ className, message }) => {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  const queue = useRef([]);
  const count = useRef(0);
  const lastFrame = useRef(new Date().getTime());
  const req = useRef(null);
  const [text, setText] = useState(message);

  const randomChar = useCallback(() => {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  const update = useCallback(() => {
    const now = new Date().getTime();
    const milli = now - lastFrame.current;

    let complete = 0;
    if (milli > ANIM_FPS) {
      let output = "";
      for (let i = 0, n = queue.current.length; i < n; i += 1) {
        const { from, to, start, end } = queue.current[i];
        let { char } = queue.current[i];
        if (count.current >= end) {
          complete += 1;
          output += to;
        } else if (count.current >= start) {
          if (!char || Math.random() < 0.5) {
            char = randomChar();
            queue.current[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }
      if (ref.current && output.length > 0) {
        setText(output);
      }
      lastFrame.current = now;
    }
    if (complete !== queue.current.length) {
      req.current = requestAnimationFrame(update);
      count.current += 1;
    }
  }, []);

  useEffect(() => {
    const oldText = ref.current.innerText;
    const length = Math.max(oldText.length, message.length);
    queue.current = [];
    for (let i = 0; i < length; i += 1) {
      const from = oldText[i] || "";
      const to = message[i] || "";
      const start = Math.floor(Math.random() * ANIM_DURATION_RANGE);
      const end = start + Math.floor(Math.random() * ANIM_DURATION_RANGE);
      queue.current.push({
        from,
        to,
        start,
        end,
      });
    }
    cancelAnimationFrame(req.current);
    count.current = 0;
    lastFrame.current = new Date().getTime();
    req.current = requestAnimationFrame(update);

    return () => {
      if (req.current) {
        cancelAnimationFrame(req.current);
      }
    };
  }, [message]);

  useLayoutEffect(() => {
    wrapRef.current.style.display = "inline-block";
    wrapRef.current.style.height = `${ref.current.offsetHeight}px`;
    ref.current.style.whiteSpace = "no-wrap";
    ref.current.style.position = "absolute";

    return () => {
      if (ref.current) {
        ref.current.style.whiteSpace = "auto";
        ref.current.style.position = "inline";
      }
    };
  }, [message]);

  useEffect(
    () => () => {
      if (req.current) {
        cancelAnimationFrame(req.current);
      }
    },
    []
  );

  return (
    <span ref={wrapRef}>
      <span ref={ref} className={className}>
        {text}
      </span>
    </span>
  );
};

export default TypingMessage;
