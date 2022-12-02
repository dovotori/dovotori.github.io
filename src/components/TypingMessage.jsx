import { useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import usePrevious from '../hooks/usePrevious';

const Wrap = styled.span`
  position: relative;
  overflow: hidden;
`;

const Hidden = styled.span`
  display: flex;
  flex-wrap: wrap;
  visibility: ${(p) => (p.$isVisible ? 'visible' : 'hidden')};
`;

const Anim = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  min-width: 0.2em;
  line-height: 1;
  transition: color 500ms linear;
`;

const Letter = styled.span`
  display: flex;
  min-width: 0.2em;
  line-height: 1;
  overflow: visible;
`;

const ANIM_DURATION_RANGE = 30;
const ANIM_FPS = 3000 / 60;
const CHARS = '!<>-_\\/[]{}—=+*^?#';

const TypingMessage = ({
  message,
  isDisabled = false,
  firstMessage = '',
  className,
  isLoop = false,
  delay = 100, // en ms
}) => {
  const animRef = useRef(null);
  const queue = useRef([]);
  const count = useRef(0);
  const lastFrame = useRef(new Date().getTime());
  const req = useRef(null);
  const timeout = useRef(null);
  const oldMessage = usePrevious(message);
  const fromMessage = useRef(firstMessage);

  const randomChar = useCallback(() => CHARS[Math.floor(Math.random() * CHARS.length)], []);

  const update = useCallback(() => {
    const now = new Date().getTime();
    const milli = now - lastFrame.current;

    let complete = 0;
    if (milli > ANIM_FPS) {
      let output = '';
      for (let i = 0, n = queue.current.length; i < n; i++) {
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
      if (animRef.current && output.length > 0) {
        animRef.current.innerHTML = output
          .split('')
          .map((letter) => {
            let span = `<span class="letter" `;
            span += `style="display:inline-block;">`;
            span += `${letter}</span>`;
            return span;
          })
          .join('');
      }
      lastFrame.current = now;
    }
    if (complete !== queue.current.length) {
      count.current += 1;
      req.current = requestAnimationFrame(update);
    } else if (isLoop) {
      count.current = 0;
      fromMessage.current = message;
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        req.current = requestAnimationFrame(update);
      }, delay);
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDisabled) {
      const old = oldMessage || fromMessage.current;
      const length = Math.max(old.length, message.length);
      queue.current = [];
      for (let i = 0; i < length; i += 1) {
        const from = old.charAt(i) || '';
        const to = message.charAt(i) || '';
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
    }
    return () => {
      if (req.current) {
        cancelAnimationFrame(req.current);
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
    <Wrap className={className}>
      <Hidden $isVisible={isDisabled}>
        {message.split('').map((letter, index) => {
          const key = `${message}${letter}${index}`;
          return (
            <Letter className="hidden-letter" key={key}>
              {letter}
            </Letter>
          );
        })}
      </Hidden>
      <Anim ref={animRef} />
    </Wrap>
  );
};

export default TypingMessage;
