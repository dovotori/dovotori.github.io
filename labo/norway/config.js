import geojson from 'Assets/json/NOR_SWE_FIN.json';
import car from 'Assets/svg/doublecar.svg';

export default {
  slug: 'norway',
  map: {
    points: [
      { coor: [8, 57] },
      { label: 'Oslo', coor: [10.739, 59.9137] },
      { label: 'Gålå', coor: [9.7786, 61.5124] },
      { label: 'Røros', coor: [11.6896, 62.5707] },
      { label: 'Trondheim', coor: [10.3642, 63.3389] },
      { label: 'Molde', coor: [7.159, 62.7379] },
      { label: 'Ålesund', coor: [6.1985, 62.4524] },
      { label: 'Loen', coor: [6.9197, 61.8642] },
      { label: 'Bergen', coor: [5.4157, 60.3566] },
    ],
    icon: {
      src: car,
      size: [130, 50],
      displacement: [130, 0],
      scale: 0.5,
    },
    highlightIso: 'NOR',
    geojson,
    defaultZoom: 5,
  },
};
