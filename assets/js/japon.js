import drawTravelMap from 'Labo/openlayers/TravelMap';
import geojson from 'Assets/json/JPN_CHN_PRK_KOR.json';
import train from 'Assets/svg/train2.svg';
// import topojson from 'Assets/json/392_156_410_408.json';

export default ({ height = '400px' } = {}) => {
  const container = document.querySelector("#japon");
  if (container) {
    const content = document.createElement("div");
    content.setAttribute("id", "map");
    content.style.width = "100%";
    content.style.height = height;
    container.appendChild(content);

    const START = { coor: [130.76266, 40] };
    const TOKYO = { label: "Tokyo", coor: [139.76266, 35.68200] };
    const HAKONE = { label: "Hakone", coor: [139.0833, 35.2526], offsetY: 25 };
    const KYOTO = { label: "Kyoto", coor: [135.75777, 35.02291] };
    const HIROSHIMA = { label: "Hiroshima", coor: [132.44975, 34.39636] };
    const OSAKA = { label: "Osaka", coor: [135.4547, 34.6776], offsetY: 25 };
    const MIYAJIMA = { label: "Miyajima", coor: [132.3217, 34.2991], offsetY: 25 };

    const points = [START, TOKYO, HAKONE, KYOTO, MIYAJIMA, HIROSHIMA, OSAKA, START];

    const icon = {
      anchor: [0.5, 0.5],
      src: train,
      scale: 0.1,
    };

    drawTravelMap(points, geojson, icon, "JPN");
  }
};
