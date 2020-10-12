import geojson from 'Assets/json/NOR_SWE_FIN.json';
import car from 'Assets/svg/doublecar.svg';

export default {
  slug: 'norway',
  map: {
    points: {
      START: { coor: [8, 57] },
      OSLO: { label: 'Oslo', coor: [10.739, 59.9137] },
      GALA: { label: 'Gålå', coor: [9.7786, 61.5124] },
      ROROS: { label: 'Røros', coor: [11.6896, 62.5707] },
      TRONDHEIM: { label: 'Trondheim', coor: [10.3642, 63.3389] },
      MOLDE: { label: 'Molde', coor: [7.159, 62.7379] },
      ALESUND: { label: 'Ålesund', coor: [6.1985, 62.4524] },
      LOEN: { label: 'Loen', coor: [6.9197, 61.8642] },
      BERGEN: { label: 'Bergen', coor: [5.4157, 60.3566] },
    },
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
