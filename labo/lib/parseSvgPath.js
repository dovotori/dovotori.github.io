// https://github.com/jkroso/parse-svg-path
const length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };

const segment = /([astvzqmhlc])([^astvzqmhlc]*)/gi;

const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

const parseValues = (args) => {
  const numbers = args.match(number);
  return numbers ? numbers.map(Number) : [];
};

/**
 * parse an svg path data string. Generates an Array
 * of commands where each command is an Array of the
 * form `[command, arg1, arg2, ...]`
 *
 * @param {String} path
 * @return {Array}
 */

const parseSvgPath = (path) => {
  const data = [];
  path.replace(segment, (_, command, args) => {
    let finalCommand = command;
    let type = command.toLowerCase();
    const parseArgs = parseValues(args);

    // overloaded moveTo
    if (type === 'm' && parseArgs.length > 2) {
      data.push([finalCommand].concat(parseArgs.splice(0, 2)));
      type = 'l';
      finalCommand = finalCommand === 'm' ? 'l' : 'L';
    }

    while (true) {
      if (parseArgs.length === length[type]) {
        parseArgs.unshift(finalCommand);
        return data.push(parseArgs);
      }
      if (parseArgs.length < length[type]) throw new Error('malformed path data');
      data.push([finalCommand].concat(parseArgs.splice(0, length[type])));
    }
  });
  return data;
};

export const getAbsoluteCoor = (path, inverseY = false) => {
  const relPos = { x: 0, y: 0 };
  const data = parseSvgPath(path);
  const inv = inverseY ? -1 : 1;

  return data.reduce((acc, cur) => {
    if ((cur[0] === 'L' || cur[0] === 'M') && cur.length === 3) {
      acc.push([cur[1], cur[2] * inv]);
    } else if ((cur[0] === 'm' || cur[0] === 'l') && cur.length === 3) {
      relPos.x += cur[1];
      relPos.y += cur[2] * inv;
      acc.push([relPos.x, relPos.y]);
    } else if (cur[0] === 'v' && cur.length === 2) {
      relPos.y += cur[1] * inv;
      acc.push([relPos.x, relPos.y]);
    } else if (cur[0] === 'h' && cur.length === 2) {
      relPos.x += cur[1];
      acc.push([relPos.x, relPos.y]);
    } else if (cur[0] === 'z') {
      relPos.x = 0;
      relPos.y = 0;
    }
    return acc;
  }, []);
};

export default parseSvgPath;
