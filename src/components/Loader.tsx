import { useEffect, useRef } from "react";
import styled from "styled-components";

import { blink } from "../themes/animations";

const Div = styled.div<{ $colorType?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) => p.theme.getColor};
`;

const Blink = styled.span`
  animation: ${blink} 1s linear infinite;
  color: ${(p) => p.theme.primary};
`;

const CharStream = styled.div`
  color: ${(p) => p.theme.primary};
  ${(p) => p.theme.monospace}
  font-family: monospace;
  letter-spacing: 2px;
  min-width: 120px;
  text-align: left;
`;

const CHARS = ["/", "-", "\\", "=", "<", ">", "+", "#"];
const MAX_CHARS = 10;
const INTERVAL_MS = 100;

const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const Loader = ({ className, $colorType = 0 }: { className?: string; $colorType?: number }) => {
  const charsRef = useRef<string[]>([]);
  const streamRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newChar = getRandomChar();
      charsRef.current = [newChar, ...charsRef.current];
      if (charsRef.current.length > MAX_CHARS) {
        charsRef.current = charsRef.current.slice(0, MAX_CHARS);
      }
      // Direct DOM update
      if (streamRef.current) {
        streamRef.current.textContent = charsRef.current.join("");
      }
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <Div className={className} $colorType={$colorType}>
      <CharStream>
        <Blink>_</Blink>
        <span ref={streamRef} />
      </CharStream>
    </Div>
  );
};

export default Loader;
