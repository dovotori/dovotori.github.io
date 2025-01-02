export * from "./i18n";

export const later = (delay = 20) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

// better to use worker
export const heavyProcessSplit = (data, handler) =>
  new Promise((resolve) => {
    const maxtime = 100; // chunk processing time
    const delay = 20; // delay between processes
    const queue = data.concat(); // clone original array
    const result = [];

    const loop = () => {
      const endtime = +new Date() + maxtime;
      do {
        const r = handler(queue.shift());
        result.push(r);
      } while (queue.length > 0 && endtime > +new Date());
      if (queue.length > 0) {
        setTimeout(loop, delay);
        return;
      }
      resolve(result);
    };
    setTimeout(loop, delay);
  });

export const processSplit = (data, handler) => {
  let cancel = false;
  const promise = new Promise((resolve) => {
    const maxtime = 100; // chunk processing time
    const queue = data.concat(); // clone original array
    const result = [];

    const loop = async () => {
      const endtime = +new Date() + maxtime;
      do {
        const r = handler(queue.shift());
        result.push(r);
      } while (queue.length > 0 && endtime > +new Date() && !cancel);
      if (cancel) {
        console.log("cancel");
        return;
      }
      if (queue.length > 0) {
        await later();
        loop();
        return;
      }
      resolve(result);
    };
    loop();
  });

  const setCancelled = () => {
    cancel = true;
  };

  return { promise, setCancelled };
};

/* CANCELLABLE PROMISE
const data = [];
for (var i = 0; i < 500000; i++) data[i] = i;
const Process = (i) => i + 2;
const Done = (result) => console.log(result);

// process all items
const { promise, setCancelled } = processSplit(data, Process);
promise.then(Done);

setTimeout(() => {
  setCancelled();
  console.log('cancelled')
}, 4000);
*/

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const parseCsv = (str) => {
  const lines = str.split("\n");
  const keys = lines?.shift()?.split(",");
  return lines.map((line) => {
    const l = line.split(",");
    return keys?.reduce(
      (acc, cur, index) => ({
        ...acc,
        [cur]: l[index] !== "" ? l[index] : null,
      }),
      {}
    );
  });
};

export const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export const getEnvPath = (path) => {
  return `${process.env.ASSET_PATH || ""}${path}`;
};

export const asyncLoadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = url;
  });
