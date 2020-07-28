import '@babel/polyfill';

const { NAME } = process.env;

(async () => {
  const div = document.querySelector(`#${NAME}`);
  const js = await import(`Assets/js/${NAME}`);
  const content = await js.default({ div, height: '100vh' });
  if (div && content) {
    div.appendChild(content);
  }
})();
