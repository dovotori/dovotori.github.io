/*
t -> elapsedTime: The number of milliseconds the animation has been running
b -> startValue: the value to start at (or the value when the percent complete is 0%)
c -> endValue: the value to end at (or the value when the percent complete is 100%)
d -> totalDuration: The total desired length of the animation in milliseconds

return value lerp between startValue and endValue
*/

/*
t: current time
b: begInnIng value
c: change In value
d: duration
*/
export const linearTween = (t: number, b: number, c: number, d: number) => (c * t) / d + b;
export const easeInQuad = (t: number, b: number, c: number, d: number) => {
  const tt = t / d;
  return c * tt * tt + b;
};
export const easeOutQuad = (t: number, b: number, c: number, d: number) => {
  const tt = t / d;
  return -c * tt * (tt - 2) + b;
};
export const easeInCubic = (t: number, b: number, c: number, d: number) => {
  const tt = t / d;
  return c * tt * tt * tt + b;
};
export const easeOutCubic = (t: number, b: number, c: number, d: number) => {
  const tt = t / d - 1;
  return c * (tt * tt * tt + 1) + b;
};

export const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  let tt = t / (d / 2);
  if (tt < 1) return (c / 2) * tt * tt + b;
  tt -= 1;
  return (-c / 2) * (tt * (tt - 2) - 1) + b;
};

export const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
  let tt = t / (d / 2);
  if (tt < 1) return (c / 2) * tt * tt * tt + b;
  tt -= 2;
  return (c / 2) * (tt * tt * tt + 2) + b;
};

export const easeInQuart = (t: number, b: number, c: number, d: number) => {
  const tt = t / d;
  return c * tt * tt * tt * tt + b;
};
export const easeOutQuart = (t: number, b: number, c: number, d: number) => {
  const tt = t / d - 1;
  return -c * (tt * tt * tt * tt - 1) + b;
};

export const easeInOutQuart = (t: number, b: number, c: number, d: number) => {
  let tt = t / (d / 2);
  if (tt < 1) return (c / 2) * tt * tt * tt * tt + b;
  tt -= 2;
  return (-c / 2) * (tt * tt * tt * tt - 2) + b;
};

export const easeInQuint = (t: number, b: number, c: number, d: number) => {
  const tt = t / d;
  return c * tt * tt * tt * tt * tt + b;
};

export const easeOutQuint = (t: number, b: number, c: number, d: number) => {
  const tt = t / d - 1;
  return c * (tt * tt * tt * tt * tt + 1) + b;
};

export const easeInOutQuint = (t: number, b: number, c: number, d: number) => {
  let tt = t / (d / 2);
  if (tt < 1) return (c / 2) * tt * tt * tt * tt * tt + b;
  tt -= 2;
  return (c / 2) * (tt * tt * tt * tt * tt + 2) + b;
};

export const easeInSine = (t: number, b: number, c: number, d: number) =>
  -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
export const easeOutSine = (t: number, b: number, c: number, d: number) =>
  c * Math.sin((t / d) * (Math.PI / 2)) + b;
export const easeInOutSine = (t: number, b: number, c: number, d: number) =>
  (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
export const easeInExpo = (t: number, b: number, c: number, d: number) =>
  t === 0 ? b : c * 2 ** (10 * (t / d - 1)) + b;
export const easeOutExpo = (t: number, b: number, c: number, d: number) =>
  t === d ? b + c : c * (-(2 ** (-10 * t) / d) + 1) + b;
export const easeInOutExpo = (t: number, b: number, c: number, d: number) => {
  if (t === 0) return b;
  if (t === d) return b + c;
  let tt = t / (d / 2);
  if (tt < 1) return (c / 2) * 2 ** (10 * (tt - 1)) + b;
  tt -= 1;
  return (c / 2) * (-(2 ** (-10 * tt)) + 2) + b;
};

export const easeInCirc = (t: number, b: number, c: number, d: number) => {
  const tt = t / d;
  return -c * (Math.sqrt(1 - tt * tt) - 1) + b;
};

export const easeOutCirc = (t: number, b: number, c: number, d: number) => {
  const tt = t / (d - 1);
  return c * Math.sqrt(1 - tt * tt) + b;
};

export const easeInOutCirc = (t: number, b: number, c: number, d: number) => {
  let tt = t / (d / 2);
  if (tt < 1) return (-c / 2) * (Math.sqrt(1 - tt * tt) - 1) + b;
  tt -= 2;
  return (c / 2) * (Math.sqrt(1 - tt * tt) + 1) + b;
};

export const easeInElastic = (t: number, b: number, c: number, d: number) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  const tt = t / d;
  if (t === 0) return b;
  if (tt === 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
  const tf = t - 1;
  const result = -(a * (2 ** 10 * tf) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
  return result;
};

export const easeOutElastic = (t: number, b: number, c: number, d: number) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  const tt = t / d;
  if (t === 0) return b;
  if (tt === 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
  return a * 2 ** (-10 * tt) * Math.sin(((tt * d - s) * (2 * Math.PI)) / p) + c + b;
};

export const easeInOutElastic = (t: number, b: number, c: number, d: number) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  let tt = t / (d / 2);
  if (t === 0) return b;
  if (tt === 2) return b + c;
  if (!p) p = d * (0.3 * 1.5);
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
  let result = 0;
  if (tt < 1) {
    tt -= 1;
    result = -0.5 * (a * 2 ** (10 * tt) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
  } else {
    tt -= 1;
    result = a * 2 ** (-10 * tt) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b;
  }
  return result;
};

export const easeInBack = (t: number, b: number, c: number, d: number, s?: number) => {
  const ss = s || 1.70158;
  const tt = t / d;
  return c * tt * tt * ((ss + 1) * tt - ss) + b;
};

export const easeOutBack = (t: number, b: number, c: number, d: number, s?: number) => {
  const ss = s || 1.70158;
  const tt = t / d - 1;
  return c * (tt * tt * ((ss + 1) * tt + ss) + 1) + b;
};

export const easeInOutBack = (t: number, b: number, c: number, d: number, s?: number) => {
  const ss = (s || 1.70158) * 1.525;
  let tt = t / d / 2;
  if (tt < 1) return (c / 2) * (tt * tt * ((ss + 1) * tt - s)) + b;
  tt -= 2;
  return (c / 2) * (tt * tt * ((ss + 1) * tt + ss) + 2) + b;
};

export const easeOutBounce = (t: number, b: number, c: number, d: number) => {
  let tt = t / d;
  if (tt < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  }
  if (t < 2 / 2.75) {
    tt -= 1.5 / 2.75;
    return c * (7.5625 * tt * tt + 0.75) + b;
  }
  if (t < 2.5 / 2.75) {
    tt -= 2.25 / 2.75;
    return c * (7.5625 * tt * tt + 0.9375) + b;
  }
  tt -= 2.625 / 2.75;
  return c * (7.5625 * tt * tt + 0.984375) + b;
};

export const lerp = (t: number, b: number, c: number) => (1 - t) * b + t * c; // t time, a start, b end

export default {
  linearTween,
  easeInQuad,
  easeOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutQuad,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeOutBounce,
  lerp,
};
