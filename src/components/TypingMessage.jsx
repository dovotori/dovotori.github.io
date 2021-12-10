import { useRef, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import usePrevious from '../hooks/usePrevious';

const Wrap = styled.span`
  position: relative;
  display: inline-block;
  overflow: hidden;
`;

const Hidden = styled.span`
  display: flex;
  flex-wrap: wrap;
  visibility: ${(p) => (p.$isVisible ? 'visible' : 'hidden')};
`;

const Anim = styled.span`
  position: absolute;
  display: inline-block;
  top: 0.2em;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Letter = styled.span`
  display: inline-block;
  width: ${(p) => p.width};
  min-width: 0.2em;
  line-height: 1.2;
`;

const ANIM_DURATION_RANGE = 30;
const ANIM_FPS = 3000 / 60;
const CHARS = '!<>-_\\/[]{}—=+*^?#';

const TypingMessage = ({
  message,
  isTouchDevice,
  firstMessage = '',
  className,
  isLoop = false,
  width = 'auto',
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
            let span = `<span className="${className} letter" `;
            span += `style="display:inline-block; width:${width}; min-width: 0.2em;">`;
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
    if (!isTouchDevice) {
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
      <Hidden $isVisible={isTouchDevice}>
        {message.split('').map((letter, index) => {
          const key = `${message}${letter}${index}`;
          return (
            <Letter width={width} key={key}>
              {letter}
            </Letter>
          );
        })}
      </Hidden>
      <Anim ref={animRef} />
    </Wrap>
  );
};

const mapStateToProps = (state) => ({
  isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(TypingMessage);
