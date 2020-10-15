import drawTravelMap from 'Labo/lib/openlayers/TravelMap';
import config from './config';
// import topojson from 'Assets/json/392_156_410_408.json';

import 'Assets/style/olmap.css';

export default () => {
  const { slug, width = '100%', height = '400px', ...restConfig } = config;
  const domItem = document.querySelector(`#${slug}`);
  domItem.style.width = width;
  domItem.style.height = height;

  drawTravelMap({ div: domItem, ...restConfig.map });
  return null;
};
