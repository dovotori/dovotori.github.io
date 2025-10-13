(function (f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define([], f);
  } else {
    let g;
    if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }
    g.geojsonvt = f();
  }
})(function () {
  let define;
  let module;
  let exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          const a = typeof require === 'function' && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          const f = new Error(`Cannot find module '${o}'`);
          throw ((f.code = 'MODULE_NOT_FOUND'), f);
        }
        const l = (n[o] = { exports: {} });
        t[o][0].call(
          l.exports,
          function (e) {
            const n = t[o][1][e];
            return s(n || e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          r,
        );
      }
      return n[o].exports;
    }
    var i = typeof require === 'function' && require;
    for (let o = 0; o < r.length; o++) s(r[o]);
    return s;
  })(
    {
      1: [
        function (require, module, exports) {
          module.exports = clip;

          const createFeature = require('./feature');

          /* clip features between two axis-parallel lines:
           *     |        |
           *  ___|___     |     /
           * /   |   \____|____/
           *     |        |
           */

          function clip(features, scale, k1, k2, axis, minAll, maxAll) {
            k1 /= scale;
            k2 /= scale;

            if (minAll >= k1 && maxAll <= k2) return features; // trivial accept
            if (minAll > k2 || maxAll < k1) return null; // trivial reject

            const clipped = [];

            for (let i = 0; i < features.length; i++) {
              const feature = features[i];
              const { geometry } = feature;
              let { type } = feature;

              const min = axis === 0 ? feature.minX : feature.minY;
              const max = axis === 0 ? feature.maxX : feature.maxY;

              if (min >= k1 && max <= k2) {
                // trivial accept
                clipped.push(feature);
                continue;
              } else if (min > k2 || max < k1) {
                // trivial reject
                continue;
              }

              let newGeometry = [];

              if (type === 'Point' || type === 'MultiPoint') {
                clipPoints(geometry, newGeometry, k1, k2, axis);
              } else if (type === 'LineString') {
                clipLine(geometry, newGeometry, k1, k2, axis, false);
              } else if (type === 'MultiLineString') {
                clipLines(geometry, newGeometry, k1, k2, axis, false);
              } else if (type === 'Polygon') {
                clipLines(geometry, newGeometry, k1, k2, axis, true);
              } else if (type === 'MultiPolygon') {
                for (let j = 0; j < geometry.length; j++) {
                  const polygon = [];
                  clipLines(geometry[j], polygon, k1, k2, axis, true);
                  if (polygon.length) {
                    newGeometry.push(polygon);
                  }
                }
              }

              if (newGeometry.length) {
                if (type === 'LineString' || type === 'MultiLineString') {
                  if (newGeometry.length === 1) {
                    type = 'LineString';
                    newGeometry = newGeometry[0];
                  } else {
                    type = 'MultiLineString';
                  }
                }
                if (type === 'Point' || type === 'MultiPoint') {
                  type = newGeometry.length === 3 ? 'Point' : 'MultiPoint';
                }

                clipped.push(createFeature(feature.id, type, newGeometry, feature.tags));
              }
            }

            return clipped.length ? clipped : null;
          }

          function clipPoints(geom, newGeom, k1, k2, axis) {
            for (let i = 0; i < geom.length; i += 3) {
              const a = geom[i + axis];

              if (a >= k1 && a <= k2) {
                newGeom.push(geom[i]);
                newGeom.push(geom[i + 1]);
                newGeom.push(geom[i + 2]);
              }
            }
          }

          function clipLine(geom, newGeom, k1, k2, axis, isPolygon) {
            let slice = [];
            const intersect = axis === 0 ? intersectX : intersectY;

            for (let i = 0; i < geom.length - 3; i += 3) {
              var ax = geom[i];
              var ay = geom[i + 1];
              var az = geom[i + 2];
              const bx = geom[i + 3];
              const by = geom[i + 4];
              var a = axis === 0 ? ax : ay;
              const b = axis === 0 ? bx : by;
              let sliced = false;

              if (a < k1) {
                // ---|-->  |
                if (b >= k1) intersect(slice, ax, ay, bx, by, k1);
              } else if (a > k2) {
                // |  <--|---
                if (b <= k2) intersect(slice, ax, ay, bx, by, k2);
              } else {
                addPoint(slice, ax, ay, az);
              }
              if (b < k1 && a >= k1) {
                // <--|---  | or <--|-----|---
                intersect(slice, ax, ay, bx, by, k1);
                sliced = true;
              }
              if (b > k2 && a <= k2) {
                // |  ---|--> or ---|-----|-->
                intersect(slice, ax, ay, bx, by, k2);
                sliced = true;
              }

              if (!isPolygon && sliced) {
                slice.size = geom.size;
                newGeom.push(slice);
                slice = [];
              }
            }

            // add the last point
            let last = geom.length - 3;
            ax = geom[last];
            ay = geom[last + 1];
            az = geom[last + 2];
            a = axis === 0 ? ax : ay;
            if (a >= k1 && a <= k2) addPoint(slice, ax, ay, az);

            // close the polygon if its endpoints are not the same after clipping
            last = slice.length - 3;
            if (
              isPolygon &&
              last >= 3 &&
              (slice[last] !== slice[0] || slice[last + 1] !== slice[1])
            ) {
              addPoint(slice, slice[0], slice[1], slice[2]);
            }

            // add the final slice
            if (slice.length) {
              slice.size = geom.size;
              newGeom.push(slice);
            }
          }

          function clipLines(geom, newGeom, k1, k2, axis, isPolygon) {
            for (let i = 0; i < geom.length; i++) {
              clipLine(geom[i], newGeom, k1, k2, axis, isPolygon);
            }
          }

          function addPoint(out, x, y, z) {
            out.push(x);
            out.push(y);
            out.push(z);
          }

          function intersectX(out, ax, ay, bx, by, x) {
            out.push(x);
            out.push(ay + ((x - ax) * (by - ay)) / (bx - ax));
            out.push(1);
          }

          function intersectY(out, ax, ay, bx, by, y) {
            out.push(ax + ((y - ay) * (bx - ax)) / (by - ay));
            out.push(y);
            out.push(1);
          }
        },
        { './feature': 3 },
      ],
      2: [
        function (require, module, exports) {
          module.exports = convert;

          const simplify = require('./simplify');
          const createFeature = require('./feature');

          // converts GeoJSON feature into an intermediate projected JSON vector format with simplification data

          function convert(data, tolerance) {
            const features = [];

            if (data.type === 'FeatureCollection') {
              for (let i = 0; i < data.features.length; i++) {
                convertFeature(features, data.features[i], tolerance);
              }
            } else if (data.type === 'Feature') {
              convertFeature(features, data, tolerance);
            } else {
              // single geometry or a geometry collection
              convertFeature(features, { geometry: data }, tolerance);
            }

            return features;
          }

          function convertFeature(features, geojson, tolerance) {
            if (!geojson.geometry) return;

            const coords = geojson.geometry.coordinates;
            const { type } = geojson.geometry;
            const tol = tolerance * tolerance;
            const geometry = [];

            if (type === 'Point') {
              convertPoint(coords, geometry);
            } else if (type === 'MultiPoint') {
              for (var i = 0; i < coords.length; i++) {
                convertPoint(coords[i], geometry);
              }
            } else if (type === 'LineString') {
              convertLine(coords, geometry, tol, false);
            } else if (type === 'MultiLineString') {
              convertLines(coords, geometry, tol, false);
            } else if (type === 'Polygon') {
              convertLines(coords, geometry, tol, true);
            } else if (type === 'MultiPolygon') {
              for (i = 0; i < coords.length; i++) {
                const polygon = [];
                convertLines(coords[i], polygon, tol, true);
                geometry.push(polygon);
              }
            } else if (type === 'GeometryCollection') {
              for (i = 0; i < geojson.geometry.geometries.length; i++) {
                convertFeature(
                  features,
                  {
                    geometry: geojson.geometry.geometries[i],
                    properties: geojson.properties,
                  },
                  tolerance,
                );
              }
              return;
            } else {
              throw new Error('Input data is not a valid GeoJSON object.');
            }

            features.push(createFeature(geojson.id, type, geometry, geojson.properties));
          }

          function convertPoint(coords, out) {
            out.push(projectX(coords[0]));
            out.push(projectY(coords[1]));
            out.push(0);
          }

          function convertLine(ring, out, tol, isPolygon) {
            let x0;
            let y0;
            let size = 0;

            for (let j = 0; j < ring.length; j++) {
              const x = projectX(ring[j][0]);
              const y = projectY(ring[j][1]);

              out.push(x);
              out.push(y);
              out.push(0);

              if (j > 0) {
                if (isPolygon) {
                  size += (x0 * y - x * y0) / 2; // area
                } else {
                  size += Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)); // length
                }
              }
              x0 = x;
              y0 = y;
            }

            const last = out.length - 3;
            out[2] = 1;
            simplify(out, 0, last, tol);
            out[last + 2] = 1;

            out.size = Math.abs(size);
          }

          function convertLines(rings, out, tol, isPolygon) {
            for (let i = 0; i < rings.length; i++) {
              const geom = [];
              convertLine(rings[i], geom, tol, isPolygon);
              out.push(geom);
            }
          }

          function projectX(x) {
            return x / 360 + 0.5;
          }

          function projectY(y) {
            const sin = Math.sin((y * Math.PI) / 180);
            const y2 = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
            return y2 < 0 ? 0 : y2 > 1 ? 1 : y2;
          }
        },
        { './feature': 3, './simplify': 5 },
      ],
      3: [
        function (require, module, exports) {
          module.exports = createFeature;

          function createFeature(id, type, geom, tags) {
            const feature = {
              id: id || null,
              type,
              geometry: geom,
              tags,
              minX: Infinity,
              minY: Infinity,
              maxX: -Infinity,
              maxY: -Infinity,
            };
            calcBBox(feature);
            return feature;
          }

          function calcBBox(feature) {
            const geom = feature.geometry;
            const { type } = feature;

            if (type === 'Point' || type === 'MultiPoint' || type === 'LineString') {
              calcLineBBox(feature, geom);
            } else if (type === 'Polygon' || type === 'MultiLineString') {
              for (var i = 0; i < geom.length; i++) {
                calcLineBBox(feature, geom[i]);
              }
            } else if (type === 'MultiPolygon') {
              for (i = 0; i < geom.length; i++) {
                for (let j = 0; j < geom[i].length; j++) {
                  calcLineBBox(feature, geom[i][j]);
                }
              }
            }
          }

          function calcLineBBox(feature, geom) {
            for (let i = 0; i < geom.length; i += 3) {
              feature.minX = Math.min(feature.minX, geom[i]);
              feature.minY = Math.min(feature.minY, geom[i + 1]);
              feature.maxX = Math.max(feature.maxX, geom[i]);
              feature.maxY = Math.max(feature.maxY, geom[i + 1]);
            }
          }
        },
        {},
      ],
      4: [
        function (require, module, exports) {
          module.exports = geojsonvt;

          const convert = require('./convert'); // GeoJSON conversion and preprocessing
          const transform = require('./transform'); // coordinate transformation
          const clip = require('./clip'); // stripe clipping algorithm
          const wrap = require('./wrap'); // date line processing
          const createTile = require('./tile'); // final simplified tile generation

          function geojsonvt(data, options) {
            return new GeoJSONVT(data, options);
          }

          function GeoJSONVT(data, options) {
            options = this.options = extend(Object.create(this.options), options);

            if (options.maxZoom < 0 || options.maxZoom > 24)
              throw new Error('maxZoom should be in the 0-24 range');

            const z2 = 1 << options.maxZoom; // 2^z
            let features = convert(data, options.tolerance / (z2 * options.extent));

            this.tiles = {};
            this.tileCoords = [];

            features = wrap(features, options.buffer / options.extent);

            // start slicing from the top tile down
            if (features.length) this.splitTile(features, 0, 0, 0);
          }

          GeoJSONVT.prototype.options = {
            maxZoom: 14, // max zoom to preserve detail on
            indexMaxZoom: 5, // max zoom in the tile index
            indexMaxPoints: 100000, // max number of points per tile in the tile index
            tolerance: 3, // simplification tolerance (higher means simpler)
            extent: 4096, // tile extent
            buffer: 64, // tile buffer on each side
            debug: 0, // logging level (0, 1 or 2)
          };

          GeoJSONVT.prototype.splitTile = function (features, z, x, y, cz, cx, cy) {
            const stack = [features, z, x, y];
            const { options } = this;

            // avoid recursion by using a processing queue
            while (stack.length) {
              y = stack.pop();
              x = stack.pop();
              z = stack.pop();
              features = stack.pop();

              const z2 = 1 << z;
              const id = toID(z, x, y);
              let tile = this.tiles[id];
              const tileTolerance =
                z === options.maxZoom ? 0 : options.tolerance / (z2 * options.extent);

              if (!tile) {
                tile = this.tiles[id] = createTile(
                  features,
                  z2,
                  x,
                  y,
                  tileTolerance,
                  z === options.maxZoom,
                );
                this.tileCoords.push({ z, x, y });
              }

              // save reference to original geometry in tile so that we can drill down later if we stop now
              tile.source = features;

              // if it's the first-pass tiling
              if (!cz) {
                // stop tiling if we reached max zoom, or if the tile is too simple
                if (z === options.indexMaxZoom || tile.numPoints <= options.indexMaxPoints)
                  continue;

                // if a drilldown to a specific tile
              } else {
                // stop tiling if we reached base zoom or our target tile zoom
                if (z === options.maxZoom || z === cz) continue;

                // stop tiling if it's not an ancestor of the target tile
                const m = 1 << (cz - z);
                if (x !== Math.floor(cx / m) || y !== Math.floor(cy / m)) continue;
              }

              // if we slice further down, no need to keep source geometry
              tile.source = null;

              if (features.length === 0) continue;

              // values we'll use for clipping
              const k1 = (0.5 * options.buffer) / options.extent;
              const k2 = 0.5 - k1;
              const k3 = 0.5 + k1;
              const k4 = 1 + k1;
              var tl;
              var bl;
              var tr;
              var br;
              var left;
              var right;

              tl = bl = tr = br = null;

              left = clip(features, z2, x - k1, x + k3, 0, tile.minX, tile.maxX);
              right = clip(features, z2, x + k2, x + k4, 0, tile.minX, tile.maxX);
              features = null;

              if (left) {
                tl = clip(left, z2, y - k1, y + k3, 1, tile.minY, tile.maxY);
                bl = clip(left, z2, y + k2, y + k4, 1, tile.minY, tile.maxY);
                left = null;
              }

              if (right) {
                tr = clip(right, z2, y - k1, y + k3, 1, tile.minY, tile.maxY);
                br = clip(right, z2, y + k2, y + k4, 1, tile.minY, tile.maxY);
                right = null;
              }

              stack.push(tl || [], z + 1, x * 2, y * 2);
              stack.push(bl || [], z + 1, x * 2, y * 2 + 1);
              stack.push(tr || [], z + 1, x * 2 + 1, y * 2);
              stack.push(br || [], z + 1, x * 2 + 1, y * 2 + 1);
            }
          };

          GeoJSONVT.prototype.getTile = function (z, x, y) {
            const { options } = this;
            const { extent } = options;

            if (z < 0 || z > 24) return null;

            const z2 = 1 << z;
            x = ((x % z2) + z2) % z2; // wrap tile x coordinate

            const id = toID(z, x, y);
            if (this.tiles[id]) return transform.tile(this.tiles[id], extent);

            let z0 = z;
            let x0 = x;
            let y0 = y;
            let parent;

            while (!parent && z0 > 0) {
              z0--;
              x0 = Math.floor(x0 / 2);
              y0 = Math.floor(y0 / 2);
              parent = this.tiles[toID(z0, x0, y0)];
            }

            if (!parent || !parent.source) return null;
            this.splitTile(parent.source, z0, x0, y0, z, x, y);
            return this.tiles[id] ? transform.tile(this.tiles[id], extent) : null;
          };

          function toID(z, x, y) {
            return ((1 << z) * y + x) * 32 + z;
          }

          function extend(dest, src) {
            for (const i in src) dest[i] = src[i];
            return dest;
          }
        },
        {
          './clip': 1,
          './convert': 2,
          './tile': 6,
          './transform': 7,
          './wrap': 8,
        },
      ],
      5: [
        function (require, module, exports) {
          module.exports = simplify;

          // calculate simplification data using optimized Douglas-Peucker algorithm

          function simplify(coords, first, last, sqTolerance) {
            let maxSqDist = sqTolerance;
            let index;

            const ax = coords[first];
            const ay = coords[first + 1];
            const bx = coords[last];
            const by = coords[last + 1];

            for (let i = first + 3; i < last; i += 3) {
              const d = getSqSegDist(coords[i], coords[i + 1], ax, ay, bx, by);
              if (d > maxSqDist) {
                index = i;
                maxSqDist = d;
              }
            }

            if (maxSqDist > sqTolerance) {
              if (index - first > 3) simplify(coords, first, index, sqTolerance);
              coords[index + 2] = maxSqDist;
              if (last - index > 3) simplify(coords, index, last, sqTolerance);
            }
          }

          // square distance from a point to a segment
          function getSqSegDist(px, py, x, y, bx, by) {
            let dx = bx - x;
            let dy = by - y;

            if (dx !== 0 || dy !== 0) {
              const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

              if (t > 1) {
                x = bx;
                y = by;
              } else if (t > 0) {
                x += dx * t;
                y += dy * t;
              }
            }

            dx = px - x;
            dy = py - y;

            return dx * dx + dy * dy;
          }
        },
        {},
      ],
      6: [
        function (require, module, exports) {
          module.exports = createTile;

          function createTile(features, z2, tx, ty, tolerance, noSimplify) {
            const tile = {
              features: [],
              numPoints: 0,
              numSimplified: 0,
              numFeatures: 0,
              source: null,
              x: tx,
              y: ty,
              z2,
              transformed: false,
              minX: 2,
              minY: 1,
              maxX: -1,
              maxY: 0,
            };
            for (let i = 0; i < features.length; i++) {
              tile.numFeatures++;
              addFeature(tile, features[i], tolerance, noSimplify);

              const { minX } = features[i];
              const { minY } = features[i];
              const { maxX } = features[i];
              const { maxY } = features[i];

              if (minX < tile.minX) tile.minX = minX;
              if (minY < tile.minY) tile.minY = minY;
              if (maxX > tile.maxX) tile.maxX = maxX;
              if (maxY > tile.maxY) tile.maxY = maxY;
            }
            return tile;
          }

          function addFeature(tile, feature, tolerance, noSimplify) {
            const geom = feature.geometry;
            const { type } = feature;
            const simplified = [];

            if (type === 'Point' || type === 'MultiPoint') {
              for (var i = 0; i < geom.length; i += 3) {
                simplified.push(geom[i]);
                simplified.push(geom[i + 1]);
                tile.numPoints++;
                tile.numSimplified++;
              }
            } else if (type === 'LineString') {
              addLine(simplified, geom, tile, tolerance, noSimplify, false, false);
            } else if (type === 'MultiLineString' || type === 'Polygon') {
              for (i = 0; i < geom.length; i++) {
                addLine(
                  simplified,
                  geom[i],
                  tile,
                  tolerance,
                  noSimplify,
                  type === 'Polygon',
                  i === 0,
                );
              }
            } else if (type === 'MultiPolygon') {
              for (let k = 0; k < geom.length; k++) {
                const polygon = geom[k];
                for (i = 0; i < polygon.length; i++) {
                  addLine(simplified, polygon[i], tile, tolerance, noSimplify, true, i === 0);
                }
              }
            }

            if (simplified.length) {
              const tileFeature = {
                geometry: simplified,
                type:
                  type === 'Polygon' || type === 'MultiPolygon'
                    ? 3
                    : type === 'LineString' || type === 'MultiLineString'
                      ? 2
                      : 1,
                tags: feature.tags || null,
              };
              if (feature.id !== null) {
                tileFeature.id = feature.id;
              }
              tile.features.push(tileFeature);
            }
          }

          function addLine(result, geom, tile, tolerance, noSimplify, isPolygon, isOuter) {
            const sqTolerance = tolerance * tolerance;

            if (!noSimplify && geom.size < (isPolygon ? sqTolerance : tolerance)) {
              tile.numPoints += geom.length / 3;
              return;
            }

            const ring = [];

            for (let i = 0; i < geom.length; i += 3) {
              if (noSimplify || geom[i + 2] > sqTolerance) {
                tile.numSimplified++;
                ring.push(geom[i]);
                ring.push(geom[i + 1]);
              }
              tile.numPoints++;
            }

            if (isPolygon) rewind(ring, isOuter);

            result.push(ring);
          }

          function rewind(ring, clockwise) {
            let area = 0;
            for (var i = 0, len = ring.length, j = len - 2; i < len; j = i, i += 2) {
              area += (ring[i] - ring[j]) * (ring[i + 1] + ring[j + 1]);
            }
            if (area > 0 === clockwise) {
              for (i = 0, len = ring.length; i < len / 2; i += 2) {
                const x = ring[i];
                const y = ring[i + 1];
                ring[i] = ring[len - 2 - i];
                ring[i + 1] = ring[len - 1 - i];
                ring[len - 2 - i] = x;
                ring[len - 1 - i] = y;
              }
            }
          }
        },
        {},
      ],
      7: [
        function (require, module, exports) {
          exports.tile = transformTile;
          exports.point = transformPoint;

          // Transforms the coordinates of each feature in the given tile from
          // mercator-projected space into (extent x extent) tile space.
          function transformTile(tile, extent) {
            if (tile.transformed) return tile;

            const { z2 } = tile;
            const tx = tile.x;
            const ty = tile.y;
            let i;
            let j;
            let k;

            for (i = 0; i < tile.features.length; i++) {
              const feature = tile.features[i];
              const geom = feature.geometry;
              const { type } = feature;

              feature.geometry = [];

              if (type === 1) {
                for (j = 0; j < geom.length; j += 2) {
                  feature.geometry.push(transformPoint(geom[j], geom[j + 1], extent, z2, tx, ty));
                }
              } else {
                for (j = 0; j < geom.length; j++) {
                  const ring = [];
                  for (k = 0; k < geom[j].length; k += 2) {
                    ring.push(transformPoint(geom[j][k], geom[j][k + 1], extent, z2, tx, ty));
                  }
                  feature.geometry.push(ring);
                }
              }
            }

            tile.transformed = true;

            return tile;
          }

          function transformPoint(x, y, extent, z2, tx, ty) {
            return [Math.round(extent * (x * z2 - tx)), Math.round(extent * (y * z2 - ty))];
          }
        },
        {},
      ],
      8: [
        function (require, module, exports) {
          const clip = require('./clip');
          const createFeature = require('./feature');

          module.exports = wrap;

          function wrap(features, buffer) {
            let merged = features;
            const left = clip(features, 1, -1 - buffer, buffer, 0, -1, 2); // left world copy
            const right = clip(features, 1, 1 - buffer, 2 + buffer, 0, -1, 2); // right world copy

            if (left || right) {
              merged = clip(features, 1, -buffer, 1 + buffer, 0, -1, 2) || []; // center world copy

              if (left) merged = shiftFeatureCoords(left, 1).concat(merged); // merge left into center
              if (right) merged = merged.concat(shiftFeatureCoords(right, -1)); // merge right into center
            }

            return merged;
          }

          function shiftFeatureCoords(features, offset) {
            const newFeatures = [];

            for (let i = 0; i < features.length; i++) {
              const feature = features[i];
              const { type } = feature;

              var newGeometry;

              if (type === 'Point' || type === 'MultiPoint' || type === 'LineString') {
                newGeometry = shiftCoords(feature.geometry, offset);
              } else if (type === 'MultiLineString' || type === 'Polygon') {
                newGeometry = [];
                for (var j = 0; j < feature.geometry.length; j++) {
                  newGeometry.push(shiftCoords(feature.geometry[j], offset));
                }
              } else if (type === 'MultiPolygon') {
                newGeometry = [];
                for (j = 0; j < feature.geometry.length; j++) {
                  const newPolygon = [];
                  for (let k = 0; k < feature.geometry[j].length; k++) {
                    newPolygon.push(shiftCoords(feature.geometry[j][k], offset));
                  }
                  newGeometry.push(newPolygon);
                }
              }

              newFeatures.push(createFeature(feature.id, type, newGeometry, feature.tags));
            }

            return newFeatures;
          }

          function shiftCoords(points, offset) {
            const newPoints = [];
            newPoints.size = points.size;

            for (let i = 0; i < points.length; i += 3) {
              newPoints.push(points[i] + offset, points[i + 1], points[i + 2]);
            }
            return newPoints;
          }
        },
        { './clip': 1, './feature': 3 },
      ],
    },
    {},
    [4],
  )(4);
});
