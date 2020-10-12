import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
// import TileLayer from 'ol/layer/Tile';
import { Vector as VectorLayer, VectorTile as VectorTileLayer } from 'ol/layer';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
// import Circle from 'ol/geom/Circle';
// import MultiPoint from 'ol/geom/MultiPoint';
// import MultiPolygon from 'ol/geom/MultiPolygon';
// import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
// import TileJSON from 'ol/source/TileJSON';
import VectorTileSource from 'ol/source/VectorTile';
// import Stamen from 'ol/source/Stamen';
import GeoJSON from 'ol/format/GeoJSON';
// import TopoJSON from 'ol/format/TopoJSON';
import { fromLonLat } from 'ol/proj';
import Projection from 'ol/proj/Projection';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, ScaleLine } from 'ol/control';

import geojsonvt from 'geojson-vt';

import AnimationMarker from './AnimationMarker';

const getCoor = (coor) => fromLonLat(coor, 'EPSG:3857');

// const createText = (text, offsetY = -14) => {
//   return new Text({
//     textAlign: 'center',
//     textBaseline: 'bottom',
//     text,
//     fill: new Fill({ color: '#fff' }),
//     font: '14px sans-serif',
//     offsetY,
//     backgroundFill: new Fill({ color: '#f00' }),
//     padding: [2, 2, 2, 2],
//     // offsetX: offsetX,
//     // placement: placement,
//     // maxAngle: maxAngle,
//     // overflow: overflow,
//     // rotation: rotation
//   });
// };

// const getVectorMap2 = (json) => {
//   const style = new Style({
//     fill: new Fill({ color: '#f00' })
//   });

//   const features = new TopoJSON({
//     layers:['countries']
//   }).readFeatures(json);

//   return new VectorLayer({
//     source: new VectorSource({
//       features
//     }),
//     style
//   });
// };

// const getMarkerFeature = ({ coor }) => {
//   const boxSize = [20000, 1000];
//   const midSize = [boxSize[0] / 2, boxSize[1] / 2]
//   const coordinates = [
//     [[
//       [coor[0] - midSize[0], coor[1] - midSize[1]],
//       [coor[0] + midSize[0], coor[1] - midSize[1]],
//       [coor[0] + midSize[0], coor[1] + midSize[1]],
//       [coor[0] - midSize[0], coor[1] + midSize[1]]
//     ]]
//   ];

//   return {
//     type: 'Feature',
//     geometry: {
//       type: 'MultiPolygon',
//       coordinates
//     }
//   };
// }

// const getMarkersBackgroundLayer = (points) => {
//   const styles = {
//     'MultiPolygon': new Style({
//       stroke: new Stroke({ color: '#f00', width: 1 }),
//       fill: new Fill({ color: 'rgba(255, 0, 0, 0.1)' })
//     })
//   };

//   const styleFunction = (feature) => {
//     return styles[feature.getGeometry().getType()];
//   };

//   const geojsonObject = {
//     type: 'FeatureCollection',
//     crs: {
//       type: 'name',
//       properties: {
//         'name': 'EPSG:3857'
//       }
//     },
//     features: points.map(getMarkerFeature)
//   };

//   const vectorSource = new VectorSource({
//     features: (new GeoJSON()).readFeatures(geojsonObject)
//   });

//   return  new VectorLayer({
//     source: vectorSource,
//     style: styleFunction
//   });
// };

const getView = (points, defaultZoom) => {
  const extremes = points.reduce((acc, { coor }) => {
    return {
      minX: acc.minX ? Math.min(acc.minX, coor[0]) : coor[0],
      maxX: acc.maxX ? Math.max(acc.maxX, coor[0]) : coor[0],
      minY: acc.minY ? Math.min(acc.minY, coor[1]) : coor[1],
      maxY: acc.maxY ? Math.max(acc.maxY, coor[1]) : coor[1],
    };
  }, {});

  const centerX = extremes.minX + (extremes.maxX - extremes.minX) / 2;
  const centerY = extremes.minY + (extremes.maxY - extremes.minY) / 2;

  const center = [centerX, centerY];
  const boxSize = getCoor([30, 20]);
  const extent = [
    center[0] - boxSize[0] / 2,
    center[1] - boxSize[1] / 2,
    center[0] + boxSize[0] / 2,
    center[1] + boxSize[1] / 2,
  ];

  return new View({
    center,
    zoom: defaultZoom,
    maxZoom: 9,
    extent,
  });
};

const getMarkersLayer = (points) => {
  const features = points.map(
    ({ label, coor, offsetY }) =>
      new Feature({
        type: 'icon',
        geometry: new Point(coor),
        text: label,
        offsetY,
      })
  );

  const style = new Style({
    image: new CircleStyle({
      radius: 4,
      fill: new Fill({ color: '#fff' }),
    }),
  });

  return new VectorLayer({
    source: new VectorSource({ features }),
    style,
  });
};

const getLineLayer = (points) => {
  const style = new Style({
    stroke: new Stroke({ color: '#fff', width: 2, lineDash: [4, 4] }),
  });

  return new VectorLayer({
    source: new VectorSource({
      features: [
        new Feature({
          geometry: new LineString(points.map((point) => point.coor)),
          style,
        }),
      ],
    }),
    style,
  });
};

const replacer = (key, value) => {
  if (value.geometry) {
    let type;
    const rawType = value.type;
    let { geometry } = value;

    if (rawType === 1) {
      type = 'MultiPoint';
      if (geometry.length === 1) {
        type = 'Point';
        geometry[0] = geometry;
      }
    } else if (rawType === 2) {
      type = 'MultiLineString';
      if (geometry.length === 1) {
        type = 'LineString';
        geometry[0] = geometry;
      }
    } else if (rawType === 3) {
      type = 'Polygon';
      if (geometry.length > 1) {
        type = 'MultiPolygon';
        geometry = [geometry];
      }
    }

    return {
      type: 'Feature',
      geometry: {
        type,
        coordinates: geometry,
      },
      properties: value.tags,
    };
  }
  return value;
};

const getVectorMap = (json, highlightIso, colors) => {
  const tileIndex = geojsonvt(json, {
    extent: 4096,
    debug: 1,
  });

  const vectorSource = new VectorTileSource({
    format: new GeoJSON({
      // Data returned from geojson-vt is in tile pixel units
      dataProjection: new Projection({
        code: 'TILE_PIXELS',
        units: 'tile-pixels',
        extent: [0, 0, 4096, 4096],
      }),
    }),
    tileUrlFunction(tileCoord) {
      const data = tileIndex.getTile(tileCoord[0], tileCoord[1], tileCoord[2]);
      const geojsonData = JSON.stringify(
        {
          type: 'FeatureCollection',
          features: data ? data.features : [],
        },
        replacer
      );
      return `data:application/json;charset=UTF-8,${geojsonData}`;
    },
  });

  const style = (feature) => {
    if (feature.get('ISO_A3') === highlightIso) {
      return new Style({
        fill: new Fill({ color: colors.highlight }),
      });
    }
    return new Style({
      fill: new Fill({ color: colors.land }),
    });
  };

  return new VectorTileLayer({
    source: vectorSource,
    style,
  });
};

const createTooltip = (map, point) => {
  const { label, coor, offsetY } = point;
  const tooltipElement = document.createElement('div');
  const classDirection = offsetY ? 'bottom' : 'top';
  const className = `ol-tooltip ol-tooltip-measure ${classDirection} ${label.toLowerCase()}`;
  tooltipElement.className = className;
  tooltipElement.innerHTML = label;
  const tooltip = new Overlay({
    element: tooltipElement,
    offset: [0, offsetY ? 40 : -40],
    positioning: 'center-center',
  });
  tooltip.setPosition(coor);
  map.addOverlay(tooltip);
};

export default ({
  div,
  points,
  geojson,
  icon,
  highlightIso,
  defaultZoom = 6,
  colors = { highlight: '#4531d5', land: '#514799' },
}) => {
  const formatPoints = points.map((point) => ({ ...point, coor: getCoor(point.coor) }));
  const labelPoints = formatPoints.filter((point) => point.label);
  const view = getView(labelPoints, defaultZoom);
  const animMarker = new AnimationMarker(formatPoints, icon);
  const layers = [
    // new TileLayer({ source: new OSM() }),
    // new TileLayer({
    //   source: new Stamen({
    //     layer: 'watercolor'
    //   })
    // }),
    // new TileLayer({
    //   source: new Stamen({
    //     layer: 'terrain-labels'
    //   })
    // }),
    getVectorMap(geojson, highlightIso, colors),
    // getVectorMap2(topojson),
    getLineLayer(labelPoints),
    getMarkersLayer(labelPoints),
    // getMarkersBackgroundLayer(formatPoints),
    animMarker.getVectorLayer(),
  ];

  const map = new Map({
    controls: defaultControls({
      zoom: false,
      rotate: false,
    }).extend([
      new ScaleLine({
        units: 'metric',
      }),
    ]),
    target: div,
    layers,
    view,
  });

  labelPoints.forEach((point) => createTooltip(map, point));

  const start = () => {
    map.un('postrender', start);
    animMarker.setMap(map);
    animMarker.animTooltip(formatPoints[0]);
    animMarker.start(true);
  };

  map.on('postrender', start);
};
