import geojson from 'Assets/json/JPN_CHN_PRK_KOR.json';
import train from 'Assets/svg/train.svg';

export default {
  slug: 'japon',
  map: {
    points: [
      { coor: [130.76266, 40], picto: 'plane' },
      { label: 'Tokyo', coor: [139.76266, 35.682] },
      { label: 'Hakone', coor: [139.0833, 35.2526], offsetY: 25 },
      { label: 'Kyoto', coor: [135.75777, 35.02291] },
      { label: 'Hiroshima', coor: [132.44975, 34.39636] },
      { label: 'Miyajima', coor: [132.3217, 34.2991], offsetY: 25 },
      { label: 'Osaka', coor: [135.4547, 34.6776], offsetY: 25, picto: 'plane' },
      { coor: [130.76266, 40] },
    ],
    icon: {
      anchor: [0.5, 0.5],
      src: train,
    },
    highlightIso: 'JPN',
    geojson,
    // defaultZoom
  },
};
