import { useEffect, useState } from "react";
import styled from "styled-components";

import { blink } from "../themes/animations";

const Div = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Blink = styled.span`
  animation: ${blink} 1s linear infinite;
  color: ${(p) => p.theme.primary};
`;

const CharStream = styled.div`
  color: ${(p) => p.theme.primary};
  ${(p) => p.theme.monospace}
  font-size: 1.2em;
  letter-spacing: 2px;
  min-width: 120px;
  text-align: left;
`;

const CHARS = ["/", "-", "\\", "=", "<", ">", "+", "#"];
const MAX_CHARS = 10;
const INTERVAL_MS = 100;

const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const Loader = ({ className }: { className?: string }) => {
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChars((prev) => {
        const newChar = getRandomChar();
        const updated = [newChar, ...prev];
        if (updated.length > MAX_CHARS) {
          return updated.slice(0, MAX_CHARS);
        }
        return updated;
      });
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <Div className={className}>
      <CharStream>
        <Blink>_</Blink>
        {chars.join("")}
      </CharStream>
    </Div>
  );
};

export default Loader;
