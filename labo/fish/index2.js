import { getEnvPath } from '../lib/utils';
import config from './config';
import { Flagellum } from './flagellum';

export default async () => {
  const { slug, width = '100%', height = '400px' } = config;
  const domItem = document.querySelector(`#${slug}`);
  domItem.style.width = width;
  domItem.style.height = height;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  domItem.appendChild(canvas);
  canvas.width = domItem.clientWidth;
  canvas.height = domItem.clientHeight;

  context.strokeStyle = 'white';
  console.log('---init', canvas.width, canvas.height);

  const imgPath = getEnvPath('/img/fish/skin-3.png');
  const img = new Image();
  await new Promise((resolve) => {
    img.onload = () => {
      resolve();
    };
    img.src = imgPath;
  });

  const f = new Flagellum(img);

  window.requestAnimationFrame(function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    f.move();
    f.display(context, img);
    window.setTimeout(() => {
      window.requestAnimationFrame(animate);
    }, 100);
  });
  return null;
};
