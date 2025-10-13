export const downloadSVG = (svg, selector, prefix) => {
  const element = document.querySelector(selector);
  element.download = `${prefix}${Date.now()}.svg`;
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  // add name spaces.
  /* if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  } */
  source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  element.href = url;
};

export const later = (delay = 20) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

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
      } else if (queue.length > 0) {
        await later();
        loop();
        return;
      }
      resolve(result);
    };
    loop();
  });

  const setCancelled = () => (cancel = true);

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
