/*
Delaunay.triangulate(vertices) with 2d vertices [[0, 0], [0, 1], [1, 0]]
return indices
*/
const EPSILON = 1.0 / 1048576.0;

const supertriangle = (vertices) => {
  let xmin = Number.POSITIVE_INFINITY;
  let ymin = Number.POSITIVE_INFINITY;
  let xmax = Number.NEGATIVE_INFINITY;
  let ymax = Number.NEGATIVE_INFINITY;

  for (let i = vertices.length; i--; ) {
    const [x, y] = vertices[i];
    if (x < xmin) xmin = x;
    if (x > xmax) xmax = x;
    if (y < ymin) ymin = y;
    if (y > ymax) ymax = y;
  }

  const dx = xmax - xmin;
  const dy = ymax - ymin;
  const dmax = Math.max(dx, dy);
  const xmid = xmin + dx * 0.5;
  const ymid = ymin + dy * 0.5;

  return [
    [xmid - 20 * dmax, ymid - dmax],
    [xmid, ymid + 20 * dmax],
    [xmid + 20 * dmax, ymid - dmax],
  ];
};

const circumcircle = (vertices, i, j, k) => {
  const [x1, y1] = vertices[i];
  const [x2, y2] = vertices[j];
  const [x3, y3] = vertices[k];
  const fabsy1y2 = Math.abs(y1 - y2);
  const fabsy2y3 = Math.abs(y2 - y3);
  let xc;
  let yc;
  let m1;
  let m2;
  let mx1;
  let mx2;
  let my1;
  let my2;

  /* Check for coincident points */
  if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON) throw new Error('Eek! Coincident points!');

  if (fabsy1y2 < EPSILON) {
    m2 = -((x3 - x2) / (y3 - y2));
    mx2 = (x2 + x3) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (x2 + x1) / 2.0;
    yc = m2 * (xc - mx2) + my2;
  } else if (fabsy2y3 < EPSILON) {
    m1 = -((x2 - x1) / (y2 - y1));
    mx1 = (x1 + x2) / 2.0;
    my1 = (y1 + y2) / 2.0;
    xc = (x3 + x2) / 2.0;
    yc = m1 * (xc - mx1) + my1;
  } else {
    m1 = -((x2 - x1) / (y2 - y1));
    m2 = -((x3 - x2) / (y3 - y2));
    mx1 = (x1 + x2) / 2.0;
    mx2 = (x2 + x3) / 2.0;
    my1 = (y1 + y2) / 2.0;
    my2 = (y2 + y3) / 2.0;
    xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
    yc = fabsy1y2 > fabsy2y3 ? m1 * (xc - mx1) + my1 : m2 * (xc - mx2) + my2;
  }

  const dx = x2 - xc;
  const dy = y2 - yc;
  return { i, j, k, x: xc, y: yc, r: dx * dx + dy * dy };
};

const dedup = (edges) => {
  let i;
  let j;
  let a;
  let b;
  let m;
  let n;

  for (j = edges.length; j; ) {
    b = edges[--j];
    a = edges[--j];

    for (i = j; i; ) {
      n = edges[--i];
      m = edges[--i];

      if ((a === m && b === n) || (a === n && b === m)) {
        edges.splice(j, 2);
        edges.splice(i, 2);
        break;
      }
    }
  }
};

const Delaunay = {
  triangulate: (rawVertices, key) => {
    const n = rawVertices.length;
    let dx;
    let dy;
    let a;
    let b;
    let c;

    /* Bail if there aren't enough vertices to form any triangles. */
    if (n < 3) return [];

    /* Slice out the actual vertices from the passed objects. (Duplicate the
     * array even if we don't, though, since we need to make a supertriangle
     * later on!) */
    const vertices = rawVertices.slice(0);

    if (key) for (let i = n; i--; ) vertices[i] = vertices[i][key];

    /* Make an array of indices into the vertex array, sorted by the
     * vertices' x-position. */
    const indices = new Array(n);

    for (let i = n; i--; ) indices[i] = i;

    indices.sort((i, j) => vertices[j][0] - vertices[i][0]);

    /* Next, find the vertices of the supertriangle (which contains all other
     * triangles), and append them onto the end of a (copy of) the vertex
     * array. */
    const st = supertriangle(vertices);
    vertices.push(st[0], st[1], st[2]);

    /* Initialize the open list (containing the supertriangle and nothing
     * else) and the closed list (which is empty since we havn't processed
     * any triangles yet). */
    const open = [circumcircle(vertices, n + 0, n + 1, n + 2)];
    const closed = [];
    const edges = [];

    /* Incrementally add each vertex to the mesh. */
    for (let i = indices.length; i--; edges.length = 0) {
      c = indices[i];

      /* For each open triangle, check to see if the current point is
       * inside it's circumcircle. If it is, remove the triangle and add
       * it's edges to an edge list. */
      for (let j = open.length; j--; ) {
        /* If this point is to the right of this triangle's circumcircle,
         * then this triangle should never get checked again. Remove it
         * from the open list, add it to the closed list, and skip. */
        dx = vertices[c][0] - open[j].x;
        if (dx > 0.0 && dx * dx > open[j].r) {
          closed.push(open[j]);
          open.splice(j, 1);
        } else {
          /* If we're outside the circumcircle, skip this triangle. */
          dy = vertices[c][1] - open[j].y;
          if (!(dx * dx + dy * dy - open[j].r > EPSILON)) {
            /* Remove the triangle and add it's edges to the edge list. */
            edges.push(open[j].i, open[j].j, open[j].j, open[j].k, open[j].k, open[j].i);
            open.splice(j, 1);
          }
        }
      }

      /* Remove any doubled edges. */
      dedup(edges);

      /* Add a new triangle for each edge. */
      for (let j = edges.length; j; ) {
        b = edges[--j];
        a = edges[--j];
        open.push(circumcircle(vertices, a, b, c));
      }
    }

    /* Copy any remaining open triangles to the closed list, and then
     * remove any triangles that share a vertex with the supertriangle,
     * building a list of triplets that represent triangles. */
    for (let i = open.length; i--; ) closed.push(open[i]);
    open.length = 0;

    for (let i = closed.length; i--; )
      if (closed[i].i < n && closed[i].j < n && closed[i].k < n)
        open.push(closed[i].i, closed[i].j, closed[i].k);

    /* Yay, we're done! */
    return open;
  },
  contains: (tri, p) => {
    /* Bounding box test first, for quick rejections. */
    if (
      (p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
      (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
      (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
      (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1])
    )
      return null;

    const a = tri[1][0] - tri[0][0];
    const b = tri[2][0] - tri[0][0];
    const c = tri[1][1] - tri[0][1];
    const d = tri[2][1] - tri[0][1];
    const i = a * d - b * c;

    /* Degenerate tri. */
    if (i === 0.0) return null;

    const u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i;
    const v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

    /* If we're outside the tri, fail. */
    if (u < 0.0 || v < 0.0 || u + v > 1.0) return null;

    return [u, v];
  },
};

export default Delaunay;
