import Feature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { getVectorContext } from 'ol/render';

import house from 'Assets/svg/house.svg';
import plane from 'Assets/svg/doubleplane.svg';

const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let result =
    minDest + ((valeur - minRef) * (maxDest - minDest)) / (maxRef - minRef);
  if (result < Math.min(minDest, maxDest)) {
    result = Math.min(minDest, maxDest);
  }
  if (result > Math.max(minDest, maxDest)) {
    result = Math.max(minDest, maxDest);
  }
  return result;
};

class AnimationMarker {
  constructor(points, icon, isLoop = true) {
    this.now = null;
    this.map = null;
    this.points = points;
    this.step = 0;
    this.animating = false;
    this.speed = 0;
    this.isLoop = isLoop;
    this.DISTANCE_PER_SECOND = 70000;
    this.DISTANCE_PER_SECOND_PLANE = 140000;
    this.DELAY_BETWEEN_LOOP = 10;
    this.DELAY_BETWEEN_SEGMENT = 1000;
    this.timeout = null;
    this.iconStyle = icon;

    this.geoMarker = new Feature({
      type: 'geoMarker',
      geometry: new Point(points[0].coor)
    });

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [this.geoMarker]
      }),
      style: new Style({
        image: new Icon(this.iconStyle)
      })
    });

    this.computeSpeedAndRotation();
  }

  animTooltip = (point) => {
    if (point.label) {
      const tooltip = document.querySelector(`.${point.label.toLowerCase()}`);
      if (tooltip) {
        tooltip.style.transform = "none";
      }
    }
  }

  resetTooltips = () => {
    this.points.forEach(({label}, index) => {
      if (label) {
        const tooltip = document.querySelector(`.${label.toLowerCase()}`);
        if (tooltip) {
          tooltip.style.transform = index === 0 ? "none" : "scale(0)";
        }
      }
    });
  }

  computeSpeedAndRotation = () => {
    const previous = this.points[this.step].coor;
    const next = this.points[this.step + 1].coor;
    const diff = [next[0] - previous[0], next[1] - previous[1]];

    const length = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
    
    const goEast = next[0] > previous[0];
    const goNorth = next[1] > previous[1];

    let rotation = Math.atan(diff[0] / diff[1]);
    let inverse = false;
    if (!goEast && goNorth) { // Nord West
      rotation += (Math.PI * 0.5);
      inverse = true;
    } else if (goEast && goNorth) { // Nord East
      rotation -= (Math.PI * 0.5);
    } else if (goEast && !goNorth) { // South East
      rotation += (Math.PI * 0.5);
    } else { // South West
      rotation -= (Math.PI * 0.5);
      inverse = true;
    }

    const isPlane = this.points[this.step].label === undefined || this.points[this.step + 1].label === undefined;

    if (isPlane) {
      this.geoMarker.setStyle(
        new Style({ image: new Icon({
          src: plane,
          size: [612, 571,19897],
          displacement: inverse ? [612, 0] : [0,0],
          scale: 0.1,
          rotation
        })})
      );
      this.speed = (length / this.DISTANCE_PER_SECOND_PLANE) * 1000;
    } else {
      const newIconStyle = { ...this.iconStyle };
      if (this.iconStyle.size) {
        newIconStyle.displacement = inverse ? [this.iconStyle.size[0],0] : [0,0]
      }

      newIconStyle.rotation = rotation;
      this.geoMarker.setStyle(new Style({
        image: new Icon(newIconStyle)
      }));
      this.speed = (length / this.DISTANCE_PER_SECOND) * 1000;
    }

    this.animTooltip(this.points[this.step]);
  }

  stopOrContinueAnimation = () => {
    if (this.step < this.points.length - 2) {
      this.step++;
      this.stop();
      this.start();
    } else if (this.isLoop) {
      this.step = this.points.length - 1;
      this.stop();
      this.step = 0;
      this.start(true);
    } else {
      this.step = this.points.length - 1;
      this.stop();
    }
  };

  moveFeature = (event) => {
    if (this.animating) {
      const vectorContext = getVectorContext(event);
      const { frameState } = event;

      const elapsedTime = frameState.time - this.now;

      if (elapsedTime < this.speed) {
        const previous = this.points[this.step].coor;
        const next = this.points[this.step + 1].coor;
        const coor = [
          mapFromRange(elapsedTime, 0, this.speed, previous[0], next[0]),
          mapFromRange(elapsedTime, 0, this.speed, previous[1], next[1])
        ];
        this.update(vectorContext, coor);
        this.map.render();
      } else {
        this.stopOrContinueAnimation();
      }
    }
  };

  update = (vectorContext, coor) => {
    const currentPoint = new Point(coor);
    this.geoMarker.setGeometry(currentPoint);
  }

  start = (isNewLoop) => {
    this.req = setTimeout(() => {
      if (isNewLoop) {
        this.resetTooltips();
      }
      this.animating = true;
      this.computeSpeedAndRotation();
      this.now = new Date().getTime();
      this.vectorLayer.on('postrender', this.moveFeature);
      this.map.render();
    }, isNewLoop ? this.DELAY_BETWEEN_LOOP : this.DELAY_BETWEEN_SEGMENT);
  };

  stop = () => {
    if (this.req) {
      clearTimeout(this.req);
    }
    this.animating = false;
    const geometry = this.geoMarker.getGeometry();
    geometry.setCoordinates(this.points[this.step].coor);
    this.geoMarker.setStyle(
      new Style({ image: new Icon({
        src: house,
        scale: 0.08
      })})
    );
    this.animTooltip(this.points[this.step]);
    this.vectorLayer.un('postrender', this.moveFeature);
  }

  setMap(map){ this.map = map; }

  getVectorLayer = () => this.vectorLayer;
}

export default AnimationMarker;
