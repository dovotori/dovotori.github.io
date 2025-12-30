import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  position: relative;

  p {
    display: flex;
    flex-wrap: wrap;
    flex-direction: ${(p) => (p.$isVertical ? "column" : "row")};
    line-height: 1;
    align-items: center;
    justify-content: ${(p) => (p.$isCenter ? "center" : "flex-start")};

    span {
      margin: 0 ${(p) => (p.$isVertical ? 0 : "0.2em")} 0 0;
    }
  }
`;

const Hidden = styled.p`
  visibility: ${(p) => (p.$isVisible ? "visible" : "hidden")};
`;

const Anim = styled.p`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: color 500ms linear;
`;

const CHARS = "!<>-_\\/[]{}—=+*^?#";
const Modes = {
  DISAPPEAR: -1,
  APPEAR: 1,
  STOP: 0,
};

const TypingMessage = ({
  message = "",
  isDisabled = false,
  isVertical = false,
  isCenter = false,
  firstMessage = "",
  className,
  isLoop = false,
  delayLoop = 5000, // en ms
  delayLetter = 100, // en ms
}) => {
  const count = useRef(0);
  const lastFrame = useRef(Date.now());
  const req = useRef(null);
  const timeout = useRef(null);
  const fromMessage = useRef(firstMessage);
  const toMessage = useRef(message);
  const mode = useRef(Modes.STOP);
  const [displayMessage, setDisplayMessage] = useState(firstMessage);

  const randomChar = useCallback(
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
    [],
  );
  const randomStr = useCallback(
    (length) => new Array(length).fill(0).map(randomChar).join(""),
    [randomChar],
  );
  const randomCurrentStr = useCallback(
    (str) =>
      str
        .split("")
        .map((car) => {
          if (car === " ") return car;
          if (Math.random() > 0.5) return randomChar();
          return car;
        })
        .join(""),
    [randomChar],
  );

  const update = useCallback(() => {
    const now = Date.now();
    const milli = now - lastFrame.current;
    if (milli < delayLetter) {
      req.current = requestAnimationFrame(update);
      return;
    }

    let text = "";
    switch (mode.current) {
      case Modes.APPEAR: {
        if (count.current < toMessage.current.length) {
          count.current++;
          text = toMessage.current.substring(0, count.current);
          text = randomCurrentStr(text);
        } else {
          text = toMessage.current;
          fromMessage.current = toMessage.current;
          mode.current = Modes.STOP;
        }
        break;
      }
      case Modes.DISAPPEAR: {
        if (count.current > 0) {
          count.current--;
          text = fromMessage.current.substring(0, count.current);
          text = randomCurrentStr(text);
        } else {
          count.current++;
          mode.current = Modes.APPEAR;
          text = randomStr(count.current);
        }
        break;
      }
      default:
        break;
    }

    setDisplayMessage(text);
    lastFrame.current = now;

    if (mode.current !== Modes.STOP) {
      req.current = requestAnimationFrame(update);
    } else if (mode.current === Modes.STOP && isLoop) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        mode.current = Modes.DISAPPEAR;
        req.current = requestAnimationFrame(update);
      }, delayLoop);
    }
  }, [isLoop, delayLoop, delayLetter, randomStr, randomCurrentStr]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: displayMessage
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (!isDisabled) {
      const old = displayMessage;
      let nextMode = Modes.STOP;

      // determine le mode
      if (old.length === 0 && message.length > 0) {
        nextMode = Modes.APPEAR;
        count.current = 0;
      } else if (old.length > 0 && message.length > 0) {
        nextMode = Modes.DISAPPEAR;
        count.current = old.length;
      } else {
        nextMode = Modes.STOP;
      }

      if (req.current) {
        cancelAnimationFrame(req.current);
      }
      if (nextMode !== Modes.STOP) {
        fromMessage.current = old;
        toMessage.current = message;
        lastFrame.current = Date.now();
        mode.current = nextMode;
        req.current = requestAnimationFrame(update);
      }
    }
    return () => {
      if (req.current) {
        cancelAnimationFrame(req.current);
      }
    };
  }, [message, isDisabled, update]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (isLoop) {
      timeout.current = setTimeout(() => {
        mode.current = Modes.DISAPPEAR;
        req.current = requestAnimationFrame(update);
      }, delayLoop);
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [isLoop, delayLoop, update]);

  useEffect(
    () => () => {
      if (req.current) {
        cancelAnimationFrame(req.current);
      }
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    [],
  );

  return (
    <Wrap className={className} $isVertical={isVertical} $isCenter={isCenter}>
      <Hidden $isVisible={isDisabled}>
        {message.split("").map((letter, index) => {
          const key = `${message}${letter}${index}`;
          return <span key={key}>{letter === " " ? `_` : letter}</span>;
        })}
      </Hidden>
      <Anim>
        {displayMessage.split("").map((letter, index) => {
          const key = `${displayMessage}${letter}${index}`;
          return <span key={key}>{letter === " " ? `_` : letter}</span>;
        })}
      </Anim>
    </Wrap>
  );
};

export default TypingMessage;
