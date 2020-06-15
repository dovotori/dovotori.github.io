import { mapFromRange } from '../../src/utils';

export default () => {
  const carte = document.querySelector('#worldmap');
  const infos = document.querySelector('#infos');
  const camembert = infos.querySelector('svg');
  const legend = infos.querySelector('#legend');
  let PATH_LENGTH = 0;
  const circlePathStartOffset = 0;

  const init = () => {
    PATH_LENGTH = 2 * Math.PI * 7;
    infos.setAttribute('data-hide', '');
  };
  init();

  const resetSelected = () => {
    infos.setAttribute('data-hide', '');
  };

  const updateLegend = (data) => {
    if (data) {
      const { fr, ...rest } = JSON.parse(data);
      infos.querySelector('h3').innerHTML = fr;
      let newOffset = circlePathStartOffset;
      legend.querySelectorAll('p').forEach((p) => {
        p.style.display = 'none';
      });
      camembert.querySelectorAll('circle').forEach((circle) => {
        circle.setAttribute('stroke-dasharray', PATH_LENGTH);
        circle.setAttribute('stroke-dashoffset', PATH_LENGTH);
      });
      Object.keys(rest).forEach((key) => {
        const value = parseFloat(rest[key], 10);
        const arc = camembert.querySelector(`circle.${key}`);
        const dash = mapFromRange(value, 0, 1, 0, PATH_LENGTH);
        arc.setAttribute('stroke-dasharray', `${dash} ${PATH_LENGTH - dash}`);
        arc.setAttribute('stroke-dashoffset', newOffset);
        newOffset += PATH_LENGTH - dash;
        const text = legend.querySelector(`p.${key}`);
        text.style.display = 'inherit';
      });
    } else {
      resetSelected();
    }
  };

  const handleClickPays = (e) => {
    e.stopPropagation();
    resetSelected();
    infos.removeAttribute('data-hide');
    const path = e.target;
    path.setAttribute('data-selected', '');
    const boxCountry = path.getBBox();
    const boxMap = carte.getAttribute('viewBox').split(' ').map((k) => parseFloat(k, 10));
    const { width, height } = carte.parentNode.getBoundingClientRect();
    const centroid = {
      x: boxCountry.x + (boxCountry.width / 2),
      y: boxCountry.y + (boxCountry.height / 2)
    };
    const scaleX = boxMap[2] / boxCountry.width;
    const scaleY = boxMap[3] / boxCountry.height;
    const scale = Math.min(Math.floor(Math.min(scaleX, scaleY)), 8);
    const x = mapFromRange(centroid.x, 0, boxMap[2], (width / 2) * scale, -(width / 2) * scale);
    const y = mapFromRange(centroid.y, 0, boxMap[3], (height / 2) * scale, -(height / 2) * scale);
    carte.setAttribute('style', `transform: translate3d(${x}px, ${y}px, 0px) scale(${scale})`);
    updateLegend(path.getAttribute('data-data'));
  };

  const handleClickMap = () => {
    carte.setAttribute('style', 'transform: scale(1)');
    resetSelected();
  };

  carte.addEventListener('click', handleClickMap, false);
  const countries = carte.querySelectorAll('path');
  countries.forEach((country) => {
    country.addEventListener('click', handleClickPays, false);
  });
};
