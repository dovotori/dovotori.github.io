import drawTravelMap from 'Labo/openlayers/TravelMap';
import geojson from 'Assets/json/NOR_SWE_FIN.json';
import car from 'Assets/svg/doublecar.svg';

export default ({ div, height = '512px' } = {}) => {
  const domItem = div;
  domItem.style.width = '100%';
  domItem.style.height = height;

  const START = { coor: [8, 57] };
  const OSLO = { label: 'Oslo', coor: [10.739, 59.9137] };
  const GALA = { label: 'Gålå', coor: [9.7786, 61.5124] };
  const ROROS = { label: 'Røros', coor: [11.6896, 62.5707] };
  const TRONDHEIM = { label: 'Trondheim', coor: [10.3642, 63.3389] };
  const MOLDE = { label: 'Molde', coor: [7.159, 62.7379] };
  const ALESUND = { label: 'Ålesund', coor: [6.1985, 62.4524] };
  const LOEN = { label: 'Loen', coor: [6.9197, 61.8642] };
  const BERGEN = { label: 'Bergen', coor: [5.4157, 60.3566] };
  const points = [START, OSLO, GALA, ROROS, TRONDHEIM, MOLDE, ALESUND, LOEN, BERGEN, OSLO, START];

  const icon = {
    src: car,
    size: [130, 50],
    displacement: [130, 0],
    scale: 0.5,
  };

  drawTravelMap(domItem, points, geojson, icon, 'NOR', 5);
};
