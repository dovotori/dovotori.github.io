import "@babel/polyfill";

(async() => {
  const js = await import(`Assets/js/${process.env.NAME}`);
  js.default({ height: '100vh' });
})();