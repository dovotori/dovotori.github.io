import React, {
  useRef,
  useCallback,
  useEffect,
} from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Wrap = styled.span`
  position: relative;
  display: inline-block;
`;

const Hidden = styled.span`
  visibility: ${p => p.isVisible ? 'visible': 'hidden'};
`;

const Anim = styled.span`
  position: absolute;
  /* white-space: nowrap; */
  display: inline-block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  white-space: nowrap;
`;

const ANIM_DURATION_RANGE = 30;
const ANIM_FPS = 3000 / 60;
const CHARS = "!<>-_\\/[]{}—=+*^?#________";

const TypingMessage = ({ message, isTouchDevice, isLoop = false }) => {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  const queue = useRef([]);
  const count = useRef(0);
  const lastFrame = useRef(new Date().getTime());
  const req = useRef(null);

  const randomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
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
        ref.current.innerHTML = output;
      }
      lastFrame.current = now;
    }
    if (complete !== queue.current.length) {
      count.current += 1;
      req.current = requestAnimationFrame(update);
    } else if (isLoop) {
      count.current = 0;
      req.current = requestAnimationFrame(update);
    }
  }, []);

  useEffect(() => {
    if (!isTouchDevice) {
      const oldText = message;
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
    <Wrap ref={wrapRef}>
      <Hidden isVisible={isTouchDevice}>{message}</Hidden>
      <Anim ref={ref} />
    </Wrap>
  );
};

const mapStateToProps = state => ({
    isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(TypingMessage);

